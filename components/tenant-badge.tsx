import { cookies, headers } from "next/headers";

export async function TenantBadge() {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const tenantFromHeader = headerStore.get("x-tenant-slug");
  const tenantFromCookie = cookieStore.get("ujoors_tenant")?.value;

  const tenant = tenantFromHeader || tenantFromCookie || "platform";

  return (
    <div className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
      Tenant: <span className="font-medium text-foreground">{tenant}</span>
    </div>
  );
}
