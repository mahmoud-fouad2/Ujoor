import type { Metadata } from "next";
import MobileBottomNav from "@/components/mobile/mobile-bottom-nav";

export const metadata: Metadata = {
  title: "Ujoor Mobile",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/20">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">{children}</div>
      <MobileBottomNav />
    </div>
  );
}
