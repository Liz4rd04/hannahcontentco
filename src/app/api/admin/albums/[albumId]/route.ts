import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { albumSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

interface Context {
  params: Promise<{ albumId: string }>;
}

// GET /api/admin/albums/[albumId]
export async function GET(_request: NextRequest, context: Context) {
  const { albumId } = await context.params;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", albumId)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

// PATCH /api/admin/albums/[albumId]
export async function PATCH(request: NextRequest, context: Context) {
  const { albumId } = await context.params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = albumSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("albums")
    .update(result.data)
    .eq("id", albumId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "album_updated",
    userId: user.id,
    entityType: "album",
    entityId: albumId,
  });

  return NextResponse.json({ data });
}

// DELETE /api/admin/albums/[albumId]
export async function DELETE(_request: NextRequest, context: Context) {
  const { albumId } = await context.params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete files from storage
  const admin = createAdminClient();
  const { data: media } = await admin
    .from("media")
    .select("storage_path, thumbnail_path")
    .eq("album_id", albumId);

  if (media && media.length > 0) {
    const paths = media.flatMap((m) => [m.storage_path, m.thumbnail_path].filter(Boolean));
    if (paths.length > 0) {
      await admin.storage.from("client-media").remove(paths as string[]);
    }
  }

  const { error } = await supabase.from("albums").delete().eq("id", albumId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "album_deleted",
    userId: user.id,
    entityType: "album",
    entityId: albumId,
  });

  return NextResponse.json({ success: true });
}
