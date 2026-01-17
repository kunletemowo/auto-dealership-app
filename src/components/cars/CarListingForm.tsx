"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { FileInput } from "@/components/forms/FileInput";
import { createCarListing, updateCarListing } from "@/app/actions/cars";
import { uploadCarImages } from "@/app/actions/images";
import { ImageManager } from "./ImageManager";
import { useToast } from "@/components/ui/Toast";
import { CAR_MAKES, getModelsForMake } from "@/lib/data/car-makes-models";

interface CarListingFormProps {
  listing?: any;
  mode?: "create" | "edit";
}

export function CarListingForm({ listing, mode = "create" }: CarListingFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id: string; image_url: string; position: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Make autocomplete state
  const [makeQuery, setMakeQuery] = useState(listing?.make || "");
  const [selectedMake, setSelectedMake] = useState(listing?.make || "");
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const makeInputRef = useRef<HTMLDivElement>(null);

  // Model dropdown state
  const [selectedModel, setSelectedModel] = useState(listing?.model || "");

  // Load existing images when editing
  useEffect(() => {
    if (mode === "edit" && listing?.car_images) {
      const images = listing.car_images
        .sort((a: any, b: any) => a.position - b.position)
        .map((img: any) => ({
          id: img.id,
          image_url: img.image_url,
          position: img.position,
        }));
      setExistingImages(images);
    }
  }, [listing, mode]);

  // Filter makes based on search query
  const filteredMakes = useMemo(() => {
    if (!makeQuery.trim()) {
      return CAR_MAKES.slice(0, 10).map((make) => ({
        value: make.value,
        label: make.label,
      }));
    }
    const query = makeQuery.toLowerCase();
    return CAR_MAKES.filter((make) =>
      make.label.toLowerCase().includes(query)
    ).map((make) => ({
      value: make.value,
      label: make.label,
    })).slice(0, 10);
  }, [makeQuery]);

  // Get model options based on selected make
  const modelOptions = useMemo(() => {
    if (!selectedMake) {
      return [{ value: "", label: "Select make first" }];
    }
    return getModelsForMake(selectedMake);
  }, [selectedMake]);

  // Reset model when make changes
  useEffect(() => {
    if (selectedMake !== (listing?.make || "")) {
      setSelectedModel("");
    }
  }, [selectedMake]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        makeInputRef.current &&
        !makeInputRef.current.contains(event.target as Node)
      ) {
        setShowMakeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup object URLs when component unmounts or images are removed
  useEffect(() => {
    return () => {
      // Revoke all object URLs to free memory
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length === 0) {
      return;
    }

    // Check total count (existing + new files)
    const totalCount = selectedImages.length + newFiles.length;
    if (totalCount > 10) {
      setError(`You can upload a maximum of 10 images. You currently have ${selectedImages.length} selected, and tried to add ${newFiles.length} more.`);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = newFiles.filter((file) => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Please upload only JPEG, PNG, or WebP images");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError("Each image must be less than 5MB");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setError("");
    
    // Append new files to existing selected images
    const updatedImages = [...selectedImages, ...newFiles];
    setSelectedImages(updatedImages);

    // Create previews for new files and append to existing previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
    // Reset file input to allow selecting more files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Initialize make and model from listing
  useEffect(() => {
    if (listing?.make) {
      const make = CAR_MAKES.find(
        (m) => m.value.toLowerCase() === listing.make.toLowerCase() ||
               m.label.toLowerCase() === listing.make.toLowerCase()
      );
      if (make) {
        setMakeQuery(make.label);
        setSelectedMake(make.value);
      } else {
        setMakeQuery(listing.make);
        setSelectedMake(listing.make);
      }
    }
    if (listing?.model) {
      setSelectedModel(listing.model.toLowerCase());
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let result;

      if (mode === "edit" && listing?.id) {
        // Update existing listing
        result = await updateCarListing(listing.id, formData);
      } else {
        // Create new listing
        result = await createCarListing(formData);
      }

      if (result?.error) {
        setError(result.error);
        showToast(`Failed to ${mode === "edit" ? "update" : "create"} listing: ${result.error}`, "error");
        setLoading(false);
        return;
      }

      const listingId = result?.listingId || listing?.id;

      // If images were selected, upload them
      if (selectedImages.length > 0 && listingId) {
        const uploadResult = await uploadCarImages(listingId, selectedImages);
        
        if (uploadResult.error) {
          showToast(`${mode === "edit" ? "Listing updated" : "Listing created"} but image upload failed: ${uploadResult.error}`, "warning");
          setError(`${mode === "edit" ? "Listing updated" : "Listing created"} but image upload failed: ${uploadResult.error}`);
          setLoading(false);
          // Still redirect to the listing page even if images failed
          router.push(`/cars/${listingId}`);
          return;
        }
      }

      showToast(`Listing ${mode === "edit" ? "updated" : "created"} successfully!`, "success");
      // Redirect to the listing page
      router.push(`/cars/${listingId}`);
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
      setLoading(false);
    }
  };

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const fuelTypeOptions = [
    { value: "gasoline", label: "Gasoline" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
    { value: "other", label: "Other" },
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
  ];

  const currencyOptions = [
    { value: "CAD", label: "CAD ($)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Basic Information
        </h2>
        <div className="space-y-4">
          <Input
            name="title"
            label="Title"
            placeholder="e.g., 2019 Honda Civic - Great Condition"
            required
            disabled={loading}
            defaultValue={listing?.title}
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Describe your car in detail..."
            rows={6}
            required
            disabled={loading}
            defaultValue={listing?.description}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Images
        </h2>
        <div className="space-y-4">
          {mode === "edit" && listing?.id && existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Manage Existing Images
              </label>
              <ImageManager
                listingId={listing.id}
                images={existingImages}
                onImagesChange={(updatedImages) => {
                  setExistingImages(updatedImages);
                }}
              />
            </div>
          )}
          <FileInput
            ref={fileInputRef}
            name="images"
            label={mode === "edit" ? "Add More Images" : "Upload Images"}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={loading}
          />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {mode === "edit" 
              ? "Add up to 10 more images. Supported formats: JPEG, PNG, WebP (max 5MB each)"
              : "You can upload up to 10 images. Supported formats: JPEG, PNG, WebP (max 5MB each)"}
          </p>

          {imagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                New Image Previews
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      disabled={loading}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Car Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative w-full" ref={makeInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Make <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="make" value={selectedMake} />
            <Input
              type="text"
              placeholder="e.g., Honda"
              required
              disabled={loading}
              value={makeQuery}
              onChange={(e) => {
                const value = e.target.value;
                setMakeQuery(value);
                setShowMakeDropdown(value.trim().length > 0);
                
                // Try to find exact match
                const exactMatch = CAR_MAKES.find(
                  (make) => make.label.toLowerCase() === value.toLowerCase()
                );
                if (exactMatch) {
                  setSelectedMake(exactMatch.value);
                } else {
                  setSelectedMake(value);
                }
              }}
              onFocus={() => {
                if (makeQuery.trim().length > 0) {
                  setShowMakeDropdown(true);
                }
              }}
            />
            {showMakeDropdown && filteredMakes.length > 0 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {filteredMakes.map((make) => (
                  <button
                    key={make.value}
                    type="button"
                    onClick={() => {
                      setMakeQuery(make.label);
                      setSelectedMake(make.value);
                      setShowMakeDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
                  >
                    {make.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <Select
              name="model"
              label="Model"
              options={modelOptions}
              required
              disabled={loading || !selectedMake}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              key={`model-${selectedMake}-${selectedModel}`}
            />
          </div>
          <Select
            name="year"
            label="Year"
            options={yearOptions}
            required
            disabled={loading}
            defaultValue={listing?.year?.toString()}
          />
          <Input
            name="mileage"
            label="Mileage (km)"
            type="number"
            min="0"
            placeholder="0"
            required
            disabled={loading}
            defaultValue={listing?.mileage}
          />
          <Select
            name="transmission"
            label="Transmission"
            options={transmissionOptions}
            required
            disabled={loading}
            defaultValue={listing?.transmission}
          />
          <Select
            name="fuelType"
            label="Fuel Type"
            options={fuelTypeOptions}
            required
            disabled={loading}
            defaultValue={listing?.fuel_type}
          />
          <Select
            name="condition"
            label="Condition"
            options={conditionOptions}
            required
            disabled={loading}
            defaultValue={listing?.condition}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Pricing & Location
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="price"
            label="Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
            disabled={loading}
            defaultValue={listing?.price}
          />
          <Select
            name="currency"
            label="Currency"
            options={currencyOptions}
            required
            disabled={loading}
            defaultValue={listing?.currency || "CAD"}
          />
          <Input
            name="locationCity"
            label="City"
            placeholder="e.g., Toronto"
            required
            disabled={loading}
            defaultValue={listing?.location_city}
          />
          <Input
            name="locationRegion"
            label="Province/State"
            placeholder="e.g., Ontario"
            required
            disabled={loading}
            defaultValue={listing?.location_region}
          />
          <Input
            name="locationCountry"
            label="Country"
            placeholder="e.g., Canada"
            required
            disabled={loading}
            defaultValue={listing?.location_country}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading 
            ? (mode === "edit" ? "Updating Listing..." : "Creating Listing...")
            : (mode === "edit" ? "Update Listing" : "Create Listing")}
        </Button>
      </div>
    </form>
  );
}
