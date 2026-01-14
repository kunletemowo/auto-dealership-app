"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { FileInput } from "@/components/forms/FileInput";
import { updateProfile } from "@/app/actions/profile";
import { deleteProfileAvatar } from "@/app/actions/profile-images";
import { createClient } from "@/lib/supabase/client";
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils/phone";

interface ProfileFormProps {
  initialData: {
    display_name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
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

  const [addressValue, setAddressValue] = useState(initialData.address || "")
  const [cityValue, setCityValue] = useState(initialData.city || "")
  const [provinceValue, setProvinceValue] = useState(initialData.province || "")
  const [postalCodeValue, setPostalCodeValue] = useState(initialData.postal_code || "")

  const [addressQuery, setAddressQuery] = useState(initialData.address || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
  const addressWrapperRef = useRef<HTMLDivElement>(null)

  // City autocomplete state
  const [cityQuery, setCityQuery] = useState(initialData.city || "")
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false)
  const [isCitySuggestionsLoading, setIsCitySuggestionsLoading] = useState(false)
  const cityWrapperRef = useRef<HTMLDivElement>(null)

  // Province autocomplete state
  const [provinceQuery, setProvinceQuery] = useState(initialData.province || "")
  const [provinceSuggestions, setProvinceSuggestions] = useState<ProvinceSuggestion[]>([])
  const [isProvinceSuggestionsOpen, setIsProvinceSuggestionsOpen] = useState(false)
  const [isProvinceSuggestionsLoading, setIsProvinceSuggestionsLoading] = useState(false)
  const provinceWrapperRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    setAddressValue(initialData.address || "")
    setCityValue(initialData.city || "")
    setProvinceValue(initialData.province || "")
    setPostalCodeValue(initialData.postal_code || "")
    setAddressQuery(initialData.address || "")
    setCityQuery(initialData.city || "")
    setProvinceQuery(initialData.province || "")
  }, [initialData.address, initialData.city, initialData.province, initialData.postal_code])

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node
      if (addressWrapperRef.current?.contains(target)) return
      if (cityWrapperRef.current?.contains(target)) return
      if (provinceWrapperRef.current?.contains(target)) return
      setIsSuggestionsOpen(false)
      setIsCitySuggestionsOpen(false)
      setIsProvinceSuggestionsOpen(false)
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  useEffect(() => {
    const trimmed = addressQuery.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      setIsSuggestionsOpen(false)
      return
    }

    const abortController = new AbortController()
    const timeout = setTimeout(async () => {
      setIsSuggestionsLoading(true)
      const result = await fetchAddressSuggestions({ query: trimmed, signal: abortController.signal })
      setIsSuggestionsLoading(false)

      if (result.error) {
        setSuggestions([])
        setIsSuggestionsOpen(false)
        return
      }

      setSuggestions(result.suggestions)
      setIsSuggestionsOpen(result.suggestions.length > 0)
    }, 250)

    return () => {
      abortController.abort()
      clearTimeout(timeout)
    }
  }, [addressQuery])

  // City autocomplete effect
  useEffect(() => {
    const trimmed = cityQuery.trim()
    if (trimmed.length < 2) {
      setCitySuggestions([])
      setIsCitySuggestionsOpen(false)
      return
    }

    const abortController = new AbortController()
    const timeout = setTimeout(async () => {
      setIsCitySuggestionsLoading(true)
      const result = await fetchCitySuggestions({ query: trimmed, signal: abortController.signal })
      setIsCitySuggestionsLoading(false)

      if (result.error) {
        setCitySuggestions([])
        setIsCitySuggestionsOpen(false)
        return
      }

      setCitySuggestions(result.suggestions)
      setIsCitySuggestionsOpen(result.suggestions.length > 0)
    }, 300)

    return () => {
      abortController.abort()
      clearTimeout(timeout)
    }
  }, [cityQuery])

  // Province autocomplete effect
  useEffect(() => {
    const trimmed = provinceQuery.trim()
    if (trimmed.length < 2) {
      setProvinceSuggestions([])
      setIsProvinceSuggestionsOpen(false)
      return
    }

    const abortController = new AbortController()
    const timeout = setTimeout(async () => {
      setIsProvinceSuggestionsLoading(true)
      const result = await fetchProvinceSuggestions({ query: trimmed, signal: abortController.signal })
      setIsProvinceSuggestionsLoading(false)

      if (result.error) {
        setProvinceSuggestions([])
        setIsProvinceSuggestionsOpen(false)
        return
      }

      setProvinceSuggestions(result.suggestions)
      setIsProvinceSuggestionsOpen(result.suggestions.length > 0)
    }, 300)

    return () => {
      abortController.abort()
      clearTimeout(timeout)
    }
  }, [provinceQuery])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Ensure controlled inputs are reflected in submitted data
      formData.set("address", addressValue)
      formData.set("city", cityValue)
      formData.set("province", provinceValue)
      formData.set("postal_code", postalCodeValue)
      
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressValue(e.target.value)
    setAddressQuery(e.target.value)
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCityValue(value)
    setCityQuery(value)
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProvinceValue(value)
    setProvinceQuery(value)
  }

  const handleSelectCitySuggestion = (suggestion: CitySuggestion) => {
    setCityValue(suggestion.city)
    setCityQuery(suggestion.city)
    // Auto-populate province if available
    if (suggestion.province) {
      setProvinceValue(suggestion.province)
      setProvinceQuery(suggestion.province)
    }
    setIsCitySuggestionsOpen(false)
  }

  const handleSelectProvinceSuggestion = (suggestion: ProvinceSuggestion) => {
    setProvinceValue(suggestion.province)
    setProvinceQuery(suggestion.province)
    setIsProvinceSuggestionsOpen(false)
  }

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const { address, city, province, postal_code } = parseSuggestionIntoLocation({ suggestion })

    setAddressValue(address)
    setAddressQuery(address)
    setCityValue(city)
    setProvinceValue(province)
    setPostalCodeValue(postal_code)
    setIsSuggestionsOpen(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (max 3MB)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      setError("Image must be less than 3MB");
      return;
    }

    setError("");
    setAvatarLoading(true);

    // Create preview
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError("Not authenticated. Please log in again.");
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setAvatarLoading(false);
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload directly to Supabase Storage from client
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // Provide more specific error messages
        if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("does not exist")) {
          setError("Storage bucket not configured. Please set up the 'profile-avatars' bucket in Supabase Storage.");
        } else if (uploadError.message.includes("new row violates row-level security")) {
          setError("Permission denied. Please check your storage policies.");
        } else {
          setError(uploadError.message || "Failed to upload image to storage");
        }
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setAvatarLoading(false);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-avatars").getPublicUrl(uploadData.path);

      // Update profile with avatar URL via server action
      const formData = new FormData();
      formData.set("avatar_url", publicUrl);
      
      // We need to update the profile, but updateProfile expects all fields
      // So we'll use a direct Supabase call from client instead
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        // If update fails, try to delete the uploaded file
        await supabase.storage.from("profile-avatars").remove([uploadData.path]);
        setError(updateError.message || "Failed to update profile with avatar URL");
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setAvatarLoading(false);
        return;
      }

      // Success - update local state and refresh
      setAvatarUrl(publicUrl);
      setAvatarPreview(null);
      router.refresh();
    } catch (err: any) {
      // Log the full error for debugging
      console.error("Avatar upload error:", err);
      setError(err.message || "Failed to upload avatar. Please check your connection and try again.");
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
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-zinc-300 dark:border-zinc-700">
                <Image
                  src={avatarPreview || avatarUrl || ""}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {!avatarUrl && !avatarPreview && (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-3xl font-semibold text-zinc-500 dark:text-zinc-400">
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
            Upload a profile picture (JPEG, PNG, or WebP, max 3MB)
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
          <div ref={addressWrapperRef} className="relative">
            <Input
              name="address"
              label="Address"
              placeholder="Start typing your address..."
              disabled={loading}
              value={addressValue}
              onChange={handleAddressChange}
              autoComplete="off"
            />
            {isSuggestionsOpen && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                {isSuggestionsLoading ? (
                  <div className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">Searching...</div>
                ) : (
                  <ul className="max-h-64 overflow-auto py-1">
                    {suggestions.map((s) => (
                      <li key={s.place_id}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                          onClick={() => handleSelectSuggestion(s)}
                        >
                          {s.display_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div ref={cityWrapperRef} className="relative">
              <Input
                name="city"
                label="City"
                placeholder="e.g., Toronto"
                required
                disabled={loading}
                value={cityValue}
                onChange={handleCityChange}
                autoComplete="off"
              />
              {isCitySuggestionsOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  {isCitySuggestionsLoading ? (
                    <div className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">Searching...</div>
                  ) : (
                    <ul className="max-h-64 overflow-auto py-1">
                      {citySuggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                            onClick={() => handleSelectCitySuggestion(s)}
                          >
                            {s.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div ref={provinceWrapperRef} className="relative">
              <Input
                name="province"
                label="Province / State"
                placeholder="e.g., Ontario"
                disabled={loading}
                value={provinceValue}
                onChange={handleProvinceChange}
                autoComplete="off"
              />
              {isProvinceSuggestionsOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  {isProvinceSuggestionsLoading ? (
                    <div className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">Searching...</div>
                  ) : (
                    <ul className="max-h-64 overflow-auto py-1">
                      {provinceSuggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                            onClick={() => handleSelectProvinceSuggestion(s)}
                          >
                            {s.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          <Input
            name="postal_code"
            label="Postal Code"
            placeholder="e.g., M5H 2N2"
            disabled={loading}
            value={postalCodeValue}
            onChange={(e) => setPostalCodeValue(e.target.value)}
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

interface Suggestion {
  place_id: string
  display_name: string
  address?: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    hamlet?: string
    municipality?: string
    state?: string
    region?: string
    province?: string
    postcode?: string
  }
}

async function fetchAddressSuggestions({ query, signal }: { query: string; signal: AbortSignal }) {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("addressdetails", "1")
    url.searchParams.set("limit", "6")
    url.searchParams.set("countrycodes", "ca")
    url.searchParams.set("q", `${query}, Canada`)

    const res = await fetch(url.toString(), {
      signal,
      headers: {
        // Nominatim requires a UA/Referer for production use; this is best-effort for dev.
        "Accept": "application/json",
      },
    })

    if (!res.ok) return { suggestions: [], error: `Search failed (${res.status})` }

    const data = (await res.json()) as Suggestion[]
    return { suggestions: data, error: null as string | null }
  } catch (e: any) {
    if (e?.name === "AbortError") return { suggestions: [], error: "aborted" }
    return { suggestions: [], error: "failed" }
  }
}

function parseSuggestionIntoLocation({ suggestion }: { suggestion: Suggestion }) {
  const address = suggestion.address
  const streetLine = [address?.house_number, address?.road].filter(Boolean).join(" ").trim()

  const city =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.hamlet ||
    address?.municipality ||
    ""

  const province = address?.state || address?.province || address?.region || ""
  
  const postal_code = address?.postcode || ""

  return {
    address: streetLine || suggestion.display_name,
    city,
    province,
    postal_code,
  }
}

interface CitySuggestion {
  place_id: string
  display_name: string
  city: string
  province?: string
}

interface ProvinceSuggestion {
  place_id: string
  display_name: string
  province: string
}

async function fetchCitySuggestions({ query, signal }: { query: string; signal: AbortSignal }) {
  try {
    // Search for cities/towns in Canada
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("addressdetails", "1")
    url.searchParams.set("limit", "8")
    url.searchParams.set("countrycodes", "ca")
    url.searchParams.set("q", `${query}, Canada`)
    url.searchParams.set("featuretype", "city,town,village")

    const res = await fetch(url.toString(), {
      signal,
      headers: {
        "Accept": "application/json",
      },
    })

    if (!res.ok) return { suggestions: [], error: `Search failed (${res.status})` }

    const data = (await res.json()) as Suggestion[]
    const suggestions = data
      .map((item) => {
        const address = item.address
        const city =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          ""
        const province = address?.state || address?.province || address?.region || ""
        
        if (!city) return null

        return {
          place_id: item.place_id,
          display_name: province ? `${city}, ${province}` : city,
          city,
          province: province || undefined,
        } as CitySuggestion
      })
      .filter((s): s is CitySuggestion => s !== null)
      .slice(0, 8) as CitySuggestion[]

    // Remove duplicates based on city name
    const unique = Array.from(
      new Map(suggestions.map((s) => [s.city.toLowerCase(), s])).values()
    )

    return { suggestions: unique, error: null as string | null }
  } catch (e: any) {
    if (e?.name === "AbortError") return { suggestions: [], error: "aborted" }
    return { suggestions: [], error: "failed" }
  }
}

async function fetchProvinceSuggestions({ query, signal }: { query: string; signal: AbortSignal }) {
  try {
    // Search for provinces/states in Canada
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("addressdetails", "1")
    url.searchParams.set("limit", "15")
    url.searchParams.set("countrycodes", "ca")
    url.searchParams.set("q", `${query}, Canada`)
    url.searchParams.set("featuretype", "state")

    const res = await fetch(url.toString(), {
      signal,
      headers: {
        "Accept": "application/json",
      },
    })

    if (!res.ok) return { suggestions: [], error: `Search failed (${res.status})` }

    const data = (await res.json()) as Suggestion[]
    
    // Canadian provinces list for fallback
    const canadianProvinces = [
      "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba",
      "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador",
      "Prince Edward Island", "Northwest Territories", "Nunavut", "Yukon"
    ]

    const suggestions: ProvinceSuggestion[] = []
    const seen = new Set<string>()

    // Add results from Nominatim
    for (const item of data) {
      const address = item.address
      const province = address?.state || address?.province || address?.region || ""
      if (province && !seen.has(province.toLowerCase())) {
        seen.add(province.toLowerCase())
        suggestions.push({
          place_id: item.place_id,
          display_name: province,
          province,
        })
      }
    }

    // Add matching provinces from our list if not already included
    const queryLower = query.toLowerCase()
    for (const prov of canadianProvinces) {
      if (prov.toLowerCase().includes(queryLower) && !seen.has(prov.toLowerCase())) {
        suggestions.push({
          place_id: `province-${prov}`,
          display_name: prov,
          province: prov,
        })
      }
    }

    return { suggestions: suggestions.slice(0, 15), error: null as string | null }
  } catch (e: any) {
    if (e?.name === "AbortError") return { suggestions: [], error: "aborted" }
    return { suggestions: [], error: "failed" }
  }
}
