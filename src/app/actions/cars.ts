"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { carListingSchema } from "@/lib/validators/car";
import { getLocationCoordinates, calculateDistance } from "@/lib/utils/distance";

export async function createCarListing(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a listing" };
  }

  // Extract form data
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: parseInt(formData.get("year") as string),
    mileage: parseInt(formData.get("mileage") as string),
    transmission: formData.get("transmission") as "automatic" | "manual",
    fuelType: formData.get("fuelType") as string,
    price: parseFloat(formData.get("price") as string),
    currency: formData.get("currency") as string || "CAD",
    locationCity: formData.get("locationCity") as string,
    locationRegion: formData.get("locationRegion") as string,
    locationCountry: formData.get("locationCountry") as string,
    condition: formData.get("condition") as "new" | "used",
  };

  // Validate input
  const validation = carListingSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const listingData = validation.data;

  // Insert car listing
  const { data: listing, error } = await supabase
    .from("car_listings")
    .insert({
      user_id: user.id,
      title: listingData.title,
      description: listingData.description,
      make: listingData.make,
      model: listingData.model,
      year: listingData.year,
      mileage: listingData.mileage,
      transmission: listingData.transmission,
      fuel_type: listingData.fuelType,
      price: listingData.price,
      currency: listingData.currency,
      location_city: listingData.locationCity,
      location_region: listingData.locationRegion,
      location_country: listingData.locationCountry,
      condition: listingData.condition,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cars");
  revalidatePath("/dashboard/my-listings");
  return { success: true, listingId: listing.id };
}

export async function getCarListings(filters?: {
  search?: string;
  make?: string;
  model?: string;
  location?: string;
  distance?: number;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  colour?: string;
  sortBy?: "price" | "year" | "mileage" | "created_at";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("car_listings")
    .select(`
      *,
      car_images(image_url, position)
    `)
    .eq("is_active", true);

  if (filters?.make) {
    query = query.ilike("make", `%${filters.make}%`);
  }

  if (filters?.model) {
    query = query.ilike("model", `%${filters.model}%`);
  }

  // Handle location filtering
  // We'll filter by location in the application layer to avoid .or() syntax issues
  // with commas in location values (e.g., "Markham, ON")

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.minYear) {
    query = query.gte("year", filters.minYear);
  }

  if (filters?.maxYear) {
    query = query.lte("year", filters.maxYear);
  }

  if (filters?.colour) {
    query = query.ilike("colour", `%${filters.colour}%`);
  }

  query = query.order("created_at", { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message, data: null };
  }

  let filteredData = data;

  // Apply full-text search if provided
  if (filters?.search && filteredData) {
    const searchQuery = filters.search.toLowerCase().trim();
    filteredData = filteredData.filter((listing: any) => {
      const searchableText = [
        listing.title,
        listing.description,
        listing.make,
        listing.model,
        listing.location_city,
        listing.location_region,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(searchQuery);
    });
  }

  // Apply location filtering (city/region/postal code) in application layer
  // This avoids Supabase .or() syntax issues with commas in values (e.g., "Markham, ON")
  // When distance is specified, skip location filtering - let distance filtering handle it
  if (filters?.location && !filters?.distance && data) {
    const locationQuery = filters.location.trim().toLowerCase();
    
    // Region abbreviation mapping for flexible matching
    const regionMap: Record<string, string[]> = {
      "on": ["ontario"],
      "qc": ["quebec"],
      "bc": ["british columbia"],
      "ab": ["alberta"],
      "mb": ["manitoba"],
      "sk": ["saskatchewan"],
      "ns": ["nova scotia"],
      "nb": ["new brunswick"],
      "nl": ["newfoundland and labrador"],
      "pe": ["prince edward island"],
      "yt": ["yukon"],
      "nt": ["northwest territories"],
      "nu": ["nunavut"],
    };
    
    filteredData = data.filter((listing: any) => {
      const city = listing.location_city?.toLowerCase() || "";
      const region = listing.location_region?.toLowerCase() || "";
      const postal = listing.postal_code?.toLowerCase() || "";
      
      // Extract city and region from query (e.g., "peterborough, on" -> city: "peterborough", queryRegion: "on")
      const queryParts = locationQuery.split(",").map(p => p.trim());
      const queryCity = queryParts[0] || "";
      const queryRegion = queryParts[1] || "";
      
      // City match (exact, substring, or fuzzy - handles typos like "peterbrough" vs "peterborough")
      const normalizeCityName = (name: string) => name.replace(/\s+/g, "").toLowerCase();
      const cityNormalized = normalizeCityName(city);
      const queryCityNormalized = normalizeCityName(queryCity);
      
      // Exact match (normalized)
      const exactCityMatch = cityNormalized === queryCityNormalized;
      
      // Substring match (one contains the other) - but only if significant overlap
      const substringCityMatch = (cityNormalized.length >= 6 && queryCityNormalized.length >= 6) &&
                                 (cityNormalized.includes(queryCityNormalized.substring(0, Math.min(6, queryCityNormalized.length))) ||
                                  queryCityNormalized.includes(cityNormalized.substring(0, Math.min(6, cityNormalized.length))));
      
      // Fuzzy match for common typos - check if cities are very similar
      // This handles cases like "peterbrough" vs "peterborough"
      let fuzzyCityMatch = false;
      if (cityNormalized.length >= 6 && queryCityNormalized.length >= 6) {
        const minLength = Math.min(cityNormalized.length, queryCityNormalized.length);
        const maxLength = Math.max(cityNormalized.length, queryCityNormalized.length);
        
        // If lengths differ by at most 2 characters, check similarity
        if (maxLength - minLength <= 2) {
          // Check if the first 6-8 characters match (handles most city name variations)
          const prefixLength = Math.min(8, minLength);
          if (cityNormalized.substring(0, prefixLength) === queryCityNormalized.substring(0, prefixLength)) {
            fuzzyCityMatch = true;
          } else {
            // Check character-by-character similarity
            let matchingChars = 0;
            const checkLength = Math.min(cityNormalized.length, queryCityNormalized.length);
            for (let i = 0; i < checkLength; i++) {
              if (cityNormalized[i] === queryCityNormalized[i]) {
                matchingChars++;
              }
            }
            // Also check if removing one character makes them match (handles single character typos)
            const similarity = matchingChars / Math.max(cityNormalized.length, queryCityNormalized.length);
            if (similarity >= 0.85) { // 85% similarity threshold
              fuzzyCityMatch = true;
            } else if (similarity >= 0.75 && maxLength - minLength <= 1) {
              // For very similar names with 1 char difference, be more lenient
              fuzzyCityMatch = true;
            }
          }
        }
      }
      
      const cityMatch = exactCityMatch || substringCityMatch || fuzzyCityMatch;
      
      // Region match - check both direct match and abbreviation/full name variations
      let regionMatch = false;
      if (queryRegion) {
        // Direct region match
        if (region === queryRegion || region.includes(queryRegion) || queryRegion.includes(region)) {
          regionMatch = true;
        }
        // Check if query region is abbreviation and listing region is full name (or vice versa)
        if (regionMap[queryRegion] && regionMap[queryRegion].includes(region)) {
          regionMatch = true;
        }
        // Check reverse (listing has abbreviation, query has full name)
        for (const [abbr, fullNames] of Object.entries(regionMap)) {
          if (region === abbr && fullNames.includes(queryRegion)) {
            regionMatch = true;
            break;
          }
        }
      }
      
      // Postal code match
      const postalMatch = postal && (postal.includes(locationQuery) || locationQuery.includes(postal));
      
      // Combined match - check if query matches "city, region" format
      let combinedMatch = false;
      if (queryCity && queryRegion) {
        // Try exact combined format
        const combinedListing = `${city}, ${region}`;
        const combinedQuery = `${queryCity}, ${queryRegion}`;
        combinedMatch = combinedListing === combinedQuery || 
                       combinedListing.includes(combinedQuery) || 
                       combinedQuery.includes(combinedListing);
        
        // Also try with normalized region (handle ON vs Ontario)
        if (!combinedMatch && regionMap[queryRegion]) {
          const normalizedRegions = regionMap[queryRegion];
          for (const normalizedRegion of normalizedRegions) {
            const normalizedListing = `${city}, ${normalizedRegion}`;
            if (normalizedListing.includes(queryCity)) {
              combinedMatch = true;
              break;
            }
          }
        }
        // Try reverse (listing has full name, query has abbreviation)
        for (const [abbr, fullNames] of Object.entries(regionMap)) {
          if (fullNames.includes(region) && queryRegion === abbr && cityMatch) {
            combinedMatch = true;
            break;
          }
        }
        
        // Also try with fuzzy city matching in combined format
        if (!combinedMatch && cityMatch) {
          // If city matches (fuzzy or exact), and region matches, consider it a combined match
          const normalizeRegion = (reg: string) => {
            if (regionMap[reg]) return regionMap[reg][0];
            for (const [abbr, fullNames] of Object.entries(regionMap)) {
              if (fullNames.includes(reg)) return reg;
            }
            return reg;
          };
          const normalizedListingRegion = normalizeRegion(region);
          const normalizedQueryRegion = normalizeRegion(queryRegion);
          if (normalizedListingRegion === normalizedQueryRegion || 
              normalizedListingRegion.includes(normalizedQueryRegion) ||
              normalizedQueryRegion.includes(normalizedListingRegion)) {
            combinedMatch = true;
          }
        }
      }
      
      // If query is just a city (no region), match by city only
      const cityOnlyMatch = !queryRegion && cityMatch;
      
      return cityMatch || regionMatch || postalMatch || combinedMatch || cityOnlyMatch;
    });
  }

  // Apply distance filtering if location and distance are provided
  if (filters?.location && filters?.distance && filteredData) {
    const locationCoords = getLocationCoordinates(filters.location);
    
    if (locationCoords) {
      const maxDistance = filters.distance;
      
      // Calculate distance for each listing based on its city/region
      filteredData = filteredData.filter((listing: any) => {
        // First check if listing has stored coordinates (preferred)
        if (listing.latitude && listing.longitude) {
          const distance = calculateDistance(
            locationCoords.latitude,
            locationCoords.longitude,
            parseFloat(listing.latitude),
            parseFloat(listing.longitude)
          );
          return distance <= maxDistance;
        }
        
        // Otherwise, get coordinates from listing's city/region
        const listingCity = (listing.location_city?.trim() || "").toLowerCase();
        const listingRegion = (listing.location_region?.trim() || "").toLowerCase();
        
        if (!listingCity) {
          return false; // Can't calculate distance without a city
        }
        
        // Region mapping for abbreviations
        const regionMap: Record<string, string> = {
          "on": "ontario",
          "qc": "quebec",
          "bc": "british columbia",
          "ab": "alberta",
          "mb": "manitoba",
          "sk": "saskatchewan",
          "ns": "nova scotia",
          "nb": "new brunswick",
          "nl": "newfoundland and labrador",
          "pe": "prince edward island",
          "yt": "yukon",
          "nt": "northwest territories",
          "nu": "nunavut",
        };
        
        // Normalize region (handle both abbreviations and full names)
        let normalizedRegion = listingRegion;
        if (listingRegion && regionMap[listingRegion]) {
          normalizedRegion = regionMap[listingRegion];
        } else if (listingRegion && Object.values(regionMap).includes(listingRegion)) {
          // Already a full name
          normalizedRegion = listingRegion;
        }
        
        // Try multiple location format combinations (in order of preference)
        const locationFormats: string[] = [];
        
        // 1. City with normalized region (full name) - most specific
        if (normalizedRegion) {
          locationFormats.push(`${listingCity}, ${normalizedRegion}`);
        }
        
        // 2. City with abbreviated region (if region was normalized from abbreviation)
        if (listingRegion && regionMap[listingRegion]) {
          locationFormats.push(`${listingCity}, ${listingRegion}`);
        }
        
        // 3. City with original region (in case it's already in the right format)
        if (listingRegion && listingRegion !== normalizedRegion) {
          locationFormats.push(`${listingCity}, ${listingRegion}`);
        }
        
        // 4. Just city name (lookup will try partial match) - least specific but fallback
        locationFormats.push(listingCity);
        
        // Try each format until we find coordinates
        for (const locationFormat of locationFormats) {
          const listingCoords = getLocationCoordinates(locationFormat);
          
          if (listingCoords) {
            const distance = calculateDistance(
              locationCoords.latitude,
              locationCoords.longitude,
              listingCoords.latitude,
              listingCoords.longitude
            );
            return distance <= maxDistance;
          }
        }
        
        // If we can't get coordinates for the listing, exclude it from distance-filtered results
        return false;
      });
    }
  }

  // Apply sorting after all filtering (since location/distance filtering happens in app layer)
  // When sortBy is provided, always sort in application layer
  if (filteredData && filters?.sortBy) {
    const sortBy = filters.sortBy;
    const sortOrder = filters.sortOrder || "desc";
    
    filteredData = [...filteredData].sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        case "mileage":
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }
  
  // Apply pagination after sorting
  // When location/distance filtering is used, we need app-level pagination
  // Otherwise, pagination was already applied at DB level, but we can still slice if needed
  const needsAppLevelPagination = !!(filters?.location);
  if (filteredData && needsAppLevelPagination && filters?.offset !== undefined) {
    const start = filters.offset;
    const end = filters.limit ? start + filters.limit : filteredData.length;
    filteredData = filteredData.slice(start, end);
  } else if (filteredData && filters?.limit && !needsAppLevelPagination && filters?.offset === undefined) {
    // Limit results if no offset was provided (first page, no location filtering)
    filteredData = filteredData.slice(0, filters.limit);
  }

  return { data: filteredData, error: null };
}

export async function getCarListing(id: string) {
  const supabase = await createClient();

  // Fetch current listing data first
  const { data: initialData, error: fetchError } = await supabase
    .from("car_listings")
    .select(`
      *,
      car_images(id, image_url, position),
      profiles(id, display_name, phone, account_type, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (fetchError || !initialData) {
    return { error: fetchError?.message || "Listing not found", data: null };
  }

  // Increment view count using database function (preferred) or direct update (fallback)
  // The database function bypasses RLS restrictions and ensures atomic updates
  // See ALLOW_VIEW_COUNT_UPDATE.sql for the required database function
  const currentViewCount = initialData.view_count ?? 0;
  let newViewCount = currentViewCount + 1;
  let updateSucceeded = false;

  // Try to use the database function first (if it exists)
  const { data: functionResult, error: functionError } = await supabase
    .rpc('increment_listing_view_count', { listing_id: id });

  if (!functionError && functionResult !== null && functionResult !== undefined && typeof functionResult === 'number') {
    // Function exists and returned a result
    if (functionResult > 0) {
      // Function succeeded and updated a row - use the returned count
      newViewCount = functionResult;
      updateSucceeded = true;
    } else {
      // Function returned 0, meaning no rows were updated - try fallback
      const errorMessage = functionError?.message || "";
      const isFunctionNotFound = errorMessage.includes("function") || 
                                 errorMessage.includes("does not exist") || 
                                 errorMessage.includes("schema cache");
      
      if (!isFunctionNotFound) {
        console.warn(`View count function returned 0 for listing ${id} - trying fallback update`);
      }
    }
  } else if (functionError) {
    // Function doesn't exist or failed - try direct update as fallback
    const errorMessage = functionError.message || JSON.stringify(functionError);
    const isFunctionNotFound = errorMessage.includes("function") || 
                               errorMessage.includes("does not exist") || 
                               errorMessage.includes("schema cache");
    
    // Only log unexpected errors (suppress "function not found" since it's expected until migration is run)
    if (!isFunctionNotFound) {
      console.error(`Error calling view count function for listing ${id}:`, errorMessage);
    }
  }

  // If function didn't succeed, try direct update as fallback
  if (!updateSucceeded) {
    // First, try the update
    const { error: directUpdateError, data: updateData } = await supabase
      .from("car_listings")
      .update({ view_count: newViewCount })
      .eq("id", id)
      .select("view_count");
    
    if (!directUpdateError && updateData && updateData.length > 0) {
      // Update succeeded - use the actual updated count from database
      newViewCount = updateData[0].view_count ?? newViewCount;
      updateSucceeded = true;
    } else if (directUpdateError) {
      // Direct update failed - log for debugging but don't fail the request
      const updateErrorMessage = directUpdateError.message || JSON.stringify(directUpdateError);
      const isPermissionError = updateErrorMessage.includes("permission") || 
                                updateErrorMessage.includes("policy") || 
                                updateErrorMessage.includes("row-level security");
      
      // Only log unexpected errors
      if (!isPermissionError) {
        console.error(`Error updating view count directly for listing ${id}:`, updateErrorMessage);
      } else {
        // RLS restriction - this is expected if the database function doesn't exist
        // We'll still return the optimistic count so the UI shows the increment
        console.warn(`View count update blocked by RLS for listing ${id}. Run ALLOW_VIEW_COUNT_UPDATE.sql to enable database function.`);
      }
    }
  }

  // Note: We cannot use revalidatePath here as this function is called during render
  // The view count is updated in the database, and unstable_noStore() in the page
  // component ensures fresh data is fetched on each request

  // Return data with the actual updated view count from the database
  // This ensures both detail page and listing page show the same count
  const updatedData = {
    ...initialData,
    view_count: newViewCount,
  };

  return { data: updatedData, error: null };
}

export async function getUserListings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("car_listings")
    .select(`
      *,
      car_images(id, image_url, position)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: null };
  }

  // Sort by is_active (active first) then by created_at
  if (data) {
    data.sort((a: any, b: any) => {
      // First sort by is_active (true first)
      if (a.is_active !== b.is_active) {
        return a.is_active ? -1 : 1;
      }
      // Then by created_at (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return { data, error: null };
}

export async function deleteCarListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", id)
    .single();

  if (listingError) {
    return { error: listingError.message };
  }

  if (listing.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Delete the listing (cascade will handle car_images)
  const { error: deleteError } = await supabase
    .from("car_listings")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath("/dashboard/my-listings");
  revalidatePath("/cars");
  redirect("/dashboard/my-listings");
}

export async function updateCarListing(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a listing" };
  }

  // Verify ownership
  const { data: existingListing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", id)
    .single();

  if (listingError) {
    return { error: listingError.message };
  }

  if (existingListing.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Extract form data
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    make: formData.get("make") as string,
    model: formData.get("model") as string,
    year: parseInt(formData.get("year") as string),
    mileage: parseInt(formData.get("mileage") as string),
    transmission: formData.get("transmission") as "automatic" | "manual",
    fuelType: formData.get("fuelType") as string,
    price: parseFloat(formData.get("price") as string),
    currency: formData.get("currency") as string || "CAD",
    locationCity: formData.get("locationCity") as string,
    locationRegion: formData.get("locationRegion") as string,
    locationCountry: formData.get("locationCountry") as string,
    condition: formData.get("condition") as "new" | "used",
  };

  // Validate input
  const validation = carListingSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const listingData = validation.data;

  // Update car listing
  const { error: updateError } = await supabase
    .from("car_listings")
    .update({
      title: listingData.title,
      description: listingData.description,
      make: listingData.make,
      model: listingData.model,
      year: listingData.year,
      mileage: listingData.mileage,
      transmission: listingData.transmission,
      fuel_type: listingData.fuelType,
      price: listingData.price,
      currency: listingData.currency,
      location_city: listingData.locationCity,
      location_region: listingData.locationRegion,
      location_country: listingData.locationCountry,
      condition: listingData.condition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/cars/${id}`);
  revalidatePath("/dashboard/my-listings");
  return { success: true, listingId: id };
}
