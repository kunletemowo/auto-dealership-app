"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // First check profiles.role (no RLS recursion risk)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") return true;

    // Then check user_roles table (might trigger recursion if RLS not fixed)
    // Wrap in try-catch to handle recursion errors gracefully
    try {
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      // If we get a recursion error, fall back to profiles.role
      if (roleError?.message?.includes("infinite recursion") || roleError?.message?.includes("recursion")) {
        console.warn("RLS recursion detected in user_roles, using profiles.role instead");
        return profile?.role === "admin";
      }

      if (userRole?.role === "admin") return true;
    } catch (err: any) {
      // Handle recursion or other errors gracefully
      if (err?.message?.includes("infinite recursion") || err?.message?.includes("recursion")) {
        console.warn("RLS recursion detected, using profiles.role instead");
        return profile?.role === "admin";
      }
      // For other errors, just fall back to profiles.role
      console.warn("Error checking user_roles, using profiles.role:", err);
    }

    return profile?.role === "admin";
  } catch (err: any) {
    console.error("Error in checkIsAdmin:", err);
    return false;
  }
}

/**
 * Get all users with their roles and permissions
 * Only visible to admins and users with admin rights
 */
export async function getUsersForAdmin(searchQuery?: string) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required", data: null };
  }

  try {
    const supabase = await createClient();

    // Verify we have a valid client
    if (!supabase) {
      return { error: "Failed to create Supabase client", data: null };
    }

    // First, get profiles - simple query without email column
    let profiles, profilesError;
    
    try {
      const result = await supabase
        .from("profiles")
        .select("id, display_name, role, account_type, created_at")
        .order("created_at", { ascending: false });
      
      profiles = result.data;
      profilesError = result.error;
    } catch (queryError: any) {
      console.error("Query execution error:", queryError);
      return { 
        error: queryError?.message || "Failed to execute query. Check if profiles table exists.", 
        data: null 
      };
    }

    // Handle error - check if it's an empty object or has actual error info
    if (profilesError) {
      // Log the full error for debugging
      const errorStr = JSON.stringify(profilesError, null, 2);
      const errorMessage = profilesError?.message || 
                          (typeof profilesError === 'string' ? profilesError : '') ||
                          (errorStr !== '{}' ? errorStr : 'Unknown database error');
      const errorCode = profilesError?.code || "";
      
      console.error("Error fetching profiles:", {
        error: profilesError,
        stringified: errorStr,
        message: profilesError?.message,
        code: errorCode,
        details: profilesError?.details,
        hint: profilesError?.hint,
        type: typeof profilesError,
        keys: Object.keys(profilesError || {}),
      });
      
      // If error is empty object, it might be an RLS issue
      if (errorStr === '{}' || !profilesError?.message) {
        return { 
          error: "Permission denied or table access issue. Make sure you're logged in as an admin and run FIX_ADMIN_PROFILES_ACCESS.sql to update RLS policies.", 
          data: null 
        };
      }
      
      // Check if it's an RLS policy error
      if (errorCode === "42501" || errorMessage.includes("permission denied") || errorMessage.includes("RLS") || errorMessage.includes("row-level security")) {
        return { 
          error: "Permission denied. Make sure you're logged in as an admin. You may need to run FIX_ADMIN_PROFILES_ACCESS.sql to update RLS policies.", 
          data: null 
        };
      }
      
      return { 
        error: errorMessage || "Failed to fetch profiles. Make sure the profiles table exists and RLS policies allow access.", 
        data: null 
      };
    }

    if (!profiles || profiles.length === 0) {
      return { data: [], error: null };
    }

    // Now fetch roles and permissions separately for each user
    // Wrap in try-catch to handle any errors during this process
    let profilesWithDetails;
    try {
      profilesWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          try {
            // Get user role
            const { data: userRole, error: roleError } = await supabase
              .from("user_roles")
              .select("role, assigned_at, assigned_by")
              .eq("user_id", profile.id)
              .maybeSingle();

            // Log role errors but don't fail - user might not have a role yet
            if (roleError && roleError.code !== "PGRST116") { // PGRST116 is "not found" which is OK
              console.warn(`Error fetching role for user ${profile.id}:`, roleError);
            }

            // Get user permissions
            const { data: userPermissions, error: permError } = await supabase
              .from("user_permissions")
              .select("permission")
              .eq("user_id", profile.id);

            // Log permission errors but don't fail
            if (permError) {
              console.warn(`Error fetching permissions for user ${profile.id}:`, permError);
            }

            return {
              ...profile,
              user_roles: userRole ? [userRole] : [],
              user_permissions: userPermissions || [],
              email: "N/A", // Email placeholder
            };
          } catch (err: any) {
            console.error(`Error processing profile ${profile.id}:`, err);
            // Return profile with empty roles/permissions if there's an error
            return {
              ...profile,
              user_roles: [],
              user_permissions: [],
              email: "N/A",
            };
          }
        })
      );
    } catch (err: any) {
      console.error("Error fetching roles/permissions:", err);
      // If roles/permissions fail, still return profiles with empty arrays
      profilesWithDetails = profiles.map((profile) => ({
        ...profile,
        user_roles: [],
        user_permissions: [],
        email: "N/A",
      }));
    }

    if (!profiles || profiles.length === 0) {
      return { data: [], error: null };
    }

    // Filter: Only show admins, moderators, or users with explicit permissions
    // Regular users with only read access won't appear in the list
    let filteredProfiles = profilesWithDetails.filter((profile) => {
      const userRole = profile.role || profile.user_roles?.[0]?.role;
      const hasPermissions = (profile.user_permissions?.length || 0) > 0;
      
      // Show if admin, moderator, or has explicit permissions
      return userRole === "admin" || userRole === "moderator" || hasPermissions;
    });

    // Apply search filter if provided
    if (searchQuery && searchQuery.trim()) {
      const search = searchQuery.trim().toLowerCase();
      filteredProfiles = filteredProfiles.filter((profile) => {
        const displayName = (profile.display_name || "").toLowerCase();
        return displayName.includes(search);
      });
    }

    // Add email placeholder (will be fetched separately if needed)
    const usersWithEmails = filteredProfiles.map((profile) => ({
      ...profile,
      email: "N/A", // Email will be fetched client-side or via service role
    }));

    return { data: usersWithEmails, error: null };
  } catch (err: any) {
    console.error("Error in getUsersForAdmin:", err);
    return { error: err.message || "Failed to fetch users", data: null };
  }
}

