"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { FileInput } from "@/components/forms/FileInput";
import { updateProfile } from "@/app/actions/profile";
import { uploadProfileAvatar, deleteProfileAvatar } from "@/app/actions/profile-images";
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils/phone";

interface ProfileFormProps {
  initialData: {
    display_name?: string | null;
    phone?: string | null;
    location?: string | null;
    account_type?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData.avatar_url || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize phone value with formatting
  useEffect(() => {
    if (initialData.phone) {
      setPhoneValue(formatPhoneNumber(initialData.phone));
    }
  }, [initialData.phone]);

  // Initialize avatar URL
  useEffect(() => {
    setAvatarUrl(initialData.avatar_url || null);
  }, [initialData.avatar_url]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Unformat phone number before submitting (store cleaned version)
      const phoneInput = formData.get("phone") as string;
      if (phoneInput) {
        formData.set("phone", unformatPhoneNumber(phoneInput));
      }
      
      const result = await updateProfile(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      router.refresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("Image must be less than 2MB");
      return;
    }

    setError("");
    setAvatarLoading(true);

    // Create preview
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    try {
      const result = await uploadProfileAvatar(file);

      if (result?.error) {
        setError(result.error);
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (result?.url) {
        setAvatarUrl(result.url);
        setAvatarPreview(null);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setError("");
    setAvatarLoading(true);

    try {
      const result = await deleteProfileAvatar();

      if (result?.error) {
        setError(result.error);
      } else {
        setAvatarUrl(null);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Profile updated successfully!
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Profile Picture
        </h2>
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            {(avatarUrl || avatarPreview) && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-300 dark:border-zinc-700">
                <Image
                  src={avatarPreview || avatarUrl || ""}
                  alt="Profile picture"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {!avatarUrl && !avatarPreview && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400">
                  {initialData.display_name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <FileInput
                ref={fileInputRef}
                label=""
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                disabled={loading || avatarLoading}
              />
              {avatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAvatar}
                  disabled={loading || avatarLoading}
                >
                  Remove Picture
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload a profile picture (JPEG, PNG, or WebP, max 2MB)
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Profile Information
        </h2>
        <div className="space-y-4">
          <Select
            name="account_type"
            label="Account Type"
            options={[
              { value: "individual", label: "Individual" },
              { value: "business", label: "Business" },
            ]}
            required
            disabled={loading}
            defaultValue={initialData.account_type || "individual"}
          />
          <Input
            name="display_name"
            label="Display Name"
            placeholder="Your display name"
            required
            disabled={loading}
            defaultValue={initialData.display_name || ""}
          />
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            disabled={true}
            defaultValue={initialData.email || ""}
          />
          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            disabled={loading}
            value={phoneValue}
            onChange={handlePhoneChange}
          />
          <Input
            name="location"
            label="Location"
            placeholder="e.g., Toronto, Ontario"
            disabled={loading}
            defaultValue={initialData.location || ""}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
