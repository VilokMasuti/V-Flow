import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  variant?: "list" | "detail" | "tag" | "tagss"| "home"|"commnity"|"profile" |"askQ"|"answer";
  className?: string;
};

const PageSkeleton = ({ variant = "list", className }: PageSkeletonProps) => {

  if (variant === "home") {
  return (
    <section className="w-full">
      {/* Title + Ask Question pill button */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-11 w-full rounded-lg mb-5" />

      {/* Filter pills — match actual pill shape from screenshot */}
      <div className="flex gap-2 mb-6">
        {[90, 86, 108, 122].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-lg" style={{ width: w }} />
        ))}
      </div>

      {/* Question cards — title, tags, then author-left / stats-right */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-dark-400 p-5">
            <Skeleton className="h-5 w-[72%] mb-3" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-22 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
            {/* Author left, vote/answer/views right */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-3 w-36" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

 if (variant === "commnity") {
  return (
    <section className="w-full">
      {/* "All Users" heading */}
      <Skeleton className="h-10 w-40 mb-6" />

      {/* Search + filter dropdown on same row */}
      <div className="flex gap-3 mb-7">
        <Skeleton className="h-11 flex-1 rounded-lg" />
        <Skeleton className="h-11 w-36 rounded-lg" />
      </div>

      {/* User cards — portrait layout: large centered avatar, name, username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-dark-400 p-7 flex flex-col items-center gap-3"
          >
            <Skeleton className="size-[72px] rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </section>
  );
}
if (variant === "answer") {
  return (
    <section className={cn("w-full", className)}>
      {/* Author row left + upvote/downvote/star right */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-5" />
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-5" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>

      {/* Question title (large, 2 lines) */}
      <Skeleton className="h-7 w-[90%] mb-2" />
      <Skeleton className="h-7 w-[60%] mb-4" />

      {/* Meta row: asked date · answers count · views */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-3 w-6" />
      </div>

      {/* Question body paragraphs */}
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-[96%]" />
        <Skeleton className="h-3.5 w-[88%]" />
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-[80%]" />
      </div>

      {/* Tags row at bottom of question */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>

      {/* Answers section header: "0 Answers" label left + filter dropdown right */}
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Pagination (empty state still shows it) */}
      <div className="flex justify-center mb-6">
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Bottom bar: "Write your answer here" left + "Generate AI Answer" button right */}
      <div className="flex items-center justify-between pt-5 border-t border-dark-300">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </section>
  );
}

  if (variant === "detail") {
    return (
      <section className={cn("w-full", className)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-8 w-3/4" />

          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20" />
            ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>

          <div className="mt-2 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
      </section>
    );
  }

 if (variant === "tagss") {
  return (
    <section className={cn("w-full", className)}>
      {/* Heading */}
      <Skeleton className="h-10 w-40 mb-6" />

      {/* Search + Filter row */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 w-[280px]" />
      </div>

      {/* Grid of tag cards */}
      <div className="mt-10 flex w-full flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/40 bg-background/50 p-6 w-[260px] h-[170px]"
          >
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <Skeleton className="h-10 w-32" />
      </div>
    </section>
  );
}


if (variant === "tag") {
  return (
    <section className={cn("w-full", className)}>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/40 bg-background/50 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="mt-5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 if (variant === "profile") {
  return (
    <section className="w-full">
      {/* Top: Avatar + meta + Edit Profile button */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-5 w-40" />           {/* Name */}
            <Skeleton className="h-3.5 w-28" />         {/* @username */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-18" />       {/* Portfolio link */}
              <Skeleton className="h-3.5 w-18" />       {/* Location */}
              <Skeleton className="h-3.5 w-20" />       {/* Joined date */}
            </div>
            <Skeleton className="h-3.5 w-24 mt-1" />   {/* Bio line e.g. HARE KRISHAN */}
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-lg shrink-0" /> {/* Edit Profile */}
      </div>

      {/* Stats: single dark card with Q/A block + 3 badge cards */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-10" />             {/* "Stats" label */}
          <Skeleton className="h-4 w-6" />              {/* count e.g. 58 */}
        </div>
        <div className="flex gap-1 rounded-xl bg-dark-400 p-3">
          {/* Questions / Answers block */}
          <div className="flex gap-5 items-center border-r border-dark-300 pr-4 mr-1">
            {["Questions", "Answers"].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          {/* Gold / Silver / Bronze badge cards */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-1 items-center gap-3 rounded-lg bg-dark-300 px-3 py-2.5"
            >
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-18" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body: Posts column (left) + Top Tech sidebar (right) */}
      <div className="flex gap-6">
        {/* Left: Tabs + post cards */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>

          {/* Post cards */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-dark-400 p-4 mb-3"
            >
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Top Tech sidebar */}
        <div className="w-48 shrink-0">
          <Skeleton className="h-5 w-20 mb-4" />  {/* "Top Tech" heading */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center mb-2">
              <Skeleton className="h-7 w-28 rounded-md" />   {/* Tech badge */}
              <Skeleton className="h-3.5 w-3.5" />            {/* Count */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
if (variant === "askQ") {
  return (
    <section className="w-full">
      {/* Page heading */}
      <Skeleton className="h-9 w-52 mb-8 rounded-md" />

      {/* Question Title field */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="size-2 rounded-full" />   {/* required asterisk */}
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-3 w-72 mt-2" />          {/* helper text */}
      </div>

      {/* Detailed explanation field (MDX editor) */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Skeleton className="h-3.5 w-52" />
          <Skeleton className="size-2 rounded-full" />
        </div>
        {/* Editor box with toolbar */}
        <div className="rounded-md border border-dark-300 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-dark-300">
            {[18, 18, null, 16, 14, 16, null, 18, 22, 22, null, 22, 22, 22, 18, 22].map(
              (w, i) =>
                w === null ? (
                  <div key={i} className="w-px h-5 bg-dark-300 mx-1" />
                ) : (
                  <Skeleton key={i} className={`h-5 w-${w === 14 ? 3.5 : w === 16 ? 4 : w === 18 ? 4.5 : 5.5} rounded-sm shrink-0`} />
                )
            )}
          </div>
          {/* Editor area */}
          <Skeleton className="h-52 w-full rounded-none" />
        </div>
        <Skeleton className="h-3 w-80 mt-2" />          {/* helper text */}
      </div>

      {/* Tags field */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Skeleton className="h-3.5 w-9" />
          <Skeleton className="size-2 rounded-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-3 w-96 mt-2" />          {/* helper text */}
      </div>

      {/* Footer: Enhance Question + Ask A Question */}
      <div className="flex justify-end items-center gap-5 mt-8">
        <Skeleton className="h-4 w-28" />               {/* "Enhance Question" ghost */}
        <div className="flex items-center gap-2 bg-primary-500 rounded-full px-5 py-2">
          <Skeleton className="h-4 w-24 bg-primary-400 rounded" />
          <Skeleton className="size-4 bg-primary-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}
  return (
    <section className={cn("w-full", className)}>
      <Skeleton className="h-10 w-48" />

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>


      <div className="mt-10 flex w-full flex-col gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/40 bg-background/50 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="mt-5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </section>




  );
};

export default PageSkeleton;
