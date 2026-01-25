import { ShiftsManager } from "./shifts-manager";

export const metadata = {
  title: "الورديات | أجور",
  description: "إدارة ورديات العمل",
};

export default function ShiftsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الورديات</h2>
          <p className="text-muted-foreground">
            إدارة ورديات العمل وأوقات الدوام
          </p>
        </div>
      </div>
      <ShiftsManager />
    </div>
  );
}
