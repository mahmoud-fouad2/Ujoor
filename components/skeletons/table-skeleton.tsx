import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 6,
  columns = 6,
  showHeader = true,
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border">
      {showHeader ? (
        <div className="border-b bg-muted/30 px-4 py-3">
          <Skeleton className="h-4 w-40" />
        </div>
      ) : null}

      <div className="p-4">
        <div className="space-y-3" role="status" aria-label="Loading">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: columns }).map((__, c) => (
                <Skeleton key={c} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
