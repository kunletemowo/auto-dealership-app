/**
 * Permission checking utilities
 * Use these functions to check user permissions throughout the application
 */

import { createClient } from "@/lib/supabase/server";

export type PermissionType =
  | "users.read"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "listings.read"
  | "listings.create"
  | "listings.update"
  | "listings.delete"
  | "listings.moderate"
  | "profiles.read"
  | "profiles.update"
  | "profiles.delete"
  | "admin.access";

export type UserRole = "admin" | "moderator" | "user";

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(
  permission: PermissionType
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase.rpc("user_has_permission", {
      check_user_id: user.id,
      required_permission: permission,
    });

    if (error) {
      console.error("Error checking permission:", error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error("Error in hasPermission:", error);
    return false;
  }
}

/**
 * Check if current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  return hasPermission("admin.access");
}

/**
 * Check if current user has moderator role or higher
 */
export async function isModeratorOrAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return false;

  return data.role === "admin" || data.role === "moderator";
}

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return "user"; // Default to user if no role found

    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<PermissionType[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase.rpc("get_user_permissions", {
      check_user_id: user.id,
    });

    if (error) {
      console.error("Error getting permissions:", error);
      return [];
    }

    return (data || []).map((p: { permission: PermissionType }) => p.permission);
  } catch (error) {
    console.error("Error in getUserPermissions:", error);
    return [];
  }
}

/**
 * Check if user can perform CRUD operations on a resource
 */
export async function canPerformCRUD(
  resource: "users" | "listings" | "profiles"
): Promise<{
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}> {
  const permissions = await getUserPermissions();
  const resourcePrefix = `${resource}.` as const;

  return {
    canRead: permissions.includes(`${resourcePrefix}read` as PermissionType),
    canCreate: permissions.includes(`${resourcePrefix}create` as PermissionType),
    canUpdate: permissions.includes(`${resourcePrefix}update` as PermissionType),
    canDelete: permissions.includes(`${resourcePrefix}delete` as PermissionType),
  };
}
