import { getProfile } from "@/app/actions/profile";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  unstable_noStore(); // Mark as dynamic since we use cookies/auth
  
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const { data: profile, error } = await getProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Profile Settings
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your profile information and contact details
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <ProfileForm
              initialData={{
                display_name: profile?.display_name || null,
                phone: profile?.phone || null,
                address: profile?.address || null,
                city: profile?.city || null,
                province: profile?.province || null,
                postal_code: profile?.postal_code || null,
                account_type: profile?.account_type || "individual",
                avatar_url: profile?.avatar_url || null,
                email: profile?.email || null,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
