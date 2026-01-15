"use client";

import { useEffect } from "react";
import { Button } from "@/components/forms/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Something went wrong!
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="mt-8 space-x-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
