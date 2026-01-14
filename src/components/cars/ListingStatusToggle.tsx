"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateListingStatus } from "@/app/actions/listing-status";
import { Button } from "@/components/forms/Button";
import { useToast } from "@/components/ui/Toast";

interface ListingStatusToggleProps {
  listingId: string;
  currentStatus: "active" | "inactive" | "sold" | "unavailable";
  isActive: boolean;
}

export function ListingStatusToggle({
  listingId,
  currentStatus,
  isActive,
}: ListingStatusToggleProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (newStatus: "active" | "inactive" | "sold" | "unavailable") => {
    if (newStatus === status) return;

    setLoading(true);
    setError("");

    try {
      const result = await updateListingStatus(listingId, newStatus);

      if (result?.error) {
        setError(result.error);
        showToast(`Failed to update status: ${result.error}`, "error");
      } else {
        setStatus(newStatus);
        showToast(`Listing status updated to ${newStatus}`, "success");
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update status";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: Array<{
    value: "active" | "inactive" | "sold" | "unavailable";
    label: string;
    color: string;
  }> = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "inactive", label: "Inactive", color: "bg-gray-500" },
    { value: "sold", label: "Sold", color: "bg-blue-500" },
    { value: "unavailable", label: "Unavailable", color: "bg-red-500" },
  ];

  const currentStatusOption = statusOptions.find((opt) => opt.value === status);

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-red-50 p-2 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Status:
        </span>
        <div className="flex gap-1 rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
          {statusOptions.map((option) => {
            const isSelected = status === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={loading}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                  isSelected
                    ? `${option.color} text-white`
                    : "bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
                title={option.label}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      {status !== "active" && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {status === "sold"
            ? "This listing is marked as sold and will not appear in search results."
            : status === "unavailable"
            ? "This listing is marked as unavailable and will not appear in search results."
            : "This listing is inactive and will not appear in search results."}
        </p>
      )}
    </div>
  );
}
