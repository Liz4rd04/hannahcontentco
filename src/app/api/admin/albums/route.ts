import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { albumSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// POST /api/admin/albums
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { client_id, ...albumData } = body;

  if (!client_id) {
    return NextResponse.json({ error: "client_id is required" }, { status: 400 });
  }

  const result = albumSchema.safeParse(albumData);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("albums")
    .insert({ ...result.data, client_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "album_created",
    userId: user.id,
    entityType: "album",
    entityId: data.id,
    metadata: { title: data.title, client_id },
  });

  return NextResponse.json({ data }, { status: 201 });
}
