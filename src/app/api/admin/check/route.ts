import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    let user: { id: string } | null = null;

    // Prefer getSession (reads from cookies, no network) over getUser (validates with Supabase)
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      user = sessionData?.session?.user ?? null;
      if (!user) {
        const { data: userData } = await supabase.auth.getUser();
        user = userData?.user ?? null;
      }
    } catch {
      return NextResponse.json({ isAdmin: false });
    }

    if (!user) {
      return NextResponse.json({ isAdmin: false });
    }

    // Use admin client to bypass RLS when reading profiles
    const adminClient = createAdminClient();
    const client = adminClient ?? supabase;

    let isAdmin = false;

    // Check profiles.role first
    const { data: profile } = await client
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      isAdmin = true;
    } else {
      // Fallback to user_roles table
      const { data: userRole } = await client
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (userRole?.role === "admin") {
        isAdmin = true;
      }
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
