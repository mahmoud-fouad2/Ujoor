import { DocumentsManager } from "./documents-manager";

export const metadata = {
  title: "المستندات | أجور",
  description: "إدارة مستندات الموظفين",
};

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المستندات</h2>
          <p className="text-muted-foreground">
            رفع وإدارة مستندات الموظفين
          </p>
        </div>
      </div>
      <DocumentsManager />
    </div>
  );
}
