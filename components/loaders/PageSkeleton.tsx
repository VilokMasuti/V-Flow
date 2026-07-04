import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  variant?: "list" | "detail" | "profile" | "community";
  className?: string;
};

const PageSkeleton = ({ variant = "list", className }: PageSkeletonProps) => {
  if (variant === "profile") {
    return (
      <section className={cn("w-full space-y-8", className)}>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Skeleton className="size-[140px] rounded-full" />

            <div className="w-full space-y-3 sm:min-w-[280px]">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[90%]" />
              </div>
            </div>
          </div>

          <Skeleton className="h-12 w-full sm:w-44" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border/40 bg-background/60 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:max-w-[280px] space-y-3">
            <Skeleton className="h-6 w-28" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "community") {
    return (
      <section className={cn("w-full", className)}>
        <Skeleton className="h-9 w-40" />

        <div className="mt-6 flex gap-3 max-sm:flex-col sm:items-center">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
        </div>

        <div className="mt-6 flex flex-wrap gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-56 w-full rounded-2xl xs:w-[230px]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (variant === "detail") {
    return (
      <section className={cn("w-full space-y-4", className)}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-7 w-3/4" />

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20" />
          ))}
        </div>

        <div className="space-y-2.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[92%]" />
          <Skeleton className="h-3 w-[88%]" />
          <Skeleton className="h-3 w-[84%]" />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full", className)}>
      <Skeleton className="h-9 w-40" />

      <div className="mt-6 flex gap-3 max-sm:flex-col sm:items-center">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-24" />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/40 bg-background/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-14" />
            </div>

            <div className="mt-4 space-y-2.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[95%]" />
              <Skeleton className="h-3 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PageSkeleton;
