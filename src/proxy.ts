import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Match UUID (with or without hyphens). */
function isUuid(param: string): boolean {
  const hex = param.replace(/-/g, "");
  return hex.length === 32 && /^[0-9a-fA-F]{32}$/.test(hex);
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Canonicalize production domain to avoid split cookies / auth issues.
  // If the apex domain is accessed, redirect to www (preserve path + query).
  if (host === "kuldae.com") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = "www.kuldae.com";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Redirect GET /cars/[uuid] to /cars/[slug] when listing has a slug (before session refresh)
  const { pathname } = request.nextUrl;
  const carsMatch = pathname.match(/^\/cars\/([^/]+)\/?$/);
  if (request.method === "GET" && carsMatch) {
    const param = carsMatch[1];
    if (isUuid(param)) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {
              // No-op for this read-only slug lookup
            },
          },
        });
        const { data } = await supabase
          .from("car_listings")
          .select("slug")
          .eq("id", param)
          .eq("is_active", true)
          .maybeSingle();
        if (data?.slug) {
          const url = request.nextUrl.clone();
          url.pathname = `/cars/${data.slug}`;
          return NextResponse.redirect(url, 308);
        }
      }
    }
  }

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, return response without Supabase initialization
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are missing. Skipping session refresh.");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session if expired - required for Server Components
    // Wrap in try-catch to prevent proxy from crashing on auth errors
    try {
      await supabase.auth.getUser();
    } catch (error) {
      // Log error but don't fail the request
      console.error("Error refreshing Supabase session:", error);
    }
  } catch (error) {
    // If Supabase client creation fails, log but continue
    console.error("Error initializing Supabase client:", error);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
