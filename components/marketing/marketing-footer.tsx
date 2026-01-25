import Image from "next/image";
import Link from "next/link";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-end">
          {/* Dev logo (bottom-left in LTR, bottom in RTL) */}
          <div className="w-full sm:w-auto">
            <Link
              href="https://ma-fo.info"
              className="inline-flex items-center gap-3 opacity-90 hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="https://ma-fo.info/logo2.png"
                alt="Developer logo"
                width={120}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-sm text-muted-foreground">Developed by ma-fo.info</span>
            </Link>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-sm text-muted-foreground">© {year} أجور (Ujoors). جميع الحقوق محفوظة.</p>
            <p className="mt-1 text-xs text-muted-foreground">HR • Payroll • Attendance • Saudi Compliance</p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-end">
              <Link href="/privacy" className="hover:text-foreground">
                سياسة الخصوصية
              </Link>
              <span className="opacity-40">•</span>
              <Link href="/terms" className="hover:text-foreground">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
