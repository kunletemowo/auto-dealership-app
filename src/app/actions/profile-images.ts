"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadProfileAvatar(file: File) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", url: null };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { error: "Please upload only JPEG, PNG, or WebP images", url: null };
  }

  // Validate file size (max 3MB for profile pictures)
  const maxSize = 3 * 1024 * 1024; // 3MB
  if (file.size > maxSize) {
    return { error: "Image must be less than 3MB", url: null };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  // Upload file to profile-avatars bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    // Provide more specific error messages
    if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("does not exist")) {
      return { error: "Storage bucket not configured. Please set up the 'profile-avatars' bucket in Supabase Storage.", url: null };
    }
    if (uploadError.message.includes("new row violates row-level security")) {
      return { error: "Permission denied. Please check your storage policies.", url: null };
    }
    return { error: uploadError.message || "Failed to upload image to storage", url: null };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-avatars").getPublicUrl(uploadData.path);

  // Update profile with avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    // If update fails, try to delete the uploaded file
    await supabase.storage.from("profile-avatars").remove([uploadData.path]);
    return { error: updateError.message, url: null };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return { url: publicUrl, error: null };
}

export async function deleteProfileAvatar() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get current avatar URL
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.avatar_url) {
    return { error: profileError?.message || "No avatar to delete" };
  }

  // Extract path from URL
  const urlParts = profile.avatar_url.split("/profile-avatars/");
  if (urlParts.length !== 2) {
    // If URL format is unexpected, just update the database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
  }

  const filePath = urlParts[1];

  // Delete file from storage
  const { error: deleteError } = await supabase.storage
    .from("profile-avatars")
    .remove([filePath]);

  if (deleteError) {
    // If delete fails, still update the database to remove the reference
    console.error("Error deleting avatar file:", deleteError);
  }

  // Update profile to remove avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return { success: true };
}
