"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "missing">("checking");

  useEffect(() => {
    const supabase = createClient();
    const maxAttempts = 3;
    const delayMs = 250;

    const check = (attempt: number) => {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (session) {
            setState("ok");
            return;
          }
          if (attempt < maxAttempts) {
            setTimeout(() => check(attempt + 1), delayMs);
          } else {
            setState("missing");
          }
        })
        .catch(() => {
          if (attempt < maxAttempts) {
            setTimeout(() => check(attempt + 1), delayMs);
          } else {
            setState("missing");
          }
        });
    };
    check(0);
  }, []);

  if (state === "checking") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Checking recovery session…
      </p>
    );
  }

  if (state === "missing") {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
        >
          Go to Forgot password
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

