import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase admin client with service role key
 * This bypasses RLS and allows admin operations
 * WARNING: Only use this in server-side admin functions!
 * 
 * Note: This requires @supabase/supabase-js package to be installed.
 * Run: npm install @supabase/supabase-js
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return null instead of throwing to allow graceful fallback
    console.warn(
      "Missing Supabase admin credentials. SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Email search will be limited."
    );
    return null;
  }

  try {
    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (error) {
    console.error("Failed to create admin client:", error);
    return null;
  }
}
