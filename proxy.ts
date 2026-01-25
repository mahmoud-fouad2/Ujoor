import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LOCALE = "ar";
const DEFAULT_UI_THEME = "shadcn";

const RESERVED_SUBDOMAINS = new Set(["www", "admin", "app", "api"]);

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

  // Dashboard needs tenant context (except super-admin area)
  const isDashboard = pathname.startsWith("/dashboard");
  const isSuperAdmin = pathname.startsWith("/dashboard/super-admin");

  // Redirect root to landing page (or dashboard if needed)
  if (pathname === "/") {
    // Landing page for non-tenant hosts
    // return NextResponse.next();
    // For now redirect to dashboard (remove this later for production landing)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Enforce tenant context for dashboard (except super-admin)
  if (isDashboard && !isSuperAdmin && !tenantSlug) {
    // Allow localhost/IP for dev
    const cleanHost = stripPort(host).toLowerCase();
    const isLocalDev = cleanHost === "localhost" || /^[0-9.]+$/.test(cleanHost);
    if (!isLocalDev) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("tenantRequired", "1");
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

  if (tenantSlug) {
    res.headers.set("x-tenant-slug", tenantSlug);
    res.cookies.set("ujoors_tenant", tenantSlug, { path: "/", sameSite: "lax" });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)$).*)"
  ]
};
