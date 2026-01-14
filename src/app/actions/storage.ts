"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadCarImage(listingId: string, file: File) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", url: null };
  }

  // Verify listing ownership
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", listingId)
    .single();

  if (listingError || listing?.user_id !== user.id) {
    return { error: "Unauthorized", url: null };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${listingId}/${Date.now()}.${fileExt}`;

  // Upload file
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("car-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message, url: null };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("car-images").getPublicUrl(uploadData.path);

  return { url: publicUrl, path: uploadData.path, error: null };
}

export async function deleteCarImage(imageUrl: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Extract path from URL
  const urlParts = imageUrl.split("/car-images/");
  if (urlParts.length !== 2) {
    return { error: "Invalid image URL" };
  }

  const filePath = urlParts[1];

  // Verify ownership through listing
  const listingId = filePath.split("/")[0];
  const { data: listing, error: listingError } = await supabase
    .from("car_listings")
    .select("user_id")
    .eq("id", listingId)
    .single();

  if (listingError || listing?.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Delete file
  const { error: deleteError } = await supabase.storage
    .from("car-images")
    .remove([filePath]);

  if (deleteError) {
    return { error: deleteError.message };
  }

  return { success: true };
}
