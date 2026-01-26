import { Skeleton } from "@/components/ui/skeleton";

export function SupportTicketsSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
