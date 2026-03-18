"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "missing">("checking");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setState(data.user ? "ok" : "missing");
      })
      .catch(() => setState("missing"));
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

