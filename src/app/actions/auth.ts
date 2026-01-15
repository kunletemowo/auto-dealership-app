"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

export async function signUp(formData: FormData) {
  // Check for environment variables early
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error: "Authentication service is not configured. Please contact support.",
    };
  }

  try {
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
      // Check for common error types
      if (error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
        return {
          error: "Unable to connect to authentication service. Please check your internet connection and try again.",
        };
      }
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
  } catch (err: any) {
    // Catch any unexpected errors
    console.error("Sign up error:", err);
    if (err.message?.includes("fetch") || err.message?.includes("Failed") || err.message?.includes("NetworkError")) {
      return {
        error: "Unable to connect to authentication service. Please check your internet connection and try again.",
      };
    }
    return {
      error: err.message || "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signIn(formData: FormData) {
  // Check for environment variables early
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error: "Authentication service is not configured. Please contact support.",
    };
  }

  try {
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
      // Check for common error types
      if (error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
        return {
          error: "Unable to connect to authentication service. Please check your internet connection and try again.",
        };
      }
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard/my-listings");
  } catch (err: any) {
    // Catch any unexpected errors
    console.error("Sign in error:", err);
    if (err.message?.includes("fetch") || err.message?.includes("Failed") || err.message?.includes("NetworkError")) {
      return {
        error: "Unable to connect to authentication service. Please check your internet connection and try again.",
      };
    }
    return {
      error: err.message || "An unexpected error occurred. Please try again.",
    };
  }
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
