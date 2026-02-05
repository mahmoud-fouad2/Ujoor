import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LOCALE = "ar";
const DEFAULT_UI_THEME = "shadcn";

const RESERVED_SUBDOMAINS = new Set(["www", "admin", "app", "api"]);

function isValidTenantSlug(value: string): boolean {
  return /^[a-z0-9-]{3,30}$/.test(value);
}

function safeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

function stripPort(host: string): string {
  const idx = host.indexOf(":");
  return idx === -1 ? host : host.slice(0, idx);
}

function getTenantSlugFromHost(host: string, baseDomain: string): string | null {
  const cleanHost = stripPort(host).toLowerCase();

  // Local dev: tenant.localhost
  if (cleanHost.endsWith(".localhost")) {
    const sub = cleanHost.slice(0, -".localhost".length);
    if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
    return sub;
  }

  // Production: tenant.<baseDomain>
  const bd = baseDomain.toLowerCase();
  if (bd && cleanHost.endsWith(`.${bd}`)) {
    const sub = cleanHost.slice(0, -(bd.length + 1));
    if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
    return sub;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const baseDomain = process.env.UJOORS_BASE_DOMAIN ?? "";
  const tenantSlug = getTenantSlugFromHost(host, baseDomain);
  const tenantCookie = request.cookies.get("ujoors_tenant")?.value ?? null;
  const effectiveTenant = tenantSlug || tenantCookie;

  // Allow selecting tenant on non-subdomain hosts via path: /t/<tenantSlug>[/nextPath]
  // Useful for Render default domain without custom DNS.
  if (pathname === "/t" || pathname.startsWith("/t/")) {
    const rest = pathname.slice("/t".length); // "" | "/slug" | "/slug/anything"
    const parts = rest.split("/").filter(Boolean);
    const slug = parts[0] ?? "";
    if (slug && isValidTenantSlug(slug)) {
      const nextPathFromQuery = safeNextPath(request.nextUrl.searchParams.get("next"));
      const nextPathFromPath = parts.length > 1 ? `/${parts.slice(1).join("/")}` : null;
      const nextPath = nextPathFromQuery ?? nextPathFromPath ?? "/dashboard";

      const url = new URL(nextPath, request.url);
      const res = NextResponse.redirect(url);
      res.cookies.set("ujoors_tenant", slug, { path: "/", sameSite: "lax" });
      res.headers.set("x-tenant-slug", slug);
      return res;
    }
  }

  // Locale prefixes: keep Arabic default, support /en (and /ar) for clean URLs.
  // We rewrite internally to the non-prefixed path but pass locale via request header
  // so server components/rendering pick the correct language on the same request.
  const isEnPrefix = pathname === "/en" || pathname.startsWith("/en/");
  const isArPrefix = pathname === "/ar" || pathname.startsWith("/ar/");
  if (isEnPrefix || isArPrefix) {
    const locale = isEnPrefix ? "en" : "ar";
    const stripped = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";

    const url = request.nextUrl.clone();
    url.pathname = stripped;

    const nextHeaders = new Headers(request.headers);
    nextHeaders.set("x-ujoors-locale", locale);

    const res = NextResponse.rewrite(url, { request: { headers: nextHeaders } });
    res.cookies.set("ujoors_locale", locale, { path: "/", sameSite: "lax" });
    return res;
  }

  // Allow setting locale via query param (for SEO hreflang links)
  const lang = request.nextUrl.searchParams.get("lang");
  if (lang === "ar" || lang === "en") {
    const nextPath =
      safeNextPath(request.nextUrl.searchParams.get("next")) ??
      (pathname + (request.nextUrl.search ? request.nextUrl.search : ""));

    const url = new URL(nextPath, request.url);
    url.searchParams.delete("lang");
    url.searchParams.delete("next");

    const res = NextResponse.redirect(url);
    res.cookies.set("ujoors_locale", lang, { path: "/", sameSite: "lax" });
    return res;
  }

  // Allow selecting tenant on non-subdomain hosts (e.g. Render) via query param
  const tenantFromQuery = request.nextUrl.searchParams.get("tenant");
  if (tenantFromQuery && isValidTenantSlug(tenantFromQuery)) {
    const nextPath = safeNextPath(request.nextUrl.searchParams.get("next")) ?? "/dashboard";
    const url = new URL(nextPath, request.url);
    const res = NextResponse.redirect(url);
    res.cookies.set("ujoors_tenant", tenantFromQuery, { path: "/", sameSite: "lax" });
    res.headers.set("x-tenant-slug", tenantFromQuery);
    return res;
  }

  // Dashboard needs tenant context (except super-admin area)
  const isDashboard = pathname.startsWith("/dashboard");
  const isSuperAdmin = pathname.startsWith("/dashboard/super-admin");
  const isTenantOptionalDashboardPath =
    pathname.startsWith("/dashboard/my-profile") ||
    pathname.startsWith("/dashboard/notifications") ||
    pathname.startsWith("/dashboard/account");

  // Root should always render the marketing landing page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Enforce tenant context for dashboard (except super-admin)
  if (isDashboard && !isSuperAdmin && !isTenantOptionalDashboardPath && !effectiveTenant) {
    // Allow localhost/IP for dev
    const cleanHost = stripPort(host).toLowerCase();
    const isLocalDev = cleanHost === "localhost" || /^[0-9.]+$/.test(cleanHost);
    if (!isLocalDev) {
      const url = request.nextUrl.clone();
      url.pathname = "/select-tenant";
      url.searchParams.set("next", pathname + (request.nextUrl.search ? request.nextUrl.search : ""));
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  if (!request.cookies.get("ujoors_locale")?.value) {
    res.cookies.set("ujoors_locale", DEFAULT_LOCALE, { path: "/", sameSite: "lax" });
  }

  if (!request.cookies.get("ujoors_ui_theme")?.value) {
    res.cookies.set("ujoors_ui_theme", DEFAULT_UI_THEME, { path: "/", sameSite: "lax" });
  }

  if (effectiveTenant) {
    res.headers.set("x-tenant-slug", effectiveTenant);
    // Keep cookie in sync even when tenant comes from subdomain
    res.cookies.set("ujoors_tenant", effectiveTenant, { path: "/", sameSite: "lax" });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)$).*)"
  ]
};
