"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Button } from "@/components/forms/Button";

export function AdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    colour: searchParams.get("colour") || "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    
    // Preserve existing basic filters
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const location = searchParams.get("location");
    const distance = searchParams.get("distance");
    
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (location) params.set("location", location);
    if (distance) params.set("distance", distance);
    
    // Add advanced filters
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    router.push(`/cars?${params.toString()}`);
  };

  const handleClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      colour: "",
    });
    
    // Preserve basic filters when clearing advanced
    const params = new URLSearchParams();
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const location = searchParams.get("location");
    const distance = searchParams.get("distance");
    
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (location) params.set("location", location);
    if (distance) params.set("distance", distance);
    
    router.push(`/cars?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const colourOptions = [
    { value: "", label: "All Colours" },
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Silver", label: "Silver" },
    { value: "Gray", label: "Gray" },
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    { value: "Brown", label: "Brown" },
    { value: "Yellow", label: "Yellow" },
    { value: "Orange", label: "Orange" },
    { value: "Beige", label: "Beige" },
    { value: "Gold", label: "Gold" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Advanced Filters
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          name="minPrice"
          label="Min Price"
          type="number"
          placeholder="0"
          defaultValue={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
        />
        <Input
          name="maxPrice"
          label="Max Price"
          type="number"
          placeholder="100000"
          defaultValue={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
        />
        <Select
          name="minYear"
          label="Min Year"
          options={[{ value: "", label: "Any" }, ...yearOptions]}
          defaultValue={filters.minYear}
          onChange={(e) => handleFilterChange("minYear", e.target.value)}
        />
        <Select
          name="maxYear"
          label="Max Year"
          options={[{ value: "", label: "Any" }, ...yearOptions]}
          defaultValue={filters.maxYear}
          onChange={(e) => handleFilterChange("maxYear", e.target.value)}
        />
        <Select
          name="colour"
          label="Colour"
          options={colourOptions}
          defaultValue={filters.colour}
          onChange={(e) => handleFilterChange("colour", e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button type="button" variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
