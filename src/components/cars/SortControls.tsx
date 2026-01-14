"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/forms/Select";

export function SortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get("sortBy") || "created_at";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    // Parse sort value (format: "price_asc" or "price_desc")
    const [sortBy, sortOrder] = value.split("_");
    
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.delete("page"); // Reset to first page when sorting changes
    
    router.push(`/cars?${params.toString()}`);
  };

  const sortOptions = [
    { value: "created_at_desc", label: "Newest First" },
    { value: "created_at_asc", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "year_desc", label: "Year: Newest" },
    { value: "year_asc", label: "Year: Oldest" },
    { value: "mileage_asc", label: "Mileage: Low to High" },
  ];

  const currentValue = `${currentSort}_${currentSortOrder}`;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
        Sort by:
      </label>
      <div className="min-w-[200px]">
        <Select
          id="sort"
          name="sort"
          defaultValue={currentValue}
          onChange={handleSortChange}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
