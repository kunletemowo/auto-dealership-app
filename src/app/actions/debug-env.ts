"use server";

import { unstable_noStore } from "next/cache";

export async function checkEnvironmentVariables() {
  unstable_noStore();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    hasSiteUrl: !!siteUrl,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : null,
    keyPreview: supabaseKey ? `${supabaseKey.substring(0, 30)}...` : null,
    siteUrl: siteUrl || null,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseKey?.length || 0,
  };
}
