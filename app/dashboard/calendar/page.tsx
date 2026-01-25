import { CalendarView } from "./calendar-view";

export const metadata = {
  title: "التقويم | أجور",
  description: "عرض تقويم الحضور والانصراف",
};

export default function CalendarPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التقويم</h2>
          <p className="text-muted-foreground">
            عرض تقويمي لسجل الحضور والانصراف
          </p>
        </div>
      </div>
      <CalendarView />
    </div>
  );
}
