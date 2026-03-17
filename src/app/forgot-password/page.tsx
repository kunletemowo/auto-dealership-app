import { requestPasswordReset } from "@/app/actions/auth";

export const metadata = {
  title: "Forgot Password",
};

async function resetPasswordAction(formData: FormData) {
  "use server";
  await requestPasswordReset(formData);
}

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Reset your password
        </h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
        <form action={resetPasswordAction} className="space-y-4">
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
      </div>
    </div>
  );
}

