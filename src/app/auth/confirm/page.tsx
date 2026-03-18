import { AuthConfirmHandler } from "@/components/auth/AuthConfirmHandler";

export const dynamic = "force-dynamic";

export default function AuthConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <AuthConfirmHandler />
    </div>
  );
}

