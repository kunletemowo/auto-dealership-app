import type { Metadata } from "next";
import { headers } from "next/headers";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCallbackHandler } from "@/components/auth/AuthCallbackHandler";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Kuldae Autos account to manage listings, save favourites, and contact sellers.",
  alternates: { canonical: `${siteUrl}/login` },
};

interface LoginPageProps {
  searchParams?: Promise<{ redirect?: string; message?: string; code?: string; type?: string }> | { redirect?: string; message?: string; code?: string; type?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  let redirectTo = "/dashboard/my-listings";
  let redirectParam = "";
  let message = "";
  let code: string | undefined;
  let type: string | undefined;

  try {
    const params = searchParams instanceof Promise ? await searchParams : searchParams ?? {};
    redirectTo = params.redirect ?? redirectTo;
    redirectParam = params.redirect ?? "";
    message = params.message ?? "";
    code = params.code;
    type = params.type;
  } catch {
    // Use defaults if searchParams unavailable
  }

  // Reset link sometimes lands on /login with code in query — forward to recovery so client can exchange (PKCE requires same browser)
  if (code) {
    redirect(`/auth/recovery?code=${encodeURIComponent(code)}${type ? `&type=${encodeURIComponent(type)}` : ""}`);
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalhost = host.startsWith("localhost");
  const protocol = isLocalhost ? "http" : "https";
  const callbackUrl = `${protocol}://${host.replace(/\/$/, "")}/auth/callback`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h1>
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
          {redirectParam?.startsWith("/dashboard") && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <strong>Clicked a password reset link?</strong> You were sent to sign-in instead of &quot;Set new password&quot;.{" "}
              {isLocalhost ? (
                <>
                  You&apos;re on <strong>localhost</strong>. For the reset link to work here, set <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">NEXT_PUBLIC_SITE_URL=http://localhost:3000</code> in <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">.env.local</code> (no trailing slash). Ensure <code className="break-all rounded bg-amber-100 px-1 dark:bg-amber-900/60">{callbackUrl}</code> is in Supabase <strong>Redirect URLs</strong>. Restart the dev server, then request a new reset from the Forgot password page.
                </>
              ) : (
                <>
                  In Supabase go to <strong>Authentication → URL Configuration → Redirect URLs</strong> and add <code className="break-all rounded bg-amber-100 px-1 dark:bg-amber-900/60">{callbackUrl}</code> if missing. Set <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">NEXT_PUBLIC_SITE_URL</code> to this site&apos;s URL with no trailing slash. Then request a new reset email.
                </>
              )}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              {message}
            </div>
          )}
          {/* If reset link landed here with hash (#access_token=...), recover session and redirect to set-password */}
          <div className="mb-4 min-h-[2rem]">
            <AuthCallbackHandler />
          </div>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
