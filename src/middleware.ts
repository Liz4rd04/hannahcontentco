import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let response = NextResponse.next({ request });

  // ── Admin routes: require Supabase auth session ──
  if (pathname.startsWith("/admin")) {
    const supabase = createMiddlewareClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Client portal: token → cookie exchange ──
  if (pathname.startsWith("/c/") && searchParams.has("token")) {
    const token = searchParams.get("token")!;
    const segments = pathname.split("/");
    const slug = segments[2];

    if (slug) {
      // We can't call the full validateClientToken here because
      // middleware runs on the edge. Instead, redirect to an API route
      // that handles validation and sets the cookie, then redirects back.
      const validateUrl = new URL("/api/client/validate", request.url);
      validateUrl.searchParams.set("slug", slug);
      validateUrl.searchParams.set("token", token);
      validateUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(validateUrl);
    }
  }

  // ── Client portal: check cookie on subsequent visits ──
  if (pathname.startsWith("/c/")) {
    const segments = pathname.split("/");
    const slug = segments[2];
    if (slug) {
      const cookie = request.cookies.get(`portal_${slug}`);
      if (!cookie) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
      // Full cookie validation happens in the page/API — middleware just
      // checks existence for a fast reject.
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/c/:path*"],
};
