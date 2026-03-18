"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles auth redirect when Supabase sends tokens in the URL hash
 * (e.g. password reset: #access_token=...&refresh_token=...&type=recovery).
 * The server never sees the hash, so we recover the session here and redirect.
 */
export function AuthCallbackHandler() {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    const safeNext = next && next.startsWith("/") ? next : null;

    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) {
      setStatus("done"); // No hash: nothing to do (e.g. normal login page)
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        setStatus("done");
        // Full-page navigation so set-password page gets the session cookie reliably
        if (safeNext) {
          window.location.href = safeNext;
          return;
        }
        if (type === "recovery") {
          window.location.href = "/reset-password";
        } else {
          window.location.href = "/dashboard/my-listings";
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "error") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Invalid or expired link. Please request a new password reset link.
      </p>
    );
  }

  if (status === "loading") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Completing sign in…
      </p>
    );
  }

  return null; // No hash or already redirected
}
