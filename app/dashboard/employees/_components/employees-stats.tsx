import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeesStats({
  totalEmployees,
  activeCount,
  onboardingCount,
  departmentsCount,
}: {
  totalEmployees: number;
  activeCount: number;
  onboardingCount: number;
  departmentsCount: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>إجمالي الموظفين</CardDescription>
          <CardTitle className="text-3xl">{totalEmployees}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>نشطين</CardDescription>
          <CardTitle className="text-3xl text-green-600">{activeCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>قيد التعيين</CardDescription>
          <CardTitle className="text-3xl text-blue-600">{onboardingCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>الأقسام</CardDescription>
          <CardTitle className="text-3xl">{departmentsCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
