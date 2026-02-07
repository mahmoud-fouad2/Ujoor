"use client";

import Link from "next/link";
import { Bell, Megaphone, User } from "lucide-react";

export default function MobileHeader({ dateText }: { dateText: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Link
          href="/m/settings"
          className="inline-flex size-9 items-center justify-center rounded-full border bg-background"
          aria-label="Profile"
        >
          <User className="size-5" />
        </Link>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border bg-background"
          aria-label="Notifications"
          onClick={() => {
            // Reserved for future push/in-app notifications
          }}
        >
          <Bell className="size-5" />
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border bg-background"
          aria-label="Announcements"
          onClick={() => {
            // Reserved for future announcements
          }}
        >
          <Megaphone className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{dateText}</span>
      </div>
    </div>
  );
}
