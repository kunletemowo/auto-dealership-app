"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { getMakeOptions, CAR_MAKES } from "@/lib/data/car-makes-models";

const CANADIAN_PROVINCES = [
  { value: "", label: "All Provinces" },
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

interface LocationSuggestion {
  city: string;
  province: string;
  postal_code?: string;
  display_name: string;
}

async function fetchLocationSuggestions({
  query,
  province,
  signal,
}: {
  query: string;
  province?: string;
  signal?: AbortSignal;
}): Promise<{ suggestions: LocationSuggestion[]; error: string | null }> {
  if (!query.trim()) {
    return { suggestions: [], error: null };
  }

  try {
    // Build Nominatim query - restrict to Canada
    let searchQuery = `${query}, Canada`;
    if (province && province.length === 2) {
      // Map province codes to full names for Nominatim
      const provinceMap: Record<string, string> = {
        AB: "Alberta",
        BC: "British Columbia",
        MB: "Manitoba",
        NB: "New Brunswick",
        NL: "Newfoundland and Labrador",
        NS: "Nova Scotia",
        NT: "Northwest Territories",
        NU: "Nunavut",
        ON: "Ontario",
        PE: "Prince Edward Island",
        QC: "Quebec",
        SK: "Saskatchewan",
        YT: "Yukon",
      };
      const provinceName = provinceMap[province] || province;
      searchQuery = `${query}, ${provinceName}, Canada`;
    }

    const params = new URLSearchParams({
      q: searchQuery,
      format: "json",
      addressdetails: "1",
      limit: "10",
      countrycodes: "ca",
      accept_language: "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        signal,
        headers: {
          "User-Agent": "Auto Dealership App",
        },
      }
    );

    if (!response.ok) {
      return { suggestions: [], error: "Failed to fetch suggestions" };
    }

    const data = await response.json();

    const suggestions: LocationSuggestion[] = data
      .map((item: any) => {
        const address = item.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          "";
        const province = address.state || address.province || "";
        const postal_code = address.postcode || "";

        // Extract province code if it's a full name
        const provinceCode = CANADIAN_PROVINCES.find(
          (p) =>
            p.label === province ||
            province.includes(p.label) ||
            p.label.includes(province)
        )?.value || province;

        if (!city && !postal_code) return null;

        return {
          city,
          province: provinceCode || province,
          postal_code,
          display_name: item.display_name,
        };
      })
      .filter(
        (item: LocationSuggestion | null): item is LocationSuggestion =>
          item !== null && (item.city !== "" || item.postal_code !== "")
      )
      // Remove duplicates based on city + province combination
      .filter(
        (item: LocationSuggestion, index: number, self: LocationSuggestion[]) =>
          index ===
          self.findIndex(
            (t) =>
              t.city.toLowerCase() === item.city.toLowerCase() &&
              t.province === item.province
          )
      );

    return { suggestions, error: null };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return { suggestions: [], error: null };
    }
    console.error("Error fetching location suggestions:", error);
    return { suggestions: [], error: error.message || "Failed to fetch suggestions" };
  }
}

