"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateListingStatus(
  listingId: string,
  status: "active" | "inactive" | "sold" | "unavailable"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update listing status" };
  }

  // Verify ownership
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", listingId)
    .single();

  if (listingError || listing?.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Update status and is_active
  // is_active should be true only when status is 'active'
  const isActive = status === "active";

  const { error } = await supabase
    .from("car_listings")
    .update({
      status: status,
      is_active: isActive,
    })
    .eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/my-listings");
  revalidatePath(`/cars/${listingId}`);
  revalidatePath("/cars");

  return { success: true };
}
