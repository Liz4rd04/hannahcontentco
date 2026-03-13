import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePortalCookie } from "@/lib/tokens";

// GET /api/client/media?slug=xxx&albumId=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const albumId = request.nextUrl.searchParams.get("albumId");
  if (!slug || !albumId)
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

  // Validate portal cookie
  const cookie = request.cookies.get(`portal_${slug}`);
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const valid = await validatePortalCookie(slug, cookie.value);
  if (!valid) return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });

  const supabase = createAdminClient();

  // Verify album belongs to client and is published
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, description")
    .eq("id", albumId)
    .eq("client_id", client.id)
    .eq("is_published", true)
    .single();

  if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

  // Get media with signed URLs
  const { data: media } = await supabase
    .from("media")
    .select("id, type, filename, caption, width, height, duration, storage_path, thumbnail_path")
    .eq("album_id", albumId)
    .order("sort_order")
    .order("created_at", { ascending: false });

  const mediaWithUrls = await Promise.all(
    (media || []).map(async (m: any) => {
      const { data: signedMain } = await supabase.storage
        .from("client-media")
        .createSignedUrl(m.storage_path, 3600); // 60 min

      let thumbnailUrl = null;
      if (m.thumbnail_path) {
        const { data: signedThumb } = await supabase.storage
          .from("client-media")
          .createSignedUrl(m.thumbnail_path, 3600);
        thumbnailUrl = signedThumb?.signedUrl;
      }

      return {
        id: m.id,
        type: m.type,
        filename: m.filename,
        caption: m.caption,
        width: m.width,
        height: m.height,
        duration: m.duration,
        url: signedMain?.signedUrl || null,
        thumbnailUrl: thumbnailUrl || signedMain?.signedUrl || null,
      };
    })
  );

  return NextResponse.json({
    data: {
      album: { id: album.id, title: album.title, description: album.description },
      media: mediaWithUrls,
    },
  });
}
