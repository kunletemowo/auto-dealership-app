"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate input
  const validation = registerSchema.safeParse(rawFormData);
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const { email, password } = validation.data;

  // Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Create profile entry
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      display_name: email.split("@")[0], // Default to email username
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Don't fail the signup if profile creation fails
    }
  }

  revalidatePath("/", "layout");
  return { success: true, user: data.user };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input
  const validation = loginSchema.safeParse(rawFormData);
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const { email, password } = validation.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/my-listings");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
