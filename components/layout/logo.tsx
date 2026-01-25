import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 px-5 py-4 font-bold", className)}>
      <div className="size-5 rounded bg-primary text-primary-foreground grid place-items-center">
        <span className="text-[10px] font-semibold">U</span>
      </div>
      Ujoors (أجور)
    </Link>
  );
}
