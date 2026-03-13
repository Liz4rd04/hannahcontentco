import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

// PATCH /api/admin/media — Update caption
export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mediaId, caption } = await request.json();
  if (!mediaId) return NextResponse.json({ error: "mediaId required" }, { status: 400 });

  const { data, error } = await supabase
    .from("media")
    .update({ caption: caption || null })
    .eq("id", mediaId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "media_updated",
    userId: user.id,
    entityType: "media",
    entityId: mediaId,
  });

  return NextResponse.json({ data });
}

// DELETE /api/admin/media?mediaId=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mediaId = request.nextUrl.searchParams.get("mediaId");
  if (!mediaId) return NextResponse.json({ error: "mediaId required" }, { status: 400 });

  // Get file paths
  const { data: media } = await supabase
    .from("media")
    .select("storage_path, thumbnail_path, filename")
    .eq("id", mediaId)
    .single();

  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from storage
  const admin = createAdminClient();
  const paths = [media.storage_path, media.thumbnail_path].filter(Boolean) as string[];
  if (paths.length > 0) {
    await admin.storage.from("client-media").remove(paths);
  }

  // Delete from DB
  const { error } = await supabase.from("media").delete().eq("id", mediaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "media_deleted",
    userId: user.id,
    entityType: "media",
    entityId: mediaId,
    metadata: { filename: media.filename },
  });

  return NextResponse.json({ success: true });
}
