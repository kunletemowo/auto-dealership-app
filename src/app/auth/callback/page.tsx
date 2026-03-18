import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCallbackHandler } from "@/components/auth/AuthCallbackHandler";

export const dynamic = "force-dynamic";

type SearchParams =
  | Promise<{ code?: string; type?: string; next?: string }>
  | { code?: string; type?: string; next?: string };

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams ?? {};
  const code = params.code;
  const type = params.type;
  const next = params.next;

  const safeNext =
    typeof next === "string" && next.startsWith("/") ? next : null;

  // PKCE / query flow: server can exchange code and redirect
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    if (safeNext) {
      redirect(safeNext);
    }
    if (type === "recovery") {
      redirect("/reset-password");
    }
    redirect("/dashboard/my-listings");
  }

  // Hash flow: tokens are in #access_token=... (server never sees hash).
  // Render client component to recover session and redirect.
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <AuthCallbackHandler />
    </div>
  );
}
