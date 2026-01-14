"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveFavorite, unsaveFavorite, isFavorite } from "@/app/actions/favorites";
import { useToast } from "@/components/ui/Toast";

interface SaveButtonProps {
  listingId: string;
  variant?: "icon" | "text";
  size?: "sm" | "md";
}

export function SaveButton({ listingId, variant = "icon", size = "md" }: SaveButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if listing is favorited
    async function checkFavorite() {
      try {
        const favorited = await isFavorite(listingId);
        setIsSaved(favorited);
      } catch (error) {
        // User not authenticated or error checking - default to not saved
        setIsSaved(false);
      }
    }
    checkFavorite();
  }, [listingId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      if (isSaved) {
        const result = await unsaveFavorite(listingId);
        if (result?.error) {
          if (result.error.includes("logged in") || result.error.includes("authenticated")) {
            showToast("Please log in to save listings", "info");
            router.push(`/login?redirect=/cars/${listingId}`);
            return;
          }
          if (result.error.includes("table") || result.error.includes("schema cache")) {
            showToast("Database setup required. Please contact support.", "error");
          } else {
            showToast("Failed to remove from saved listings", "error");
          }
          console.error("Error unsaving:", result.error);
        } else {
          setIsSaved(false);
          showToast("Removed from saved listings", "success");
        }
      } else {
        const result = await saveFavorite(listingId);
        if (result?.error) {
          if (result.error.includes("logged in") || result.error.includes("authenticated")) {
            showToast("Please log in to save listings", "info");
            router.push(`/login?redirect=/cars/${listingId}`);
            return;
          }
          if (result.error.includes("table") || result.error.includes("schema cache")) {
            showToast("Database setup required. Please contact support.", "error");
          } else {
            showToast("Failed to save listing", "error");
          }
          console.error("Error saving:", result.error);
        } else {
          setIsSaved(true);
          showToast("Listing saved successfully", "success");
        }
      }
      router.refresh();
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "text") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          backgroundColor: isSaved ? "rgb(239 68 68)" : "rgb(39 39 42)",
          color: "white",
        }}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Saving...</span>
          </>
        ) : isSaved ? (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>Saved</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Save</span>
          </>
        )}
      </button>
    );
  }

  // Icon variant
  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses} flex items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
        isSaved
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/90 text-zinc-700 hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:bg-zinc-800"
      } shadow-md hover:shadow-lg`}
      title={isSaved ? "Remove from saved" : "Save listing"}
    >
      {loading ? (
        <svg className={`${iconSize} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : isSaved ? (
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
}
