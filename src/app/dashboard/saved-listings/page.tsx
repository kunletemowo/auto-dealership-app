import { getSavedListings } from "@/app/actions/favorites";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CarCard } from "@/components/cars/CarCard";

export default async function SavedListingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/saved-listings");
  }

  const { data: listings, error } = await getSavedListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Saved Listings
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Your favorite car listings
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      ) : !listings || listings.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            You haven't saved any listings yet.
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Browse cars and click the save button to add them to your favorites.
          </p>
          <Link href="/cars" className="mt-6 inline-block">
            <button className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              Browse Cars
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((car: any) => {
            const firstImage = car.car_images?.[0]?.image_url;
            return (
              <CarCard
                key={car.id}
                id={car.id}
                title={car.title}
                price={parseFloat(car.price)}
                location={`${car.location_city}, ${car.location_region}`}
                year={car.year}
                mileage={car.mileage}
                make={car.make}
                model={car.model}
                imageUrl={firstImage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
