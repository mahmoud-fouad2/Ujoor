import { LoansManager } from "./loans-manager";

export default function LoansPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">القروض والسلف</h1>
          <p className="text-muted-foreground">
            إدارة قروض وسلف الموظفين
          </p>
        </div>
      </div>
      <LoansManager />
    </div>
  );
}
