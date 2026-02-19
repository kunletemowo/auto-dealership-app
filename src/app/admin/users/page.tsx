import { getUsersForAdmin } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { AdminUsersList } from "@/components/admin/AdminUsersList";

export default async function AdminUsersPage() {
  unstable_noStore();

  // Check if user is admin - simpler check that doesn't require RPC function
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/users");
  }

  // Check admin status - prioritize profiles.role to avoid RLS recursion
  let isAdmin = false;
  
  // First check profiles.role (no RLS recursion risk)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    isAdmin = true;
  } else {
    // Fallback to user_roles table if profiles.role is not admin
    // Wrap in try-catch to handle recursion errors gracefully
    try {
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      // If we get a recursion error, fall back to profiles.role
      if (roleError?.message?.includes("infinite recursion") || roleError?.message?.includes("recursion")) {
        console.warn("RLS recursion detected in user_roles, using profiles.role instead");
        isAdmin = profile?.role === "admin";
      } else if (userRole?.role === "admin") {
        isAdmin = true;
      }
    } catch (err: any) {
      // Handle recursion or other errors gracefully
      if (err?.message?.includes("infinite recursion") || err?.message?.includes("recursion")) {
        console.warn("RLS recursion detected, using profiles.role instead");
        isAdmin = profile?.role === "admin";
      } else {
        // For other errors, just use profiles.role
        console.warn("Error checking user_roles, using profiles.role:", err);
        isAdmin = profile?.role === "admin";
      }
    }
  }

  if (!isAdmin) {
    redirect("/");
  }

  const { data: users, error } = await getUsersForAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          User Access Management
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage user roles and permissions. Only admins and users with admin rights are visible by default.
          Use search to find and update access for other users.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <AdminUsersList initialUsers={users || []} />
      )}
    </div>
  );
}
