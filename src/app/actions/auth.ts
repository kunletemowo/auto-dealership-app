"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

export async function signUp(formData: FormData) {
  // Check for environment variables early
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  
  if (!supabaseUrl || !supabaseKey) {
    // Log for debugging (only in server logs, not exposed to client)
    console.error("Missing Supabase env vars:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseKey?.length || 0,
    });
    
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    
    return {
      error: `Authentication service is not configured. Missing: ${missing.join(", ")}. Please add these in Vercel Dashboard → Settings → Environment Variables → Production, then redeploy.`,
    };
  }

  try {
    const supabase = await createClient();

    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    // Validate input
    const validation = registerSchema.safeParse(rawFormData);
    if (!validation.success) {
      return {
        error: validation.error.errors[0].message,
      };
    }

    const { email, password, firstName, lastName } = validation.data;
    const captchaToken = formData.get("captchaToken") as string | null;

    const signUpOptions: {
      emailRedirectTo?: string;
      data?: { first_name: string; last_name: string; display_name: string };
      captchaToken?: string;
    } = {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        display_name: `${firstName.trim()} ${lastName.trim()}`,
      },
    };
    if (captchaToken) signUpOptions.captchaToken = captchaToken;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: signUpOptions,
    });

    if (error) {
      // Log the full error for debugging
      console.error("Supabase signUp error:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });

      // Check for common error types
      if (error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
        return {
          error: "Unable to connect to authentication service. Please check your internet connection and try again.",
        };
      }
      
      // If it's a database/trigger error, provide helpful message
      if (error.message?.toLowerCase().includes("database") ||
          error.message?.toLowerCase().includes("trigger") ||
          error.message?.toLowerCase().includes("saving new user")) {
        return {
          error: `Account creation failed: ${error.message}. Please check if the database trigger is set up correctly in Supabase.`,
        };
      }

      // Captcha error: surface a clear message (handled in RegisterForm for env-key hint)
      if (error.message?.toLowerCase().includes("captcha")) {
        return { error: error.message };
      }

      return { error: error.message || "An error occurred during signup. Please try again." };
    }

    // Profile is automatically created by database trigger (handle_new_user)
    // No need to manually insert here - the trigger handles it
    // If the trigger isn't set up, the user will still be created in auth.users
    // and can create their profile later when needed

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  
  if (!supabaseUrl || !supabaseKey) {
    // Log for debugging (only in server logs, not exposed to client)
    console.error("Missing Supabase env vars:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseKey?.length || 0,
    });
    
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    
    return {
      error: `Authentication service is not configured. Missing: ${missing.join(", ")}. Please add these in Vercel Dashboard → Settings → Environment Variables → Production, then redeploy.`,
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
    const captchaToken = formData.get("captchaToken") as string | null;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      ...(captchaToken && { options: { captchaToken } }),
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
    // Return success - let the client handle the redirect to avoid NEXT_REDIRECT error
    return { success: true };
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

export async function requestPasswordReset(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return {
      error:
        "Authentication service is not configured. Please contact support.",
    };
  }

  try {
    const supabase = await createClient();

    const email = (formData.get("email") as string | null)?.trim() || "";
    if (!email) {
      return { error: "Please enter your email address." };
    }

    const parsed = loginSchema.pick({ email: true }).safeParse({ email });
    if (!parsed.success) {
      return { error: parsed.error.errors[0].message };
    }

    const redirectUrl =
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/login`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
      return {
        error:
          "We couldn't start a password reset right now. Please try again in a moment.",
      };
    }

    return {
      success:
        "If an account exists for this email, you'll receive a password reset link shortly.",
    };
  } catch (err: any) {
    console.error("Unexpected password reset error:", err);
    return {
      error:
        err?.message ||
        "Something went wrong while requesting a password reset. Please try again.",
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
  try {
    // Check for environment variables early
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return user;
  } catch (err: any) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}
