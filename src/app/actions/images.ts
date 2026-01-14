"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadCarImages(listingId: string, files: File[]) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", imageUrls: [] };
  }

  // Verify listing ownership
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", listingId)
    .single();

  if (listingError || listing?.user_id !== user.id) {
    return { error: "Unauthorized", imageUrls: [] };
  }

  const uploadedImages = [];

  // Upload each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${listingId}/${Date.now()}-${i}.${fileExt}`;

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(`Error uploading image ${i + 1}:`, uploadError);
      continue; // Skip this image but continue with others
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("car-images").getPublicUrl(uploadData.path);

    uploadedImages.push({
      url: publicUrl,
      position: i,
    });
  }

  if (uploadedImages.length === 0) {
    return { error: "Failed to upload any images", imageUrls: [] };
  }

  // Insert image records into car_images table
  const imageRecords = uploadedImages.map((img) => ({
    listing_id: listingId,
    image_url: img.url,
    position: img.position,
  }));

  const { error: insertError } = await supabase
    .from("car_images")
    .insert(imageRecords);

  if (insertError) {
    console.error("Error saving image records:", insertError);
    return { error: insertError.message, imageUrls: uploadedImages.map((img) => img.url) };
  }

  // Revalidate paths to refresh listings
  revalidatePath(`/cars/${listingId}`);
  revalidatePath("/cars");
  revalidatePath("/dashboard/my-listings");

  return { error: null, imageUrls: uploadedImages.map((img) => img.url) };
}
