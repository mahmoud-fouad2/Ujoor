"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const lastKeyRef = React.useRef<string>("");
  const timerRef = React.useRef<number | null>(null);

  const key = React.useMemo(() => {
    const q = searchParams?.toString();
    return `${pathname}${q ? `?${q}` : ""}`;
  }, [pathname, searchParams]);

  React.useEffect(() => {
    if (!key) return;

    // If the URL changes, ensure we finish any in-flight progress quickly.
    if (lastKeyRef.current && lastKeyRef.current !== key) {
      setProgress(100);
      setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 180);
    }

    lastKeyRef.current = key;

    // Start a short, subtle progress bar after a tiny delay to avoid flashes on instant transitions.
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const startTimer = window.setTimeout(() => {
      setActive(true);
      setProgress(12);

      const incTimer = window.setInterval(() => {
        setProgress((p) => {
          // Ease to ~90% until navigation settles.
          const next = p + (100 - p) * 0.08;
          return clamp(next, 12, 90);
        });
      }, 120);

      return () => window.clearInterval(incTimer);
    }, 120);

    timerRef.current = startTimer;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [key]);

  // Rendered always; hidden when inactive.
  return (
    <div
      aria-hidden
      className={
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden " +
        (active ? "opacity-100" : "opacity-0")
      }
      style={{ transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-blue-500 to-purple-500"
        style={{
          width: `${progress}%`,
          transition: "width 220ms ease",
        }}
      />
    </div>
  );
}
