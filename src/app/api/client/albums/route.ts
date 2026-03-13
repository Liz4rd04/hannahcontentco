import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePortalCookie } from "@/lib/tokens";

// GET /api/client/albums?slug=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  // Validate portal cookie
  const cookie = request.cookies.get(`portal_${slug}`);
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const valid = await validatePortalCookie(slug, cookie.value);
  if (!valid) return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });

  // Fetch published albums
  const supabase = createAdminClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: albums } = await supabase
    .from("albums")
    .select("id, title, description, cover_path, created_at, media(count)")
    .eq("client_id", client.id)
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  // Generate cover signed URLs
  const albumsWithCovers = await Promise.all(
    (albums || []).map(async (album: any) => {
      let coverUrl = null;
      if (album.cover_path) {
        const { data } = await supabase.storage
          .from("client-media")
          .createSignedUrl(album.cover_path, 3600);
        coverUrl = data?.signedUrl;
      }
      return {
        ...album,
        coverUrl,
        mediaCount: album.media?.[0]?.count ?? 0,
      };
    })
  );

  return NextResponse.json({
    data: {
      client: { name: client.name },
      albums: albumsWithCovers,
    },
  });
}
