import type { Metadata } from "next";
import Link from "next/link";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import { ResetPasswordGate } from "@/components/auth/ResetPasswordGate";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your Kuldae Autos account.",
  alternates: { canonical: `${siteUrl}/reset-password` },
};

export default async function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Set new password
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Enter a new password for your account. You will be signed out and can sign in again with the new password.
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
          <ResetPasswordGate>
            <SetPasswordForm />
          </ResetPasswordGate>
        </div>
      </div>
    </div>
  );
}
