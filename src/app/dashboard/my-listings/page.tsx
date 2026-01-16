import { getUserListings } from "@/app/actions/cars";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { CarCard } from "@/components/cars/CarCard";
import { Button } from "@/components/forms/Button";
import { deleteCarListing } from "@/app/actions/cars";
import { ListingStatusToggle } from "@/components/cars/ListingStatusToggle";

export default async function MyListingsPage() {
  unstable_noStore(); // Mark as dynamic since we use cookies/auth
  
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/my-listings");
  }

  const { data: listings, error } = await getUserListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            My Listings
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your car listings
          </p>
        </div>
        <Link href="/cars/new">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      ) : !listings || listings.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
            You haven't listed any cars yet.
          </p>
          <Link href="/cars/new">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((car: any) => {
            const firstImage = car.car_images?.[0]?.image_url;
            const status = car.status || (car.is_active ? "active" : "inactive");
            return (
              <div key={car.id} className="relative">
                <div className={`relative ${!car.is_active ? "opacity-60" : ""}`}>
                  <CarCard
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
                  {status !== "active" && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold text-white ${
                          status === "sold"
                            ? "bg-blue-500"
                            : status === "unavailable"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {status === "sold"
                          ? "Sold"
                          : status === "unavailable"
                          ? "Unavailable"
                          : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-3">
                  <ListingStatusToggle
                    listingId={car.id}
                    currentStatus={status}
                    isActive={car.is_active}
                  />
                  <div className="flex space-x-2">
                    <Link href={`/cars/${car.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <form action={async () => {
                      await deleteCarListing(car.id);
                    }} className="flex-1">
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
