"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveFavorite(listingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save listings" };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single();

  if (existing) {
    return { error: "Listing is already saved", success: false };
  }

  // Insert favorite
  const { error } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      listing_id: listingId,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/saved-listings");
  revalidatePath(`/cars/${listingId}`);
  revalidatePath("/cars");

  return { success: true };
}

export async function unsaveFavorite(listingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to unsave listings" };
  }

  // Delete favorite
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("listing_id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/saved-listings");
  revalidatePath(`/cars/${listingId}`);
  revalidatePath("/cars");

  return { success: true };
}

export async function getSavedListings() {
  try {
    // Check for environment variables early
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { error: "Database connection not configured", data: null };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Not authenticated", data: null };
    }

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        listing_id,
        created_at,
        car_listings(
          id,
          title,
          make,
          model,
          year,
          mileage,
          price,
          currency,
          location_city,
          location_region,
          is_active,
          car_images(image_url, position)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved listings:", error);
      return { error: error.message, data: null };
    }

    // Transform the data to match the expected format
    // Filter out deleted or inactive listings
    const listings = (data || [])
      .filter((fav: any) => fav.car_listings && fav.car_listings.is_active !== false)
      .map((fav: any) => ({
        ...fav.car_listings,
        favorited_at: fav.created_at,
      }));

    return { data: listings, error: null };
  } catch (err: any) {
    console.error("Error in getSavedListings:", err);
    return { error: err.message || "Failed to fetch saved listings", data: null };
  }
}

export async function isFavorite(listingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single();

  return !!data;
}
