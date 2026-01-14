import { createClient } from "@/lib/supabase/server";

export async function SupabaseConnectionTest() {
  // Check if environment variables are set
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasUrl || !hasKey) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-400">
              Environment Variables Missing
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Please check your .env.local file. Missing:{" "}
              {!hasUrl && "NEXT_PUBLIC_SUPABASE_URL"}{" "}
              {!hasUrl && !hasKey && "and "}{!hasKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const supabase = await createClient();
    
    // Try a simple query to test connection (select from profiles table)
    const { error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);
    
    if (error) {
      // If it's a table doesn't exist error, connection is working but tables might not be set up
      if (error.code === "42P01") {
        return (
          <div className="mx-auto max-w-4xl rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                  Supabase Connected - Tables Not Found
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Connection works, but the database tables haven't been created yet. Run the SQL setup scripts.
                </p>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <span className="text-red-600 dark:text-red-400">❌</span>
            <div>
              <p className="font-semibold text-red-800 dark:text-red-400">
                Supabase Connection Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error.message} (Code: {error.code})
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mx-auto max-w-4xl rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400">✅</span>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-400">
              Supabase Connected Successfully!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Database connection is working. You can now use all Supabase features.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <span className="text-red-600 dark:text-red-400">❌</span>
          <div>
            <p className="font-semibold text-red-800 dark:text-red-400">
              Connection Test Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error?.message || "Unable to connect to Supabase. Please check your .env.local file and ensure the server is running."}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
