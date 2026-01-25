import { ReportsView } from "./reports-view";

export const metadata = {
  title: "التقارير | أجور",
  description: "تقارير الحضور والانصراف",
};

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التقارير</h2>
          <p className="text-muted-foreground">
            تقارير وإحصائيات الحضور والانصراف
          </p>
        </div>
      </div>
      <ReportsView />
    </div>
  );
}
