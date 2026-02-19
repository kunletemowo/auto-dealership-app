"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/forms/Button";
import { deleteCarListingAction } from "@/app/actions/cars";

interface DeleteListingButtonProps {
  listingId: string;
  listingTitle?: string;
}

export function DeleteListingButton({ listingId, listingTitle }: DeleteListingButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", listingId);
        await deleteCarListingAction(formData);
        // Close dialog and refresh on success
        setShowConfirm(false);
        router.refresh();
      } catch (error: any) {
        // Check if this is a Next.js redirect error
        // Redirect errors are expected and should not be shown as errors
        if (error?.digest?.startsWith('NEXT_REDIRECT') || 
            error?.message?.includes('NEXT_REDIRECT') ||
            error?.toString()?.includes('NEXT_REDIRECT')) {
          // Silently handle redirect - close dialog and refresh
          setShowConfirm(false);
          router.refresh();
          return;
        }
        // Handle actual errors (not redirects)
        const errorMessage = error?.message || error?.toString() || "An unexpected error occurred";
        if (errorMessage && !errorMessage.includes('NEXT_REDIRECT')) {
          alert(`Error deleting listing: ${errorMessage}`);
        } else {
          // Fallback: close dialog and refresh
          setShowConfirm(false);
          router.refresh();
        }
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
      >
        Delete
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Delete Listing
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete this listing?
              {listingTitle && (
                <span className="mt-1 block font-medium text-zinc-900 dark:text-zinc-50">
                  "{listingTitle}"
                </span>
              )}
              <span className="mt-2 block text-red-600 dark:text-red-400">
                This action cannot be undone.
              </span>
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
