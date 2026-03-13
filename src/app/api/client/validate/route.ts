import { NextRequest, NextResponse } from "next/server";
import { validateClientToken, hashToken, signCookie } from "@/lib/tokens";
import { logAudit } from "@/lib/audit";

// GET /api/client/validate?slug=xxx&token=xxx&redirect=/c/xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const rawToken = request.nextUrl.searchParams.get("token");
  const redirect = request.nextUrl.searchParams.get("redirect") || `/c/${slug}`;

  if (!slug || !rawToken) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const valid = await validateClientToken(slug, rawToken);

  if (!valid) {
    // Redirect to a generic not found / invalid link page
    return NextResponse.redirect(new URL("/link-expired", request.url));
  }

  // Create signed cookie: slug:tokenHash
  const tokenHash = hashToken(rawToken);
  const cookieValue = signCookie(`${slug}:${tokenHash}`);

  // Build redirect to clean URL (no token in URL)
  const cleanUrl = new URL(redirect, request.url);
  cleanUrl.searchParams.delete("token");

  const response = NextResponse.redirect(cleanUrl);

  // Set HttpOnly cookie
  response.cookies.set(`portal_${slug}`, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: `/c/${slug}`,
  });

  await logAudit({
    action: "client_link_accessed",
    entityType: "client",
    metadata: { slug },
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
  });

  return response;
}
