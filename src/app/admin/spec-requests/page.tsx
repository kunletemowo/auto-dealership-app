import { getSpecRequestsForAdmin } from "@/app/actions/spec-requests";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { SpecRequestsList } from "@/components/admin/SpecRequestsList";

export default async function AdminSpecRequestsPage() {
  unstable_noStore();

  const supabase = await createClient();
  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/login?redirect=/admin/spec-requests");
  }

  if (!user) {
    redirect("/login?redirect=/admin/spec-requests");
  }

  // Use admin client to bypass RLS for admin check
  const adminClient = createAdminClient();
  const client = adminClient ?? supabase;

  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: userRole } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin" || userRole?.role === "admin";
  if (!isAdmin) {
    redirect("/");
  }

  const { data: requests, error } = await getSpecRequestsForAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Car Spec Requests
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          View and manage all customer car specification requests.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <SpecRequestsList initialRequests={requests || []} />
      )}
    </div>
  );
}
