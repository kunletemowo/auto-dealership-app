"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteCarImageById, reorderCarImages } from "@/app/actions/image-management";
import { Button } from "@/components/forms/Button";
import { useToast } from "@/components/ui/Toast";

interface ImageItem {
  id: string;
  image_url: string;
  position: number;
}

interface ImageManagerProps {
  listingId: string;
  images: ImageItem[];
  onImagesChange?: (images: ImageItem[]) => void;
}

export function ImageManager({ listingId, images: initialImages, onImagesChange }: ImageManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setImages(initialImages.sort((a, b) => a.position - b.position));
  }, [initialImages]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setReordering(true);
    setError("");

    try {
      // Get the new order of image IDs
      const imageIds = images.map((img) => img.id);
      const result = await reorderCarImages(listingId, imageIds);

      if (result?.error) {
        setError(result.error);
        showToast(`Failed to reorder images: ${result.error}`, "error");
        // Revert to original order
        setImages(initialImages.sort((a, b) => a.position - b.position));
      } else {
        // Update positions locally
        const updatedImages = images.map((img, index) => ({
          ...img,
          position: index,
        }));
        setImages(updatedImages);
        if (onImagesChange) {
          onImagesChange(updatedImages);
        }
        showToast("Image order updated successfully", "success");
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reorder images";
      setError(errorMessage);
      showToast(errorMessage, "error");
      // Revert to original order
      setImages(initialImages.sort((a, b) => a.position - b.position));
    } finally {
      setReordering(false);
      setDraggedIndex(null);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeletingId(imageId);
    setError("");

    try {
      const result = await deleteCarImageById(imageId);

      if (result?.error) {
        setError(result.error);
        showToast(`Failed to delete image: ${result.error}`, "error");
      } else {
        const updatedImages = images.filter((img) => img.id !== imageId);
        setImages(updatedImages);
        if (onImagesChange) {
          onImagesChange(updatedImages);
        }
        showToast("Image deleted successfully", "success");
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete image";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No images uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-video w-full overflow-hidden rounded-lg border-2 border-zinc-200 dark:border-zinc-800 ${
                draggedIndex === index
                  ? "opacity-50 border-zinc-400 dark:border-zinc-600"
                  : "cursor-move hover:border-zinc-400 dark:hover:border-zinc-600"
              } ${reordering ? "pointer-events-none" : ""}`}
            >
              <Image
                src={image.image_url}
                alt={`Image ${index + 1}`}
                width={200}
                height={150}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-zinc-900">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id || reordering}
                    className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    title="Delete image"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {draggedIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                  <span className="text-white font-semibold">Dragging...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Drag images to reorder them. The first image will be used as the main listing image.
      </p>
    </div>
  );
}
