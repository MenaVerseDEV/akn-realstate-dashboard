import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative isolate overflow-hidden rounded-none bg-[#e2e8ef]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-0 -translate-x-full animate-[skeleton-shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />
    </div>
  );
}

function SkeletonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}

export { Skeleton, SkeletonGroup };
