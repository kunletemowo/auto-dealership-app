import { getCarListing } from "@/app/actions/cars";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect, notFound } from "next/navigation";
import { CarListingForm } from "@/components/cars/CarListingForm";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/cars/" + id + "/edit");
  }

  const { data: listing, error } = await getCarListing(id);

  if (error || !listing) {
    notFound();
  }

  // Verify ownership
  if (listing.user_id !== user.id) {
    redirect("/dashboard/my-listings");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Edit Listing
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Update your car listing details
        </p>
      </div>
      <div className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CarListingForm listing={listing} mode="edit" />
      </div>
    </div>
  );
}
