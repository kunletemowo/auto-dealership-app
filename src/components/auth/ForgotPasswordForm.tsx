"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

const HCaptcha = dynamic(
  () => import("@hcaptcha/react-hcaptcha").then((mod) => mod.default),
  { ssr: false }
);

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim() ?? "";

export function ForgotPasswordForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string | null)?.trim() ?? "";
        if (!email) {
          setError("Please enter your email address.");
          return;
        }

        if (HCAPTCHA_SITE_KEY && !captchaToken) {
          setError("Please complete the captcha verification.");
          return;
        }

        setLoading(true);
        try {
          const supabase = createClient();
          const redirectTo = `${window.location.origin}/auth/recovery`;

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
            ...(captchaToken ? { captchaToken } : {}),
          });

          if (error) {
            setError(error.message || "We couldn't start a password reset right now.");
            setLoading(false);
            return;
          }

          setSuccess(
            "If an account exists for this email, you'll receive a password reset link shortly."
          );
          setLoading(false);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setLoading(false);
        }
      }}
    >
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
        </div>
      )}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="you@example.com"
        />
      </div>
      {HCAPTCHA_SITE_KEY && (
        <>
          <div className="flex justify-center">
            <HCaptcha
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={loading || (!!HCAPTCHA_SITE_KEY && !captchaToken)}
        className="mt-2 w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        If an account exists for that email, you'll receive a password reset link shortly.
      </p>
    </form>
  );
}

