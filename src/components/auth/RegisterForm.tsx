"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { signUp } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

const HCaptcha = dynamic(
  () => import("@hcaptcha/react-hcaptcha").then((mod) => mod.default),
  { ssr: false }
);

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim() ?? "";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string>("");
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState<boolean>(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [autoResent, setAutoResent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (HCAPTCHA_SITE_KEY && !captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (captchaToken) formData.set("captchaToken", captchaToken);
      const result = await signUp(formData);

      if (result?.error) {
        const isCaptchaError = /captcha verification process failed/i.test(result.error);
        const message = isCaptchaError && !HCAPTCHA_SITE_KEY
          ? "CAPTCHA is required for sign-up. Add NEXT_PUBLIC_HCAPTCHA_SITE_KEY to your project's environment variables (e.g. Vercel → Settings → Environment Variables) and redeploy so the CAPTCHA box appears."
          : isCaptchaError
            ? "CAPTCHA verification failed. Please complete the CAPTCHA below and try again."
            : result.error;
        setError(message);
        setCaptchaToken(null);
        setLoading(false);
      } else if (result?.success) {
        // After signup, require a fresh captcha token for any resend attempt (Supabase enforces captcha on /resend).
        setCaptchaToken(null);
        setSuccessEmail((result as any)?.email || (formData.get("email") as string) || "");
        setNeedsEmailConfirmation(Boolean((result as any)?.needsEmailConfirmation));
        setResendMessage("");
        setAutoResent(false);
        setSuccess(true);
        setLoading(false);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success || !needsEmailConfirmation || !successEmail || autoResent) return;
    // If captcha is enforced, we cannot auto-resend without a user completing the captcha.
    if (HCAPTCHA_SITE_KEY) return;

    const run = async () => {
      setResendLoading(true);
      setResendMessage("");
      try {
        const supabase = createClient();
        const baseUrl =
          (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL?.trim?.()) ||
          (typeof window !== "undefined" ? window.location.origin : "");
        const emailRedirectTo = baseUrl
          ? `${baseUrl.replace(/\/$/, "")}/auth/confirm`
          : `${window.location.origin}/auth/confirm`;

        const { error } = await supabase.auth.resend({
          type: "signup",
          email: successEmail,
          options: { emailRedirectTo },
        });

        if (error) {
          // This is the most reliable non-hallucinated signal we can show when emails aren't being sent.
          setError(error.message || "Could not send confirmation email. Please try again.");
        } else {
          setResendMessage("Confirmation email sent. Please check your inbox (and spam/junk).");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Could not send confirmation email. Please try again.");
      } finally {
        setResendLoading(false);
        setAutoResent(true);
      }
    };

    void run();
  }, [success, needsEmailConfirmation, successEmail, autoResent]);

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <p className="font-semibold">Account created successfully!</p>
          {needsEmailConfirmation ? (
            <>
              <p className="mt-1">
                We sent a confirmation email{successEmail ? <> to <strong>{successEmail}</strong></> : null}. Please open it and click the confirmation link to activate your account.
              </p>
              <p className="mt-2 text-xs opacity-90">
                If you don’t see it, check your spam/junk folder. Some email providers delay delivery by a few minutes.
              </p>
            </>
          ) : (
            <p className="mt-1">
              Your account is active. You can sign in now.
            </p>
          )}
        </div>

        {needsEmailConfirmation && (
          <div className="space-y-2">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            {resendMessage && (
              <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                {resendMessage}
              </div>
            )}
            {HCAPTCHA_SITE_KEY && (
              <div className="flex justify-center">
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                />
              </div>
            )}
            <Button
              type="button"
              className="w-full"
              disabled={resendLoading || !successEmail || (!!HCAPTCHA_SITE_KEY && !captchaToken)}
              onClick={async () => {
                if (!successEmail) return;
                if (HCAPTCHA_SITE_KEY && !captchaToken) {
                  setError("Please complete the captcha verification.");
                  return;
                }
                setResendLoading(true);
                setResendMessage("");
                setError("");
                try {
                  const supabase = createClient();
                  const baseUrl =
                    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL?.trim?.()) ||
                    (typeof window !== "undefined" ? window.location.origin : "");
                  const emailRedirectTo = baseUrl
                    ? `${baseUrl.replace(/\/$/, "")}/auth/confirm`
                    : `${window.location.origin}/auth/confirm`;

                  const { error } = await supabase.auth.resend({
                    type: "signup",
                    email: successEmail,
                    // Supabase Auth captcha enforcement requires passing captchaToken for /resend.
                    options: { emailRedirectTo, ...(captchaToken ? { captchaToken } : {}) } as any,
                  });

                  if (error) {
                    setError(error.message || "Could not resend confirmation email. Please try again.");
                  } else {
                    setResendMessage("Confirmation email resent. Please check your inbox (and spam/junk).");
                  }
                } catch (err: unknown) {
                  setError(err instanceof Error ? err.message : "Could not resend confirmation email. Please try again.");
                } finally {
                  setResendLoading(false);
                }
              }}
            >
              {resendLoading ? "Resending..." : "Resend confirmation email"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="text"
          name="firstName"
          label="First Name"
          required
          disabled={loading}
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          required
          disabled={loading}
        />
      </div>
      <Input
        type="email"
        name="email"
        label="Email"
        required
        disabled={loading}
      />
      <Input
        type="password"
        name="password"
        label="Password"
        required
        disabled={loading}
        minLength={6}
      />
      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        required
        disabled={loading}
        minLength={6}
      />
      {HCAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <HCaptcha
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
