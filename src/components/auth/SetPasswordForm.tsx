"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";
import { Input } from "@/components/forms/Input";

export function SetPasswordForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          void updatePassword(formData);
        });
      }}
      className="space-y-4"
    >
      <Input
        id="password"
        name="password"
        type="password"
        label="New password"
        required
        minLength={6}
        autoComplete="new-password"
        placeholder="At least 6 characters"
        disabled={isPending}
      />
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm new password"
        required
        minLength={6}
        autoComplete="new-password"
        placeholder="Repeat password"
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? "Updating…" : "Set new password"}
      </button>
      <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
