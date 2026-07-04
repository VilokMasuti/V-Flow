"use client";

import RouteError from "@/components/error/RouteError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return <RouteError error={error} reset={reset} />;
}
