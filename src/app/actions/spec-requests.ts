"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for spec requests
const specRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year_min: z.coerce.number().int().min(1900).max(2100).optional(),
  year_max: z.coerce.number().int().min(1900).max(2100).optional(),
  mileage_max: z.coerce.number().int().min(0).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  transmission: z.enum(["automatic", "manual", "any"]).optional(),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "hybrid", "other", "any"]).optional(),
  condition_type: z.enum(["new", "used", "any"]).optional(),
  color: z.string().optional(),
  additional_requirements: z.string().optional(),
});

export async function createSpecRequest(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get user for user_id - catch auth errors (e.g. "Failed to fetch") so form still works
    let user: { id: string } | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (authErr) {
      // Continue without user_id - anonymous submission
    }

    // Parse and validate form data
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string | null,
      make: formData.get("make") as string | null,
      model: formData.get("model") as string | null,
      year_min: formData.get("year_min") || null,
      year_max: formData.get("year_max") || null,
      mileage_max: formData.get("mileage_max") || null,
      price_min: formData.get("price_min") || null,
      price_max: formData.get("price_max") || null,
      transmission: formData.get("transmission") as string | null,
      fuel_type: formData.get("fuel_type") as string | null,
      condition_type: formData.get("condition_type") as string | null,
      color: formData.get("color") as string | null,
      additional_requirements: formData.get("additional_requirements") as string | null,
    };

    // Remove empty strings and convert to proper types
    const cleanedData: any = {
      first_name: rawData.first_name,
      last_name: rawData.last_name,
      email: rawData.email,
      user_id: user?.id || null,
    };

    if (rawData.phone) cleanedData.phone = rawData.phone;
    if (rawData.make) cleanedData.make = rawData.make;
    if (rawData.model) cleanedData.model = rawData.model;
    if (rawData.year_min) cleanedData.year_min = parseInt(rawData.year_min as string);
    if (rawData.year_max) cleanedData.year_max = parseInt(rawData.year_max as string);
    if (rawData.mileage_max) cleanedData.mileage_max = parseInt(rawData.mileage_max as string);
    if (rawData.price_min) cleanedData.price_min = parseFloat(rawData.price_min as string);
    if (rawData.price_max) cleanedData.price_max = parseFloat(rawData.price_max as string);
    if (rawData.transmission) cleanedData.transmission = rawData.transmission;
    if (rawData.fuel_type) cleanedData.fuel_type = rawData.fuel_type;
    if (rawData.condition_type) cleanedData.condition_type = rawData.condition_type;
    if (rawData.color) cleanedData.color = rawData.color;
    if (rawData.additional_requirements) cleanedData.additional_requirements = rawData.additional_requirements;

    // Validate the data
    const validatedData = specRequestSchema.parse(cleanedData);

    // Strip undefined values - Supabase rejects them
    const insertData = Object.fromEntries(
      Object.entries(validatedData).filter(([, v]) => v !== undefined)
    );

    // Try admin client first (bypasses RLS), fall back to regular client
    const adminClient = createAdminClient();
    let insertClient = adminClient ?? supabase;

    let result = await insertClient
      .from("car_spec_requests")
      .insert([insertData])
      .select()
      .single();

    // If admin client fails with network/API error, try regular client (in case RLS was fixed)
    if (result.error && adminClient) {
      const errMsg = result.error.message?.toLowerCase() || "";
      if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("invalid")) {
        result = await supabase
          .from("car_spec_requests")
          .insert([insertData])
          .select()
          .single();
      }
    }

    if (result.error) {
      console.error("Error creating spec request:", result.error);
      const msg = result.error.message;
      // Helpful message for common issues
      if (msg?.toLowerCase().includes("fetch") || msg?.toLowerCase().includes("network")) {
        return {
          error: "Connection error. Please check your SUPABASE_SERVICE_ROLE_KEY in .env.local (or run FIX_CAR_SPEC_REQUESTS_RLS.sql in Supabase).",
          data: null,
        };
      }
      return { error: msg || "Failed to create spec request", data: null };
    }

    const { data } = result;

    revalidatePath("/order-spec");
    revalidatePath("/admin/spec-requests");

    return { error: null, data };
  } catch (error: any) {
    console.error("Error in createSpecRequest:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message, data: null };
    }
    const msg = error?.message || "Failed to create spec request";
    if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
      return {
        error: "Connection error. Verify SUPABASE_SERVICE_ROLE_KEY in .env.local, or run FIX_CAR_SPEC_REQUESTS_RLS.sql in Supabase and remove the service role key.",
        data: null,
      };
    }
    return { error: msg, data: null };
  }
}

export async function getSpecRequestsForAdmin() {
  try {
    const supabase = await createClient();
    let user: { id: string } | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      return { error: "Unauthorized", data: null };
    }

    if (!user) {
      return { error: "Unauthorized", data: null };
    }

    // Use admin client to bypass RLS for profile check and spec requests fetch
    const adminClient = createAdminClient();
    const client = adminClient ?? supabase;

    // Check if user is admin
    const { data: profile } = await client
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const { data: userRole } = await client
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin" || userRole?.role === "admin";
    if (!isAdmin) {
      return { error: "Unauthorized: Admin access required", data: null };
    }

    // Fetch all spec requests (admin client bypasses RLS)
    const { data, error } = await client
      .from("car_spec_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching spec requests:", error);
      const msg = error.message;
      if (msg?.toLowerCase().includes("does not exist")) {
        return {
          error: "Table 'car_spec_requests' not found. Run CREATE_CAR_SPEC_REQUESTS_TABLE.sql in Supabase.",
          data: null,
        };
      }
      return { error: msg || "Failed to fetch spec requests", data: null };
    }

    return { error: null, data: data || [] };
  } catch (error: any) {
    console.error("Error in getSpecRequestsForAdmin:", error);
    const msg = error?.message || "Failed to fetch spec requests";
    if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
      return {
        error: "Connection error. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local and restart the server.",
        data: null,
      };
    }
    return { error: msg, data: null };
  }
}

export async function getUserSpecRequests() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", data: null };
    }

    // Fetch user's own spec requests
    const { data, error } = await supabase
      .from("car_spec_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user spec requests:", error);
      return { error: error.message, data: null };
    }

    return { error: null, data: data || [] };
  } catch (error: any) {
    console.error("Error in getUserSpecRequests:", error);
    return { error: error.message || "Failed to fetch spec requests", data: null };
  }
}

export async function updateSpecRequestStatus(id: string, status: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized", data: null };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Unauthorized: Admin access required", data: null };
    }

    // Update the status
    const { data, error } = await supabase
      .from("car_spec_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating spec request status:", error);
      return { error: error.message, data: null };
    }

    revalidatePath("/admin/spec-requests");

    return { error: null, data };
  } catch (error: any) {
    console.error("Error in updateSpecRequestStatus:", error);
    return { error: error.message || "Failed to update spec request status", data: null };
  }
}
