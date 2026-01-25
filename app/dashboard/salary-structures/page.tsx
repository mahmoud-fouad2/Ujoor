import { SalaryStructuresManager } from "./salary-structures-manager";

export default function SalaryStructuresPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">هياكل الرواتب</h1>
          <p className="text-muted-foreground">
            إدارة هياكل الرواتب ومكوناتها
          </p>
        </div>
      </div>
      <SalaryStructuresManager />
    </div>
  );
}
