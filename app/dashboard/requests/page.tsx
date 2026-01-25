import { RequestsManager } from "./requests-manager";

export const metadata = {
  title: "الطلبات | أجور",
  description: "إدارة طلبات الحضور والانصراف",
};

export default function RequestsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الطلبات</h2>
          <p className="text-muted-foreground">
            تقديم ومتابعة طلبات الحضور والانصراف
          </p>
        </div>
      </div>
      <RequestsManager />
    </div>
  );
}
