"use client";

import { useEffect } from "react";
import { isAuthTokenRefreshError } from "@/lib/supabase/error-handler";

/**
 * Global error handler component that suppresses Supabase network errors
 * These errors are expected when network is unavailable and don't need user attention
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (common with Supabase fetch errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Suppress "Failed to fetch" errors from Supabase token refresh
      if (isAuthTokenRefreshError(error)) {
        event.preventDefault(); // Prevent error from showing in console
        return;
      }
      
      // Check if it's a network error
      const errorMessage = error?.message?.toLowerCase() || "";
      if (
        errorMessage.includes("failed to fetch") &&
        (error?.stack?.toLowerCase().includes("_refreshaccesstoken") ||
          error?.stack?.toLowerCase().includes("_callrefreshtoken") ||
          error?.stack?.toLowerCase().includes("auth/v1/token"))
      ) {
        event.preventDefault(); // Prevent error from showing in console
        return;
      }
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Suppress "Failed to fetch" errors from Supabase token refresh
      if (isAuthTokenRefreshError(error)) {
        event.preventDefault(); // Prevent error from showing in console
        return;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
