import { CSVImportManager } from "./csv-import-manager";

export const metadata = {
  title: "استيراد البيانات | أجور",
  description: "استيراد بيانات الموظفين من ملفات CSV",
};

export default function ImportPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">استيراد البيانات</h2>
          <p className="text-muted-foreground">
            استيراد بيانات الموظفين بشكل جماعي من ملفات CSV
          </p>
        </div>
      </div>
      <CSVImportManager />
    </div>
  );
}
