import { PayslipsManager } from "./payslips-manager";

export default function PayslipsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">قسائم الرواتب</h1>
          <p className="text-muted-foreground">
            عرض وإرسال قسائم الرواتب للموظفين
          </p>
        </div>
      </div>
      <PayslipsManager />
    </div>
  );
}
