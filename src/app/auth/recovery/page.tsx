import { AuthRecoveryHandler } from "@/components/auth/AuthRecoveryHandler";

export const dynamic = "force-dynamic";

export default function AuthRecoveryPage() {
  // Handle both PKCE (?code=...) and hash (#access_token=...) client-side.
  // PKCE exchange happens via /auth/recovery/exchange route handler.
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <AuthRecoveryHandler />
    </div>
  );
}

