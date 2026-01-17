import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

interface LoginPageProps {
  searchParams?: Promise<{ redirect?: string }> | { redirect?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  let redirectTo = "/dashboard/my-listings";
  let redirectParam = "";
  
  try {
    const params = searchParams instanceof Promise ? await searchParams : (searchParams || {});
    redirectTo = params.redirect || "/dashboard/my-listings";
    redirectParam = params.redirect || "";
  } catch (error) {
    // If searchParams fails, use default redirect
    console.error("Error reading searchParams:", error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <Link
              href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
              className="font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
