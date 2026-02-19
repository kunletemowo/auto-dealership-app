/**
 * Error handler utilities for Supabase network errors
 * These errors are common when network is unavailable or Supabase is unreachable
 */

export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error?.message?.toLowerCase() || "";
  const errorName = error?.name?.toLowerCase() || "";
  const errorString = error?.toString()?.toLowerCase() || "";

  return (
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("network error") ||
    errorMessage.includes("networkerror") ||
    errorName === "typeerror" ||
    errorString.includes("failed to fetch") ||
    errorString.includes("networkerror")
  );
}

export function isAuthTokenRefreshError(error: any): boolean {
  if (!isNetworkError(error)) return false;
  
  const stack = error?.stack?.toLowerCase() || "";
  return (
    stack.includes("_refreshaccesstoken") ||
    stack.includes("_callrefreshtoken") ||
    stack.includes("__loadsession") ||
    stack.includes("_usesession") ||
    stack.includes("auth/v1/token")
  );
}

/**
 * Suppresses console errors for network-related Supabase auth token refresh failures
 * These are expected when network is unavailable and don't need user attention
 */
export function handleSupabaseError(error: any, context?: string): void {
  if (isAuthTokenRefreshError(error)) {
    // Silently handle auth token refresh network errors
    // These are expected when offline or Supabase is unreachable
    return;
  }

  if (isNetworkError(error)) {
    // Log network errors but don't show them as critical
    if (context) {
      console.warn(`Network error in ${context}:`, error.message);
    }
    return;
  }

  // Log all other errors normally
  if (context) {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error(error);
  }
}
