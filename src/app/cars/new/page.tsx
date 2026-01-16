import { CarListingForm } from "@/components/cars/CarListingForm";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";

export default async function NewCarPage() {
  unstable_noStore(); // Mark as dynamic since we use cookies/auth
  
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/cars/new");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          List Your Car
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Fill out the form below to create your listing
        </p>
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <CarListingForm />
        </div>
      </div>
    </div>
  );
}
