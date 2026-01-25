import { DevelopmentPlansManager } from "./development-plans-manager";

export default function DevelopmentPlansPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">خطط التطوير الوظيفي</h1>
          <p className="text-muted-foreground">إدارة خطط تطوير وتدريب الموظفين</p>
        </div>
      </div>
      <DevelopmentPlansManager />
    </div>
  );
}
