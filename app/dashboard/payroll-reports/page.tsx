import { PayrollReportsView } from "./payroll-reports-view";

export default function PayrollReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تقارير الرواتب</h1>
          <p className="text-muted-foreground">
            تقارير وإحصائيات شاملة للرواتب
          </p>
        </div>
      </div>
      <PayrollReportsView />
    </div>
  );
}
