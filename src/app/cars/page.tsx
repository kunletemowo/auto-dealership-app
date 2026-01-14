import { CarSearchForm } from "@/components/cars/CarSearchForm";
import { AdvancedFilters } from "@/components/cars/AdvancedFilters";
import { CarCard } from "@/components/cars/CarCard";
import { SortControls } from "@/components/cars/SortControls";
import { Pagination } from "@/components/cars/Pagination";
import { getCarListings } from "@/app/actions/cars";
import Link from "next/link";
import { unstable_noStore } from "next/cache";

interface CarsPageProps {
  searchParams: Promise<{
    search?: string;
    make?: string;
    model?: string;
    location?: string;
    distance?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    colour?: string;
    showAdvanced?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  // Prevent caching to ensure view counts are up-to-date
  unstable_noStore();
  
  const params = await searchParams;
  
  const itemsPerPage = 24;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const offset = (currentPage - 1) * itemsPerPage;
  
  const filters = {
    search: params.search,
    make: params.make,
    model: params.model,
    location: params.location,
    distance: params.distance ? parseInt(params.distance) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    minYear: params.minYear ? parseInt(params.minYear) : undefined,
    maxYear: params.maxYear ? parseInt(params.maxYear) : undefined,
    colour: params.colour,
    sortBy: params.sortBy as "price" | "year" | "mileage" | "created_at" | undefined,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
    limit: itemsPerPage,
    offset: offset,
  };

  const { data: cars, error } = await getCarListings(filters);
  const showAdvanced = params.showAdvanced === "true";
  
  // For pagination, we estimate total pages based on whether we got a full page
  // This is a limitation since location filtering happens in app layer
  const hasMoreResults = cars && cars.length === itemsPerPage;
  const estimatedTotalItems = hasMoreResults ? (currentPage + 1) * itemsPerPage : (currentPage - 1) * itemsPerPage + (cars?.length || 0);
  const estimatedTotalPages = Math.ceil(estimatedTotalItems / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Finding your perfect car
          <br />
          just got easier
        </h1>
      </div>

      <div className="mb-8">
        <CarSearchForm />
      </div>

      {showAdvanced && (
        <div className="mb-8">
          <AdvancedFilters />
        </div>
      )}

      {!showAdvanced && (
        <div className="mb-8 text-center">
          <Link
            href="/cars?showAdvanced=true"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 underline"
          >
            Show Advanced Filters
          </Link>
        </div>
      )}

      {cars && cars.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {estimatedTotalItems} {estimatedTotalItems === 1 ? "result" : "results"}
          </div>
          <SortControls />
        </div>
      )}

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No cars found. Be the first to list a car!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: any) => {
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
                  viewCount={car.view_count}
                />
              );
            })}
          </div>
        )}
      </div>

      {cars && cars.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={estimatedTotalPages}
            totalItems={estimatedTotalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
