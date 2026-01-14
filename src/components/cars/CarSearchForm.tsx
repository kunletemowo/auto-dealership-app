"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { getMakeOptions, CAR_MAKES } from "@/lib/data/car-makes-models";
import { filterLocations, CANADIAN_LOCATIONS, type LocationOption } from "@/lib/data/canadian-locations";

export function CarSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: "",
    make: "",
    model: "",
    location: "",
    distance: "",
  });
  
  // Sync filters with URL params after hydration to avoid SSR mismatch
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      make: searchParams.get("make") || "",
      model: searchParams.get("model") || "",
      location: searchParams.get("location") || "",
      distance: searchParams.get("distance") || "",
    });
  }, [searchParams]);

  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelInputRef = useRef<HTMLDivElement>(null);

  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Get filtered models based on selected make and search query
  const filteredModels = useMemo(() => {
    if (!filters.make) {
      return [{ value: "", label: "All Models" }];
    }

    // Find make by value (case-insensitive)
    const make = CAR_MAKES.find(
      (m) => m.value.toLowerCase() === filters.make.toLowerCase() || 
             m.label.toLowerCase() === filters.make.toLowerCase()
    );
    
    if (!make) {
      return [{ value: "", label: "All Models" }];
    }

    let models = make.models.map((model) => ({
      value: model.toLowerCase(),
      label: model,
    }));

    // Filter by search query if provided
    if (modelSearchQuery) {
      const query = modelSearchQuery.toLowerCase();
      models = models.filter((model) =>
        model.label.toLowerCase().includes(query)
      );
    }

    return [{ value: "", label: "All Models" }, ...models];
  }, [filters.make, modelSearchQuery]);

  // Get filtered locations based on search query
  const filteredLocations = useMemo(() => {
    return filterLocations(locationSearchQuery).slice(0, 15); // Limit to 15 results
  }, [locationSearchQuery]);

  // Reset model when make changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, model: "" }));
    setModelSearchQuery("");
  }, [filters.make]);

  // Initialize model search query from URL params
  useEffect(() => {
    if (filters.model && filters.make) {
      const make = CAR_MAKES.find(
        (m) => m.value.toLowerCase() === filters.make.toLowerCase() || 
               m.label.toLowerCase() === filters.make.toLowerCase()
      );
      if (make) {
        const model = make.models.find(
          (m) => m.toLowerCase() === filters.model.toLowerCase()
        );
        if (model) {
          setModelSearchQuery(model);
        }
      }
    }
  }, []); // Only run on mount

  // Initialize location search query from URL params
  useEffect(() => {
    if (filters.location) {
      setLocationSearchQuery(filters.location);
    }
  }, []); // Only run on mount

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelInputRef.current &&
        !modelInputRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange("make", e.target.value);
  };

  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModelSearchQuery(value);
    setShowModelDropdown(true);

    // Try to find exact match
    const exactMatch = filteredModels.find(
      (m) => m.label.toLowerCase() === value.toLowerCase() && m.value !== ""
    );
    if (exactMatch) {
      handleFilterChange("model", exactMatch.value);
    } else {
      // Clear model filter if no exact match
      handleFilterChange("model", "");
    }
  };

  const handleModelSelect = (modelValue: string, modelLabel: string) => {
    handleFilterChange("model", modelValue);
    setModelSearchQuery(modelLabel);
    setShowModelDropdown(false);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationSearchQuery(value);
    setShowLocationDropdown(true);
    handleFilterChange("location", value);
  };

  const handleLocationSelect = (location: LocationOption) => {
    const locationValue = location.label;
    handleFilterChange("location", locationValue);
    setLocationSearchQuery(locationValue);
    setShowLocationDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModelDropdown(false);
    setShowLocationDropdown(false);
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      // Only include non-empty values (empty string is falsy, so distance won't be included if "Any Distance" is selected)
      if (v) {
        params.set(k, v);
      }
    });

    router.push(`/cars?${params.toString()}`);
  };

  const makeOptions = getMakeOptions();

  const distanceOptions = [
    { value: "", label: "Any Distance" },
    { value: "10", label: "10 km" },
    { value: "25", label: "25 km" },
    { value: "50", label: "50 km" },
    { value: "100", label: "100 km" },
    { value: "200", label: "200 km" },
    { value: "500", label: "500 km" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4">
          <Input
            name="search"
            type="text"
            placeholder="Search by title, description, make, model, or location..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            name="make"
            label="Make"
            options={makeOptions}
            defaultValue={filters.make}
            onChange={handleMakeChange}
          />
          <div className="relative w-full" ref={modelInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Model
            </label>
            <Input
              name="model"
              type="text"
              placeholder={filters.make ? "Search models..." : "Select make first"}
              value={modelSearchQuery}
              onChange={handleModelInputChange}
              onFocus={() => filters.make && setShowModelDropdown(true)}
              disabled={!filters.make}
            />
            {showModelDropdown && filters.make && filteredModels.length > 1 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {filteredModels.slice(0, 20).map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => handleModelSelect(model.value, model.label)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
                  >
                    {model.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-full" ref={locationInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              City/Postal Code
            </label>
            <Input
              name="location"
              type="text"
              placeholder="e.g., Toronto, ON or M5H"
              value={locationSearchQuery}
              onChange={handleLocationInputChange}
              onFocus={() => setShowLocationDropdown(true)}
            />
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {filteredLocations.map((location) => (
                  <button
                    key={location.value}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Select
            name="distance"
            label="Distance"
            options={distanceOptions}
            defaultValue={filters.distance || ""}
            onChange={(e) => handleFilterChange("distance", e.target.value)}
            key={`distance-${filters.distance || ""}`}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" className="min-w-[200px]">
            Show results
          </Button>
        </div>
      </div>
    </form>
  );
}
