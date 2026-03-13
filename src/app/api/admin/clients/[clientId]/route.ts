import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

interface Context {
  params: Promise<{ clientId: string }>;
}

// GET /api/admin/clients/[clientId]
export async function GET(_request: NextRequest, context: Context) {
  const { clientId } = await context.params;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

// PATCH /api/admin/clients/[clientId]
export async function PATCH(request: NextRequest, context: Context) {
  const { clientId } = await context.params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = clientSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Check slug uniqueness if changed
  if (result.data.slug) {
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("slug", result.data.slug)
      .neq("id", clientId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { errors: { slug: ["This slug is already taken"] } },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("clients")
    .update(result.data)
    .eq("id", clientId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "client_updated",
    userId: user.id,
    entityType: "client",
    entityId: clientId,
  });

  return NextResponse.json({ data });
}

// DELETE /api/admin/clients/[clientId]
export async function DELETE(_request: NextRequest, context: Context) {
  const { clientId } = await context.params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete all media files from storage first
  const admin = createAdminClient();
  const { data: media } = await admin
    .from("media")
    .select("storage_path, thumbnail_path")
    .eq("client_id", clientId);

  if (media && media.length > 0) {
    const paths = media.flatMap((m) =>
      [m.storage_path, m.thumbnail_path].filter(Boolean)
    );
    if (paths.length > 0) {
      await admin.storage.from("client-media").remove(paths as string[]);
    }
  }

  // Cascade delete handles albums, media, tokens in DB
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "client_deleted",
    userId: user.id,
    entityType: "client",
    entityId: clientId,
  });

  return NextResponse.json({ success: true });
}
