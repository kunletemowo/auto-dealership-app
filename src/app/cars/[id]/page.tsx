import { CarGallery } from "@/components/cars/CarGallery";
import { getCarListing } from "@/app/actions/cars";
import { notFound } from "next/navigation";
import { ContactSeller } from "@/components/cars/ContactSeller";
import { SaveButton } from "@/components/cars/SaveButton";
import Image from "next/image";
import { unstable_noStore } from "next/cache";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  // Prevent caching to ensure view counts update on each visit
  unstable_noStore();
  
  const { id } = await params;
  const { data: car, error } = await getCarListing(id);

  if (error || !car) {
    notFound();
  }

  const images = (car.car_images || []).map((img: any) => img.image_url);
  const sellerName = car.profiles?.display_name || "Seller";
  const sellerAccountType = car.profiles?.account_type || "individual";
  const sellerId = car.profiles?.id || car.user_id;
  const sellerPhone = car.profiles?.phone || null;
  const sellerAvatar = car.profiles?.avatar_url || null;
  
  // Format seller name with account type
  const sellerDisplayName = sellerAccountType === "business" 
    ? `${sellerName} (Business)`
    : `${sellerName} (Individual)`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <CarGallery images={images} title={car.title} />
        </div>
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {car.title}
              </h1>
              <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {car.currency} ${parseFloat(car.price).toLocaleString()}
              </p>
              {car.view_count !== undefined && car.view_count > 0 && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {car.view_count.toLocaleString()} {car.view_count === 1 ? "view" : "views"}
                </p>
              )}
            </div>
            <SaveButton listingId={car.id} variant="text" />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Details
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Make & Model
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                  {car.make} {car.model}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">Year</dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                  {car.year}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Mileage
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                  {car.mileage.toLocaleString()} km
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Transmission
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                  {car.transmission}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Fuel Type
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                  {car.fuel_type}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Condition
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                  {car.condition}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Location
                </dt>
                <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                  {car.location_city}, {car.location_region}, {car.location_country}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
              {car.description}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Seller Information
            </h2>
            <div className="mb-4 flex items-center gap-4">
              {sellerAvatar ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-zinc-300 dark:border-zinc-700">
                  <Image
                    src={sellerAvatar}
                    alt={sellerName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                  <span className="text-xl font-semibold text-zinc-500 dark:text-zinc-400">
                    {sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Listed by: <span className="font-medium text-zinc-900 dark:text-zinc-50">{sellerDisplayName}</span>
                </p>
                {sellerAccountType === "business" && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Business Account
                  </p>
                )}
              </div>
            </div>
            <ContactSeller
              sellerId={sellerId}
              sellerName={sellerName}
              sellerPhone={sellerPhone}
              carTitle={car.title}
              carId={car.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
