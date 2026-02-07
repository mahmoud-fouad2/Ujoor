"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ClipboardList, Home, User } from "lucide-react";

const items = [
  { href: "/m/home", label: "الرئيسية", Icon: Home },
  { href: "/m/attendance", label: "الحضور", Icon: CalendarCheck },
  { href: "/m/requests", label: "الطلبات", Icon: ClipboardList },
  { href: "/m/settings", label: "الملف الشخصي", Icon: User },
] as const;

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(href + "/");
}

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";

  if (pathname === "/m/login") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="grid grid-cols-4 gap-1 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors " +
                (active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className={(active ? "text-primary" : "") + " size-5"} />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
