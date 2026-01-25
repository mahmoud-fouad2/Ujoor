import { PayrollProcessingManager } from "./payroll-manager";

export default function PayrollPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مسير الرواتب</h1>
          <p className="text-muted-foreground">
            معالجة وإدارة الرواتب الشهرية
          </p>
        </div>
      </div>
      <PayrollProcessingManager />
    </div>
  );
}
