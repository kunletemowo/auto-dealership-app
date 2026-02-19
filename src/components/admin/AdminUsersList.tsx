"use client";

import { useState, useTransition } from "react";
import { searchUser, updateUserRole, grantPermission, revokePermission } from "@/app/actions/admin";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import type { PermissionType } from "@/lib/utils/permissions";

interface User {
  id: string;
  display_name: string | null;
  email: string;
  role: "admin" | "moderator" | "user" | null;
  account_type: string;
  created_at: string;
  user_roles?: Array<{
    role: string;
    assigned_at: string;
  }>;
  user_permissions?: Array<{
    permission: string;
  }>;
}

interface AdminUsersListProps {
  initialUsers: User[];
}

const ALL_PERMISSIONS: PermissionType[] = [
  "users.read",
  "users.create",
  "users.update",
  "users.delete",
  "listings.read",
  "listings.create",
  "listings.update",
  "listings.delete",
  "listings.moderate",
  "profiles.read",
  "profiles.update",
  "profiles.delete",
  "admin.access",
];

export function AdminUsersList({ initialUsers }: AdminUsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setSelectedUser(null); // Clear any previously selected user
    startTransition(async () => {
      const result = await searchUser(searchQuery);
      if (result.data) {
        setUsers(result.data);
        // Auto-expand the first result if only one user found
        if (result.data.length === 1) {
          setSelectedUser(result.data[0]);
        }
      } else if (result.error) {
        alert(result.error);
      }
      setIsSearching(false);
    });
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
          )
        );
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      } else if (result.error) {
        alert(result.error);
      }
    });
  };

  const handlePermissionToggle = async (
    userId: string,
    permission: string,
    isGranted: boolean
  ) => {
    startTransition(async () => {
      const result = isGranted
        ? await revokePermission(userId, permission)
        : await grantPermission(userId, permission);

      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              const currentPermissions = u.user_permissions || [];
              if (isGranted) {
                return {
                  ...u,
                  user_permissions: currentPermissions.filter(
                    (p) => p.permission !== permission
                  ),
                };
              } else {
                return {
                  ...u,
                  user_permissions: [
                    ...currentPermissions,
                    { permission },
                  ],
                };
              }
            }
            return u;
          })
        );
        if (selectedUser?.id === userId) {
          const currentPermissions = selectedUser.user_permissions || [];
          if (isGranted) {
            setSelectedUser({
              ...selectedUser,
              user_permissions: currentPermissions.filter(
                (p) => p.permission !== permission
              ),
            });
          } else {
            setSelectedUser({
              ...selectedUser,
              user_permissions: [
                ...currentPermissions,
                { permission },
              ],
            });
          }
        }
      } else if (result.error) {
        alert(result.error);
      }
    });
  };

  // Get permissions for the currently selected user
  const getSelectedUserPermissions = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.user_permissions?.map((p) => p.permission) || [];
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || isPending || !searchQuery.trim() || searchQuery.trim().length < 2}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
        {searchQuery && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setUsers(initialUsers);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => {
          const userRole = user.role || user.user_roles?.[0]?.role || "user";
          const hasPermissions = (user.user_permissions?.length || 0) > 0;

          return (
            <div
              key={user.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {user.display_name || "No name"}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        userRole === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : userRole === "moderator"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {userRole.toUpperCase()}
                    </span>
                    {hasPermissions && (
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        ({user.user_permissions?.length} permissions)
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email !== "N/A" ? user.email : "Email not available"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // If clicking on a different user, select that one
                      // If clicking on the same user, toggle it
                      if (selectedUser?.id === user.id) {
                        setSelectedUser(null);
                      } else {
                        setSelectedUser(user);
                      }
                    }}
                  >
                    {selectedUser?.id === user.id ? "Hide" : "Manage"}
                  </Button>
                </div>
              </div>

              {/* Expanded Management Panel */}
              {selectedUser?.id === user.id && (
                <div className="mt-4 space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  {/* Role Management */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      User Role
                    </label>
                    <div className="flex gap-2">
                      {(["admin", "moderator", "user"] as const).map((role) => (
                        <Button
                          key={role}
                          variant={userRole === role ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleRoleChange(user.id, role)}
                          disabled={isPending}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Permissions Management */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {ALL_PERMISSIONS.map((permission) => {
                        const currentUserPermissions = getSelectedUserPermissions(user.id);
                        const isGranted = currentUserPermissions.includes(permission);
                        return (
                          <label
                            key={permission}
                            className="flex items-center gap-2 rounded border border-zinc-200 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          >
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() =>
                                handlePermissionToggle(user.id, permission, isGranted)
                              }
                              disabled={isPending}
                              className="rounded border-zinc-300"
                            />
                            <span className="text-xs text-zinc-700 dark:text-zinc-300">
                              {permission.replace(".", " ")}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            {searchQuery
              ? "No users found matching your search."
              : "No users with admin rights found."}
          </p>
        </div>
      )}
    </div>
  );
}
