"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthRecoveryHandler() {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const supabase = createClient();

    // Some Supabase flows redirect back with token_hash in the querystring
    // (server never sees it if it lands in the hash).
    const tokenHash = search.get("token_hash") ?? search.get("token");
    if (tokenHash) {
      supabase.auth
        .verifyOtp({ type: "recovery", token_hash: tokenHash })
        .then(({ error }) => {
          if (error) {
            setStatus("error");
            return;
          }
          setStatus("done");
          window.location.href = "/reset-password";
        })
        .catch(() => setStatus("error"));
      return;
    }

    // PKCE flow: Supabase redirects back with ?code=...
    const code = search.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setStatus("error");
            return;
          }
          setStatus("done");
          window.location.href = "/reset-password";
        })
        .catch(() => setStatus("error"));
      return;
    }

    const hash = window.location.hash.slice(1);
    if (!hash) {
      setStatus("error");
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        setStatus("done");
        // Full-page navigation so the set-password page gets the session cookie reliably.
        window.location.href = "/reset-password";
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "error") {
    return (
      <div className="max-w-md space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          This reset link is invalid or has already been used.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Use the same browser</strong> where you requested the reset. If you requested on this site (e.g. localhost), open the link so it comes here; do not request on one site and open the link on another (e.g. production vs localhost), or in a different browser/device—that causes &quot;code challenge does not match&quot;.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Many email providers also &quot;scan&quot; links when you open the email, which can use the link before you click it. To avoid that:
        </p>
        <ol className="list-inside list-decimal space-y-1 text-sm text-amber-800 dark:text-amber-300">
          <li>Request a new reset from the Forgot password page <strong>in this browser</strong>.</li>
          <li>Copy the reset link from the email (right‑click → Copy link). Do not click it.</li>
          <li>Paste the link into this browser&apos;s address bar (or a new tab), or use an incognito window opened from this same browser.</li>
          <li>Use the link within a few minutes.</li>
        </ol>
        <a
          href="/forgot-password"
          className="inline-block text-sm font-medium text-amber-900 underline hover:no-underline dark:text-amber-200"
        >
          Go to Forgot password
        </a>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Completing password recovery…
      </p>
    );
  }

  return null;
}

