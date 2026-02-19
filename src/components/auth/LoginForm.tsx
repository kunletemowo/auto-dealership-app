"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { signIn } from "@/app/actions/auth";

const HCaptcha = dynamic(
  () => import("@hcaptcha/react-hcaptcha").then((mod) => mod.default),
  { ssr: false }
);

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim() ?? "";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/dashboard/my-listings" }: LoginFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<{ resetCaptcha: () => void } | null>(null);
  const router = useRouter();

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
      const result = await signIn(formData);

      if (result?.error) {
        setError(result.error);
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        setLoading(false);
      } else if (result?.success) {
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
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
      />
      {HCAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
