"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";

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
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="At least 6 characters"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Repeat password"
        />
      </div>
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
