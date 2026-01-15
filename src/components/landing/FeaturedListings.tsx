import Link from "next/link";
import { getCarListings } from "@/app/actions/cars";
import { CarCard } from "@/components/cars/CarCard";

export async function FeaturedListings() {
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <section className="bg-zinc-50 py-24 dark:bg-zinc-950 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Featured Listings
            </h2>
            <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Check out some of our latest listings
            </p>
          </div>
          <div className="mt-16 text-center text-zinc-600 dark:text-zinc-400">
            No featured listings available at the moment.
          </div>
        </div>
      </section>
    );
  }

  let listings: any[] = [];
  let error: string | null = null;

  try {
    // Fetch the latest 6 active listings
    const result = await getCarListings({
      limit: 6,
      sortBy: "created_at",
      sortOrder: "desc",
    });
    listings = result.data || [];
    error = result.error || null;
  } catch (err: any) {
    // If getCarListings throws an error, catch it and show empty state
    console.error("Error fetching featured listings:", err);
    error = err.message || "Failed to load listings";
  }

  const featuredCars = listings || [];

  return (
    <section className="bg-zinc-50 py-24 dark:bg-zinc-950 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Featured Listings
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Check out some of our latest listings
          </p>
        </div>
        {error ? (
          <div className="mt-16 text-center text-red-600 dark:text-red-400">
            Error loading featured listings: {error}
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="mt-16 text-center text-zinc-600 dark:text-zinc-400">
            No featured listings available at the moment.
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredCars.map((car: any) => {
              // Get the first image (sorted by position)
              const images = car.car_images || [];
              const sortedImages = images.sort((a: any, b: any) => a.position - b.position);
              const firstImage = sortedImages[0]?.image_url || null;
              
              // Format location
              const location = car.location_city && car.location_region
                ? `${car.location_city}, ${car.location_region}`
                : car.location_city || car.location_region || "Location not specified";

              return (
                <CarCard
                  key={car.id}
                  id={car.id}
                  title={car.title}
                  price={parseFloat(car.price)}
                  location={location}
                  year={car.year}
                  mileage={car.mileage}
                  imageUrl={firstImage}
                  make={car.make}
                  model={car.model}
                  viewCount={car.view_count}
                />
              );
            })}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
