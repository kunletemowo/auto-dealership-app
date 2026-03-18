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
            console.error("Recovery verifyOtp error:", error.message);
            setStatus("error");
            return;
          }
          setStatus("done");
          window.location.href = "/reset-password";
        })
        .catch((err) => {
          console.error("Recovery verifyOtp unexpected error:", err);
          setStatus("error");
        });
      return;
    }

    // PKCE flow: Supabase redirects back with ?code=...
    const code = search.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            console.error("Recovery exchangeCodeForSession error:", error.message);
            setStatus("error");
            return;
          }
          setStatus("done");
          window.location.href = "/reset-password";
        })
        .catch((err) => {
          console.error("Recovery exchangeCodeForSession unexpected error:", err);
          setStatus("error");
        });
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
        window.location.href = "/reset-password";
      })
      .catch((err) => {
        console.error("Recovery setSession error:", err);
        setStatus("error");
      });
  }, []);

  if (status === "error") {
    const isPkceError = typeof window !== "undefined" && window.location.search.includes("code=");
    return (
      <div className="max-w-md space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          This reset link is invalid or has already been used.
        </p>
        {isPkceError && (
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Open this link in the <strong>same browser and same site</strong> where you requested the reset (e.g. do not request on localhost and open on production, or the other way around).
          </p>
        )}
        <a
          href="/forgot-password"
          className="inline-block rounded-md bg-amber-200 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
        >
          Request a new link
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