/**
 * Search for any user by email or name (for updating access)
 * This allows admins to find users with read-only access
 */
export async function searchUser(searchQuery: string) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required", data: null };
  }

  if (!searchQuery || searchQuery.trim().length < 2) {
    return { error: "Search query must be at least 2 characters", data: null };
  }

  try {
    const supabase = await createClient();
    const search = searchQuery.trim().toLowerCase();

    // Get all profiles - when searching, we want to show ALL users (not just admins/moderators)
    // This allows finding users with read-only access to update their permissions
    // Don't select email column - it might not exist if migration hasn't been run
    // Limit to 100 profiles for performance when fetching emails
    const { data: allProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, role, account_type, created_at")
      .limit(100); // Limit for performance when fetching emails

    if (profilesError) {
      console.error("Error searching profiles:", profilesError);
      // Check if error is about missing email column
      if (profilesError.message?.includes("email") || profilesError.message?.includes("column") && profilesError.message?.includes("does not exist")) {
        // Retry without email column
        const { data: retryProfiles, error: retryError } = await supabase
          .from("profiles")
          .select("id, display_name, role, account_type, created_at")
          .limit(200);
        
        if (retryError) {
          return { error: retryError.message, data: null };
        }
        
        // Use retryProfiles instead
        const matchingProfiles = (retryProfiles || []).filter((profile: any) => {
          const displayName = (profile.display_name || "").toLowerCase();
          return displayName.includes(search);
        });

        // Fetch roles and permissions for matching profiles
        const profilesWithDetails = await Promise.all(
          matchingProfiles.map(async (profile) => {
            const { data: userRole } = await supabase
              .from("user_roles")
              .select("role, assigned_at, assigned_by")
              .eq("user_id", profile.id)
              .maybeSingle();

            const { data: userPermissions } = await supabase
              .from("user_permissions")
              .select("permission")
              .eq("user_id", profile.id);

            // Try to get email from auth.users using admin client
            let email = "N/A";
            try {
              const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
              email = authUser?.user?.email || "N/A";
            } catch (e) {
              // If admin client doesn't work, just use N/A
              console.warn(`Could not fetch email for user ${profile.id}:`, e);
            }

            return {
              ...profile,
              user_roles: userRole ? [userRole] : [],
              user_permissions: userPermissions || [],
              email: email,
            };
          })
        );

        return { data: profilesWithDetails, error: null };
      }
      return { error: profilesError.message, data: null };
    }

    if (!allProfiles || allProfiles.length === 0) {
      return { data: [], error: null };
    }

    // Fetch emails and filter by both display_name and email
    // We need to fetch emails first, then filter, because email is not in profiles table
    // Use admin client if available, otherwise fallback to anon client
    const adminSupabase = createAdminClient();

    const profilesWithEmails = await Promise.all(
      allProfiles.map(async (profile: any) => {
        let email = "N/A";
        
        // Try to get email from auth.users using admin client (if available)
        if (adminSupabase) {
          try {
            const { data: authUser, error: adminError } = await adminSupabase.auth.admin.getUserById(profile.id);
            if (!adminError && authUser?.user?.email) {
              email = authUser.user.email;
            }
          } catch (e) {
            console.warn(`Could not fetch email for user ${profile.id} using admin client:`, e);
          }
        } else {
          // Fallback: try to get from current user's session if it matches
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser?.id === profile.id) {
            email = currentUser.email || "N/A";
          }
        }

        return {
          ...profile,
          email: email,
        };
      })
    );

    // Now filter by both display_name and email
    const matchingProfiles = profilesWithEmails.filter((profile: any) => {
      const displayName = (profile.display_name || "").toLowerCase();
      const email = (profile.email || "").toLowerCase();
      // Search by both display name and email
      return displayName.includes(search) || email.includes(search);
    });

    if (matchingProfiles.length === 0) {
      return { data: [], error: null };
    }

    // Fetch roles and permissions for matching profiles (same pattern as getUsersForAdmin)
    const profilesWithDetails = await Promise.all(
      matchingProfiles.map(async (profile) => {
        // Get user role
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role, assigned_at, assigned_by")
          .eq("user_id", profile.id)
          .maybeSingle();

        // Get user permissions
        const { data: userPermissions } = await supabase
          .from("user_permissions")
          .select("permission")
          .eq("user_id", profile.id);

        return {
          ...profile,
          user_roles: userRole ? [userRole] : [],
          user_permissions: userPermissions || [],
        };
      })
    );

    return { data: profilesWithDetails, error: null };
  } catch (err: any) {
    console.error("Error in searchUser:", err);
    return { error: err.message || "Failed to search users", data: null };
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  role: "admin" | "moderator" | "user"
) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Check if trying to remove last admin
    if (role !== "admin") {
      const { data: adminCount } = await supabase
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin");

      if (adminCount === 1) {
        const { data: currentUserRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single();

        if (currentUserRole?.role === "admin") {
          return {
            error: "Cannot remove the last admin user. Please assign another admin first.",
          };
        }
      }
    }

    // Update or insert role
    const { error: upsertError } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role: role,
          assigned_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (upsertError) {
      console.error("Error updating user role:", upsertError);
      return { error: upsertError.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("Error in updateUserRole:", err);
    return { error: err.message || "Failed to update user role" };
  }
}

/**
 * Grant permission to user
 */
export async function grantPermission(
  userId: string,
  permission: string
) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    const { error: insertError } = await supabase
      .from("user_permissions")
      .insert({
        user_id: userId,
        permission: permission,
        granted_by: user.id,
      });

    if (insertError) {
      // If permission already exists, that's okay
      if (insertError.code !== "23505") {
        console.error("Error granting permission:", insertError);
        return { error: insertError.message };
      }
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("Error in grantPermission:", err);
    return { error: err.message || "Failed to grant permission" };
  }
}

/**
 * Revoke permission from user
 */
export async function revokePermission(
  userId: string,
  permission: string
) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required" };
  }

  try {
    const supabase = await createClient();
    const { error: deleteError } = await supabase
      .from("user_permissions")
      .delete()
      .eq("user_id", userId)
      .eq("permission", permission);

    if (deleteError) {
      console.error("Error revoking permission:", deleteError);
      return { error: deleteError.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("Error in revokePermission:", err);
    return { error: err.message || "Failed to revoke permission" };
  }
}

/**
 * Get user details with all roles and permissions
 */
export async function getUserDetails(userId: string) {
  const adminCheck = await checkIsAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized: Admin access required", data: null };
  }

  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        id,
        display_name,
        role,
        account_type,
        created_at,
        user_roles (
          role,
          assigned_at,
          assigned_by
        ),
        user_permissions (
          permission,
          granted_at
        )
      `)
      .eq("id", userId)
      .single();

    // Get email from auth.users
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const data = {
      ...profile,
      email: authUser?.user?.email || "N/A",
    };

    if (error) {
      console.error("Error fetching user details:", error);
      return { error: error.message, data: null };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("Error in getUserDetails:", err);
    return { error: err.message || "Failed to fetch user details", data: null };
  }
}
