"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { createSpecRequest } from "@/app/actions/spec-requests";
import { useToast } from "@/components/ui/Toast";
import { CAR_MAKES, getModelsForMake, isKnownMake } from "@/lib/data/car-makes-models";

export function SpecRequestForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Make autocomplete state
  const [makeQuery, setMakeQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const makeInputRef = useRef<HTMLDivElement>(null);

  // Model state - supports both dropdown selection and custom text
  const [selectedModel, setSelectedModel] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelInputRef = useRef<HTMLDivElement>(null);

  // Filter makes based on search query - show up to 30 results
  const filteredMakes = useMemo(() => {
    if (!makeQuery.trim()) {
      return CAR_MAKES.map((make) => ({
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
    }));
  }, [makeQuery]);

  // Get model options based on selected make
  const modelOptions = useMemo(() => {
    if (!selectedMake) {
      return [];
    }
    return getModelsForMake(selectedMake);
  }, [selectedMake]);

  // Filtered models for dropdown (when we have known models)
  const filteredModels = useMemo(() => {
    if (modelOptions.length <= 1) return modelOptions;
    if (!modelQuery.trim()) return modelOptions;
    const query = modelQuery.toLowerCase();
    return modelOptions.filter(
      (m) => m.value === "" || m.label.toLowerCase().includes(query)
    );
  }, [modelOptions, modelQuery]);

  // Reset model when make changes
  useEffect(() => {
    setSelectedModel("");
    setModelQuery("");
  }, [selectedMake]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (makeInputRef.current && !makeInputRef.current.contains(target)) {
        setShowMakeDropdown(false);
        // On blur from make field: if user typed something not in list, accept it as custom make
        if (makeQuery.trim() && !CAR_MAKES.some((m) => m.label.toLowerCase() === makeQuery.trim().toLowerCase())) {
          setSelectedMake(makeQuery.trim());
        }
      }
      if (modelInputRef.current && !modelInputRef.current.contains(target)) {
        setShowModelDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [makeQuery]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add make - use selectedMake or makeQuery for custom
      const makeValue = selectedMake || makeQuery.trim();
      if (makeValue) {
        const knownMake = CAR_MAKES.find(
          (m) => m.value === makeValue.toLowerCase() || m.label.toLowerCase() === makeValue.toLowerCase()
        );
        formData.set("make", knownMake ? knownMake.label : makeValue);
      }
      
      // Add model - use label for known models, or modelQuery for custom
      let modelValue = modelQuery.trim();
      if (selectedModel && isKnownMake(selectedMake)) {
        const opt = modelOptions.find((m) => m.value === selectedModel);
        modelValue = opt?.label || selectedModel || modelValue;
      }
      if (modelValue) {
        formData.set("model", modelValue);
      }

      const result = await createSpecRequest(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        showToast("Spec request submitted successfully!", "success");
        
        // Reset form
        e.currentTarget.reset();
        setMakeQuery("");
        setSelectedMake("");
        setSelectedModel("");
        setModelQuery("");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit spec request");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
          Request Submitted Successfully!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for your request. We'll review your specifications and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="first_name"
            label="First Name"
            required
            placeholder="John"
          />
          <Input
            name="last_name"
            label="Last Name"
            required
            placeholder="Doe"
          />
          <Input
            name="email"
            type="email"
            label="Email"
            required
            placeholder="john.doe@example.com"
          />
          <Input
            name="phone"
            type="tel"
            label="Phone (Optional)"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Car Specifications */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Car Specifications
        </h2>
        <div className="space-y-4">
          {/* Make with autocomplete */}
          <div className="relative w-full" ref={makeInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Make (Optional)
            </label>
            <input type="hidden" name="make" value={selectedMake} />
            <Input
              type="text"
              value={makeQuery}
              onChange={(e) => {
                setMakeQuery(e.target.value);
                setShowMakeDropdown(true);
                const exactMatch = CAR_MAKES.find(
                  (make) =>
                    make.label.toLowerCase() === e.target.value.toLowerCase()
                );
                if (exactMatch) {
                  setSelectedMake(exactMatch.value);
                } else {
                  setSelectedMake("");
                }
              }}
              onFocus={() => setShowMakeDropdown(true)}
              placeholder="Search for make..."
            />
            {showMakeDropdown && filteredMakes.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {filteredMakes.slice(0, 50).map((make) => (
                  <button
                    key={make.value}
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      setSelectedMake(make.value);
                      setMakeQuery(make.label);
                      setShowMakeDropdown(false);
                    }}
                  >
                    {make.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model - dropdown when known make, or free text for custom */}
          <div className="relative w-full" ref={modelInputRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Model (Optional)
            </label>
            <input type="hidden" name="model" value={selectedModel || modelQuery} />
            {isKnownMake(selectedMake) && modelOptions.length > 1 ? (
              <>
                <Input
                  type="text"
                  value={modelQuery || selectedModel}
                  onChange={(e) => {
                    setModelQuery(e.target.value);
                    setShowModelDropdown(true);
                    const match = modelOptions.find(
                      (m) => m.value && m.label.toLowerCase() === e.target.value.toLowerCase()
                    );
                    if (match) setSelectedModel(match.value);
                    else setSelectedModel("");
                  }}
                  onFocus={() => setShowModelDropdown(true)}
                  placeholder="Search or type model..."
                />
                {showModelDropdown && filteredModels.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                    {filteredModels.slice(0, 50).map((opt) => (
                      opt.value ? (
                        <button
                          key={opt.value}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          onClick={() => {
                            setSelectedModel(opt.value);
                            setModelQuery(opt.label);
                            setShowModelDropdown(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      ) : null
                    ))}
                    <div className="border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      Or type your own model above
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Input
                name="model"
                type="text"
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder="Enter model (e.g. Camry, Civic)..."
              />
            )}
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="year_min"
              type="number"
              label="Minimum Year (Optional)"
              placeholder="2020"
              min="1900"
              max="2100"
            />
            <Input
              name="year_max"
              type="number"
              label="Maximum Year (Optional)"
              placeholder="2024"
              min="1900"
              max="2100"
            />
          </div>

          {/* Mileage */}
          <Input
            name="mileage_max"
            type="number"
            label="Maximum Mileage (Optional)"
            placeholder="50000"
            min="0"
          />

          {/* Price Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="price_min"
              type="number"
              label="Minimum Price (CAD) (Optional)"
              placeholder="10000"
              min="0"
              step="0.01"
            />
            <Input
              name="price_max"
              type="number"
              label="Maximum Price (CAD) (Optional)"
              placeholder="50000"
              min="0"
              step="0.01"
            />
          </div>

          {/* Transmission */}
          <Select
            name="transmission"
            label="Transmission (Optional)"
            options={[
              { value: "", label: "Any" },
              { value: "automatic", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ]}
          />

          {/* Fuel Type */}
          <Select
            name="fuel_type"
            label="Fuel Type (Optional)"
            options={[
              { value: "", label: "Any" },
              { value: "gasoline", label: "Gasoline" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Electric" },
              { value: "hybrid", label: "Hybrid" },
              { value: "other", label: "Other" },
            ]}
          />

          {/* Condition */}
          <Select
            name="condition_type"
            label="Condition (Optional)"
            options={[
              { value: "", label: "Any" },
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
            ]}
          />

          {/* Color */}
          <Input
            name="color"
            label="Preferred Color (Optional)"
            placeholder="Black, White, Red, etc."
          />
        </div>
      </div>

      {/* Additional Requirements */}
      <div>
        <Textarea
          name="additional_requirements"
          label="Additional Requirements (Optional)"
          placeholder="Any other specific requirements or preferences..."
          rows={4}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
