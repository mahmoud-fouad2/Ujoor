"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isValidTenantSlug(value: string): boolean {
  return /^[a-z0-9-]{3,30}$/.test(value);
}

export function TenantAccess({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [tenant, setTenant] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = tenant.trim().toLowerCase();
    if (!isValidTenantSlug(value)) {
      setError("اكتب اسم الشركة (slug) بحروف صغيرة/أرقام/شرطة فقط");
      return;
    }
    setError(null);

    const params = new URLSearchParams({ tenant: value });
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      params.set("next", nextPath);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        value={tenant}
        onChange={(e) => setTenant(e.target.value)}
        placeholder="مثال: demo"
        className="sm:w-64"
        aria-label="Tenant slug"
      />
      <Button type="submit">الدخول للداشبورد</Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
