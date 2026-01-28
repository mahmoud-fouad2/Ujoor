import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestActions } from "./request-actions";

function mapStatus(status: string): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (status === "PENDING") return { label: "معلقة", variant: "secondary" };
  if (status === "APPROVED") return { label: "مقبولة", variant: "default" };
  return { label: "مرفوضة", variant: "destructive" };
}

export default async function SuperAdminRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    // Keep behavior consistent with the rest of admin APIs.
    notFound();
  }

  const { id } = await params;

  const item = await prisma.tenantRequest.findUnique({ where: { id } });
  if (!item) notFound();

  const status = mapStatus(item.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">تفاصيل طلب الاشتراك</h1>
          <p className="text-muted-foreground">مراجعة بيانات الشركة والتواصل</p>
        </div>
        <Link
          href="/dashboard/super-admin/requests"
          className="text-sm text-primary hover:underline"
        >
          العودة إلى الطلبات
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{item.companyNameAr ?? item.companyName}</CardTitle>
            <CardDescription>{item.companyNameAr ? item.companyName : null}</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">اسم جهة التواصل</div>
              <div className="text-sm text-muted-foreground">{item.contactName}</div>
            </div>
            <div>
              <div className="text-sm font-medium">البريد الإلكتروني</div>
              <div className="text-sm text-muted-foreground">{item.contactEmail}</div>
            </div>
            <div>
              <div className="text-sm font-medium">الهاتف</div>
              <div className="text-sm text-muted-foreground">{item.contactPhone ?? "—"}</div>
            </div>
            <div>
              <div className="text-sm font-medium">عدد الموظفين</div>
              <div className="text-sm text-muted-foreground">{item.employeeCount ?? "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">رسالة</div>
            <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
              {item.message ?? "—"}
            </div>
          </div>

          <div className="pt-2">
            <RequestActions requestId={item.id} status={item.status} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
