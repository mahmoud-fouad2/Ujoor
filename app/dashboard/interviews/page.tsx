import { InterviewsManager } from "./interviews-manager";

export default function InterviewsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المقابلات</h1>
          <p className="text-muted-foreground">جدولة وإدارة المقابلات مع المرشحين</p>
        </div>
      </div>
      <InterviewsManager />
    </div>
  );
}
