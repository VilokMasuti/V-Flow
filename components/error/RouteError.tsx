"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/80 px-6 py-10 text-center shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
      <h2 className="h3-bold text-dark100_light900">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-dark400_light700">
        This section failed to load. Please try again.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
