"use client";

import { useFormState } from "react-dom";
import {
  resetPasswordFormAction,
  type ResetPasswordFormState,
} from "@/app/actions/auth";

const initialState: ResetPasswordFormState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(resetPasswordFormAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          {state.success}
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
      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Send reset link
      </button>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        If an account exists for that email, you'll receive a password reset link shortly.
      </p>
    </form>
  );
}

