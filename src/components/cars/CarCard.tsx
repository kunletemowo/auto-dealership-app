"use client";

import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "./SaveButton";

interface CarCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  year?: number;
  mileage?: number;
  imageUrl?: string;
  make?: string;
  model?: string;
  viewCount?: number;
}

export function CarCard({
  id,
  title,
  price,
  location,
  year,
  mileage,
  imageUrl,
  make,
  model,
  viewCount,
}: CarCardProps) {
  const displayTitle = make && model ? `${year} ${make} ${model}` : title;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900">
      <div className="relative">
        <Link href={`/cars/${id}`} className="flex flex-col flex-1">
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={displayTitle}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                No Image
              </div>
            )}
          </div>
        </Link>
        <div className="absolute top-2 right-2 z-10">
          <SaveButton listingId={id} variant="icon" size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/cars/${id}`}>
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
            {displayTitle}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          {year && <span>{year}</span>}
          {mileage && <span>• {mileage.toLocaleString()} km</span>}
          <span>• {location}</span>
          {viewCount !== undefined && viewCount > 0 && (
            <span>• {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}</span>
          )}
        </div>
        <p className="mt-auto pt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
