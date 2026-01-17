"use client";

import { useState } from "react";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { signUp } from "@/app/actions/auth";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await signUp(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        setSuccess(true);
        setLoading(false);
      } else {
        // Handle case where result is undefined or unexpected
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      // Catch any unexpected errors from the server action
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <p className="font-semibold">Account created successfully!</p>
          <p className="mt-1">
            You are now signed up as a user of Kuldae Autos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="text"
          name="firstName"
          label="First Name"
          required
          disabled={loading}
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          required
          disabled={loading}
        />
      </div>
      <Input
        type="email"
        name="email"
        label="Email"
        required
        disabled={loading}
      />
      <Input
        type="password"
        name="password"
        label="Password"
        required
        disabled={loading}
        minLength={6}
      />
      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        required
        disabled={loading}
        minLength={6}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