export function CarSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: "",
    searchBy: "",
    make: "",
    model: "",
    province: "",
    location: "",
    distance: "",
  });
  
  const [searchByQuery, setSearchByQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);
  
  // Sync filters with URL params after hydration to avoid SSR mismatch
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      searchBy: searchParams.get("searchBy") || "",
      make: searchParams.get("make") || "",
      model: searchParams.get("model") || "",
      province: searchParams.get("province") || "",
      location: searchParams.get("location") || "",
      distance: searchParams.get("distance") || "",
    });
  }, [searchParams]);

  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelInputRef = useRef<HTMLDivElement>(null);

  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
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

  // Fetch location suggestions when query or province changes
  useEffect(() => {
    const trimmed = locationSearchQuery.trim();
    if (trimmed.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    const abortController = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLocationLoading(true);
      const result = await fetchLocationSuggestions({
        query: trimmed,
        province: filters.province || undefined,
        signal: abortController.signal,
      });
      setIsLocationLoading(false);

      if (result.error) {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
        return;
      }

      setLocationSuggestions(result.suggestions);
      setShowLocationDropdown(result.suggestions.length > 0);
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [locationSearchQuery, filters.province]);

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

  // Initialize search query from URL params
  useEffect(() => {
    if (filters.search) {
      setSearchByQuery(filters.search);
    }
  }, []); // Only run on mount

  const handleSelectLocationSuggestion = (suggestion: LocationSuggestion) => {
    // Format location as "City, Province" or use postal code
    let locationValue = "";
    if (suggestion.postal_code) {
      locationValue = `${suggestion.city || suggestion.postal_code}, ${suggestion.province}`;
    } else {
      locationValue = `${suggestion.city}, ${suggestion.province}`;
    }
    setLocationSearchQuery(locationValue);
    handleFilterChange("location", locationValue);
    setShowLocationDropdown(false);
  };

  // Generate search suggestions based on searchBy category
  useEffect(() => {
    const trimmed = searchByQuery.trim();
    
    // Don't show suggestions for Title/Description or when searchBy is not selected
    if (!filters.searchBy || filters.searchBy === "title" || filters.searchBy === "description" || trimmed.length < 2) {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
      return;
    }

    const timeout = setTimeout(() => {
      let suggestions: any[] = [];
      
      if (filters.searchBy === "make") {
        // Show make suggestions
        const query = trimmed.toLowerCase();
        suggestions = CAR_MAKES
          .filter(make => make.label.toLowerCase().includes(query))
          .map(make => ({ value: make.value, label: make.label }))
          .slice(0, 10);
        setSearchSuggestions(suggestions);
        setShowSearchDropdown(suggestions.length > 0);
      } else if (filters.searchBy === "model") {
        // Show model suggestions across all makes
        const query = trimmed.toLowerCase();
        const allModels: any[] = [];
        CAR_MAKES.forEach(make => {
          make.models.forEach(model => {
            if (model.toLowerCase().includes(query)) {
              allModels.push({ value: model.toLowerCase(), label: `${make.label} ${model}` });
            }
          });
        });
        // Remove duplicates
        const uniqueModels = Array.from(new Map(allModels.map(m => [m.value, m])).values());
        suggestions = uniqueModels.slice(0, 15);
        setSearchSuggestions(suggestions);
        setShowSearchDropdown(suggestions.length > 0);
      } else if (filters.searchBy === "location") {
        // Use location suggestions API
        setIsSearchLoading(true);
        const abortController = new AbortController();
        fetchLocationSuggestions({
          query: trimmed,
          province: filters.province || undefined,
          signal: abortController.signal,
        }).then(result => {
          setIsSearchLoading(false);
          if (!result.error && result.suggestions) {
            const locSuggestions = result.suggestions.map(s => ({
              value: s.postal_code ? `${s.city || s.postal_code}, ${s.province} ${s.postal_code}` : `${s.city}, ${s.province}`,
              label: s.postal_code ? `${s.city || s.postal_code}, ${s.province} ${s.postal_code}` : `${s.city}, ${s.province}`,
              display_name: s.display_name,
            }));
            setSearchSuggestions(locSuggestions);
            setShowSearchDropdown(locSuggestions.length > 0);
          }
        });
        return () => abortController.abort();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchByQuery, filters.searchBy, filters.province]);

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
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
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
    if (value.trim().length >= 2) {
      setShowLocationDropdown(true);
    } else {
      setShowLocationDropdown(false);
    }
    handleFilterChange("location", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModelDropdown(false);
    setShowLocationDropdown(false);
    setShowSearchDropdown(false);
    
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

  const searchByOptions = [
    { value: "", label: "All" },
    { value: "make", label: "Make" },
    { value: "model", label: "Model" },
    { value: "title", label: "Title" },
    { value: "description", label: "Description" },
    { value: "location", label: "Location" },
  ];

  const handleSearchByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFilterChange("searchBy", value);
    setSearchByQuery("");
    setSearchSuggestions([]);
    setShowSearchDropdown(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchByQuery(value);
    handleFilterChange("search", value);
    if (value.trim().length >= 2 && filters.searchBy && filters.searchBy !== "title" && filters.searchBy !== "description") {
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSelectSearchSuggestion = (suggestion: any) => {
    setSearchByQuery(suggestion.label);
    handleFilterChange("search", suggestion.label);
    setShowSearchDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <Select
            name="searchBy"
            label="Search by"
            options={searchByOptions}
            value={filters.searchBy}
            onChange={handleSearchByChange}
          />
          <div className="relative w-full" ref={searchInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Search
            </label>
            <Input
              name="search"
              type="text"
              placeholder={
                !filters.searchBy || filters.searchBy === "" 
                  ? "Search by title, description, make, model, or location..."
                  : filters.searchBy === "make"
                  ? "Search by make..."
                  : filters.searchBy === "model"
                  ? "Search by model..."
                  : filters.searchBy === "title"
                  ? "Search by title..."
                  : filters.searchBy === "description"
                  ? "Search by description..."
                  : filters.searchBy === "location"
                  ? "Search by location..."
                  : "Search..."
              }
              value={searchByQuery || filters.search}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (searchByQuery.trim().length >= 2 && filters.searchBy && filters.searchBy !== "title" && filters.searchBy !== "description") {
                  setShowSearchDropdown(true);
                }
              }}
            />
            {isSearchLoading && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                Loading suggestions...
              </div>
            )}
            {showSearchDropdown && !isSearchLoading && searchSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSearchSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
                  >
                    <div className="font-medium">{suggestion.label}</div>
                    {suggestion.display_name && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {suggestion.display_name}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          <Select
            name="province"
            label="Province"
            options={CANADIAN_PROVINCES}
            value={filters.province}
            onChange={(e) => handleFilterChange("province", e.target.value)}
          />
          <div className="relative w-full" ref={locationInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              City/Postal Code
            </label>
            <Input
              name="location"
              type="text"
              placeholder="e.g., Toronto or M5H 2N2"
              value={locationSearchQuery}
              onChange={handleLocationInputChange}
              onFocus={() => {
                if (locationSearchQuery.trim().length >= 2) {
                  setShowLocationDropdown(true);
                }
              }}
            />
            {isLocationLoading && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                Loading suggestions...
              </div>
            )}
            {showLocationDropdown && !isLocationLoading && locationSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectLocationSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
                  >
                    <div className="font-medium">
                      {suggestion.postal_code
                        ? `${suggestion.city || suggestion.postal_code}, ${suggestion.province} ${suggestion.postal_code}`
                        : `${suggestion.city}, ${suggestion.province}`}
                    </div>
                    {suggestion.display_name && suggestion.display_name !== `${suggestion.city}, ${suggestion.province}` && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {suggestion.display_name}
                      </div>
                    )}
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
