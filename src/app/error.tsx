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
    // Log the full error details for debugging
    console.error("Application error:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  // Show more details in development or if error message exists
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasDetailedMessage = error.message && error.message !== "An error occurred in the Server Components render";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Something went wrong!
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          {hasDetailedMessage ? error.message : "An unexpected error occurred in the application."}
        </p>
        {(isDevelopment || error.digest) && (
          <div className="mt-4 rounded-lg bg-zinc-100 p-4 text-left dark:bg-zinc-900">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Error Details:</p>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono break-all">
              {error.digest && `Digest: ${error.digest}`}
              {isDevelopment && error.stack && (
                <>
                  <br />
                  <br />
                  Stack: {error.stack}
                </>
              )}
            </p>
          </div>
        )}
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
          If this error persists, please check the browser console or server logs for more details.
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
