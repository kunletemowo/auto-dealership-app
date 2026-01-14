"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validators/profile";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  // Include email from auth user
  return { data: { ...data, email: user.email }, error: null };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update your profile" };
  }

  const rawData = {
    display_name: formData.get("display_name") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    province: formData.get("province") as string,
    postal_code: formData.get("postal_code") as string,
    account_type: formData.get("account_type") as string || "individual",
  };

  // Validate input
  const validation = profileUpdateSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const profileData = validation.data;

  // Update profile - convert empty strings to null for optional fields
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: profileData.display_name,
      phone: profileData.phone || null,
      address: profileData.address || null,
      city: profileData.city,
      province: profileData.province || null,
      postal_code: profileData.postal_code || null,
      // Backward-compat: keep location populated for any older UI / queries
      location: profileData.city && profileData.province ? `${profileData.city}, ${profileData.province}` : profileData.city || profileData.province || null,
      account_type: profileData.account_type || "individual",
    })
    .eq("id", user.id);

  if (error) {
    // Check if error is due to missing columns (migration not run)
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("address") || errorMessage.includes("city") || errorMessage.includes("province") || errorMessage.includes("postal_code") || errorMessage.includes("schema cache")) {
      return { 
        error: "Database migration required. Please run ADD_PROFILE_LOCATION_FIELDS.sql in your Supabase SQL Editor. See PROFILE_MIGRATION_INSTRUCTIONS.md for detailed steps." 
      };
    }
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true };
}
