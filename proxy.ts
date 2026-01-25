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

  // Root should always render the marketing landing page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Enforce tenant context for dashboard (except super-admin)
  if (isDashboard && !isSuperAdmin && !effectiveTenant) {
    // Allow localhost/IP for dev
    const cleanHost = stripPort(host).toLowerCase();
    const isLocalDev = cleanHost === "localhost" || /^[0-9.]+$/.test(cleanHost);
    if (!isLocalDev) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("tenantRequired", "1");
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
