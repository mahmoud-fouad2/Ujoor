import { TrainingCoursesManager } from "./training-courses-manager";

export default function TrainingCoursesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الدورات التدريبية</h1>
          <p className="text-muted-foreground">إدارة برامج التدريب والتطوير</p>
        </div>
      </div>
      <TrainingCoursesManager />
    </div>
  );
}
