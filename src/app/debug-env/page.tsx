import { unstable_noStore } from "next/cache";

export default function DebugEnvPage() {
  unstable_noStore();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  const hasUrl = !!supabaseUrl;
  const hasKey = !!supabaseKey;
  const hasSiteUrl = !!siteUrl;
  
  // Show first few characters for verification (security: these are public keys)
  const urlPreview = supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "Not set";
  const keyPreview = supabaseKey ? `${supabaseKey.substring(0, 30)}...` : "Not set";
  const siteUrlPreview = siteUrl || "Not set";
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Environment Variables Debug</h1>
        
        <div className="space-y-6">
          {/* NEXT_PUBLIC_SUPABASE_URL */}
          <div className="rounded-lg border p-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-xl font-semibold">NEXT_PUBLIC_SUPABASE_URL</h2>
              {hasUrl ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  ✓ Set
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">
                  ✗ Missing
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600">
              Preview: <code className="rounded bg-zinc-100 px-2 py-1">{urlPreview}</code>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Full length: {supabaseUrl?.length || 0} characters
            </p>
          </div>
          
          {/* NEXT_PUBLIC_SUPABASE_ANON_KEY */}
          <div className="rounded-lg border p-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-xl font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
              {hasKey ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  ✓ Set
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">
                  ✗ Missing
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600">
              Preview: <code className="rounded bg-zinc-100 px-2 py-1">{keyPreview}</code>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Full length: {supabaseKey?.length || 0} characters
            </p>
          </div>
          
          {/* NEXT_PUBLIC_SITE_URL */}
          <div className="rounded-lg border p-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-xl font-semibold">NEXT_PUBLIC_SITE_URL</h2>
              {hasSiteUrl ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  ✓ Set
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  ⚠ Optional
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600">
              Value: <code className="rounded bg-zinc-100 px-2 py-1">{siteUrlPreview}</code>
            </p>
          </div>
          
          {/* Status Summary */}
          <div className={`rounded-lg border p-6 ${hasUrl && hasKey ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <h2 className="mb-4 text-xl font-semibold">Status Summary</h2>
            {hasUrl && hasKey ? (
              <div>
                <p className="mb-2 text-green-800">
                  ✓ All required environment variables are set!
                </p>
                <p className="text-sm text-green-700">
                  If you're still seeing authentication errors, check:
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-green-700">
                  <li>Did you redeploy after adding the variables?</li>
                  <li>Are the variables added to the correct environment (Production)?</li>
                  <li>Are there any typos or extra spaces in the variable names?</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="mb-2 font-semibold text-red-800">
                  ✗ Missing required environment variables:
                </p>
                <ul className="list-inside list-disc text-sm text-red-700">
                  {!hasUrl && <li>NEXT_PUBLIC_SUPABASE_URL</li>}
                  {!hasKey && <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>}
                </ul>
                <p className="mt-4 text-sm text-red-700">
                  To fix: Add these variables in Vercel Dashboard → Settings → Environment Variables → Production
                </p>
              </div>
            )}
          </div>
          
          {/* Helpful Links */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">Quick Fix Steps:</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
              <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
              <li>Verify both variables are listed and assigned to Production environment</li>
              <li>Check for any typos or extra spaces in variable names</li>
              <li>Redeploy your application (Deployments → Latest → Redeploy)</li>
              <li>Clear browser cache and try again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
