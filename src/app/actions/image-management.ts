"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteCarImageById(imageId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get image record to verify ownership and get URL
  const { data: image, error: imageError } = await supabase
    .from("car_images")
    .select(`
      id,
      image_url,
      listing_id,
      car_listings!inner(user_id)
    `)
    .eq("id", imageId)
    .single();

  if (imageError || !image) {
    return { error: "Image not found" };
  }

  // Verify ownership
  const carListing = Array.isArray(image.car_listings) ? image.car_listings[0] : image.car_listings;
  if (!carListing || carListing.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Extract path from URL
  const urlParts = image.image_url.split("/car-images/");
  if (urlParts.length === 2) {
    const filePath = urlParts[1];
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("car-images")
      .remove([filePath]);

    if (deleteError) {
      console.error("Error deleting image from storage:", deleteError);
      // Continue to delete from database even if storage delete fails
    }
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from("car_images")
    .delete()
    .eq("id", imageId);

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath(`/cars/${image.listing_id}`);
  revalidatePath(`/cars/${image.listing_id}/edit`);
  revalidatePath("/dashboard/my-listings");

  return { success: true };
}

export async function reorderCarImages(listingId: string, imageIds: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify listing ownership
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", listingId)
    .single();

  if (listingError || listing?.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Verify all images belong to this listing
  const { data: images, error: imagesError } = await supabase
    .from("car_images")
    .select("id, listing_id")
    .in("id", imageIds);

  if (imagesError) {
    return { error: imagesError.message };
  }

  // Check all images belong to the listing
  const invalidImages = images?.filter((img) => img.listing_id !== listingId);
  if (invalidImages && invalidImages.length > 0) {
    return { error: "Some images do not belong to this listing" };
  }

  // Update positions for each image
  const updates = imageIds.map((imageId, index) => ({
    id: imageId,
    position: index,
  }));

  // Update each image's position
  for (const update of updates) {
    const { error } = await supabase
      .from("car_images")
      .update({ position: update.position })
      .eq("id", update.id);

    if (error) {
      return { error: `Failed to update image position: ${error.message}` };
    }
  }

  revalidatePath(`/cars/${listingId}`);
  revalidatePath(`/cars/${listingId}/edit`);
  revalidatePath("/dashboard/my-listings");

  return { success: true };
}
