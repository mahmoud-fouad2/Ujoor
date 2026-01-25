import { AttendanceManager } from "./attendance-manager";

export const metadata = {
  title: "الحضور والانصراف | أجور",
  description: "تسجيل ومتابعة الحضور والانصراف",
};

export default function AttendancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الحضور والانصراف</h2>
          <p className="text-muted-foreground">
            تسجيل ومتابعة الحضور والانصراف اليومي
          </p>
        </div>
      </div>
      <AttendanceManager />
    </div>
  );
}
