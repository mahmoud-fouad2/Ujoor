import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaveRequestsStats({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    taken: number;
  };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>إجمالي الطلبات</CardDescription>
          <CardTitle className="text-3xl">{stats.total}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <CardDescription>قيد الانتظار</CardDescription>
          <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardDescription>موافق عليها</CardDescription>
          <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardDescription>مرفوضة</CardDescription>
          <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardDescription>تم أخذها</CardDescription>
          <CardTitle className="text-3xl text-blue-600">{stats.taken}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
