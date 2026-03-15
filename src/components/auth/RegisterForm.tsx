"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { signUp } from "@/app/actions/auth";

const HCaptcha = dynamic(
  () => import("@hcaptcha/react-hcaptcha").then((mod) => mod.default),
  { ssr: false }
);

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim() ?? "";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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
        setCaptchaToken(null);
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

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <p className="font-semibold">Account created successfully!</p>
          <p className="mt-1">
            You are now signed up as a user of Kuldae Autos.
          </p>
        </div>
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
