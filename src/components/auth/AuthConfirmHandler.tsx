"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "loading" | "done" | "error";

export function AuthConfirmHandler() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const search = new URLSearchParams(window.location.search);
      const tokenHash = search.get("token_hash") ?? search.get("token");
      const typeParam = (search.get("type") ?? "signup").toLowerCase();

      if (!tokenHash) {
        setErrorMessage("Missing confirmation token. Please request a new confirmation email.");
        setStatus("error");
        return;
      }

      // We only support signup confirmations here. (Recovery is handled at /auth/recovery.)
      const type = typeParam === "signup" ? "signup" : "signup";

      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash: tokenHash,
      });

      if (error) {
        console.error("Signup confirmation verifyOtp error:", error.message);
        setErrorMessage(
          error.message || "This confirmation link is invalid or has expired. Please request a new one."
        );
        setStatus("error");
        return;
      }

      setStatus("done");
      window.location.href =
        "/login?message=" +
        encodeURIComponent("Email confirmed. You can sign in to your account.");
    };

    run().catch((err) => {
      console.error("Signup confirmation unexpected error:", err);
      setErrorMessage("Something went wrong confirming your email. Please try again.");
      setStatus("error");
    });
  }, []);

  if (status === "loading") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Confirming your email…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Email confirmation failed
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {errorMessage}
        </p>
        <Link
          href="/register"
          className="inline-block rounded-md bg-amber-200 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
        >
          Go to sign up
        </Link>
      </div>
    );
  }

  return null;
}

