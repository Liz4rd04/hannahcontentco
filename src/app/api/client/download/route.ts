import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePortalCookie } from "@/lib/tokens";

// GET /api/client/download?slug=xxx&mediaId=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const mediaId = request.nextUrl.searchParams.get("mediaId");
  if (!slug || !mediaId)
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

  const cookie = request.cookies.get(`portal_${slug}`);
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const valid = await validatePortalCookie(slug, cookie.value);
  if (!valid) return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });

  const supabase = createAdminClient();

  // Verify media belongs to this client
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: media } = await supabase
    .from("media")
    .select("storage_path, filename")
    .eq("id", mediaId)
    .eq("client_id", client.id)
    .single();

  if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

  // Create download-oriented signed URL
  const { data: signedUrl } = await supabase.storage
    .from("client-media")
    .createSignedUrl(media.storage_path, 300, {
      download: media.filename,
    });

  if (!signedUrl?.signedUrl)
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });

  return NextResponse.json({ data: { url: signedUrl.signedUrl } });
}
