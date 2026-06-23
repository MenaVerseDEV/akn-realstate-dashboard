import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

function FormSectionSkeleton() {
  return (
    <div className="space-y-3 border border-border bg-bg-card p-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function FormLoadingSkeleton() {
  return (
    <SkeletonGroup className="gap-6">
      <Skeleton className="h-8 w-40" />
      <FormSectionSkeleton />
      <FormSectionSkeleton />
    </SkeletonGroup>
  );
}

function TableLoadingSkeleton() {
  return (
    <SkeletonGroup className="gap-4">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="overflow-hidden border border-border bg-bg-card">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full border-t border-border" />
        ))}
      </div>
    </SkeletonGroup>
  );
}

function GridLoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  );
}

function PageLoadingSkeleton() {
  return (
    <SkeletonGroup className="gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4 border border-border bg-bg-card p-6">
        <Skeleton className="h-5 w-36" />
        <div className="flex items-end gap-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        <SkeletonGroup>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </SkeletonGroup>
      </div>
    </SkeletonGroup>
  );
}

export {
  FormLoadingSkeleton,
  TableLoadingSkeleton,
  GridLoadingSkeleton,
  PageLoadingSkeleton,
};
