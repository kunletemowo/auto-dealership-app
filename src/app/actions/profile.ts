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
    location: formData.get("location") as string,
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
      location: profileData.location || null,
      account_type: profileData.account_type || "individual",
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true };
}
