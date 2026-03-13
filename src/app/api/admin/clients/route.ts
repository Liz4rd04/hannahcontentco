import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET /api/admin/clients — List all clients
export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/clients — Create a client
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = clientSchema.safeParse(body);

  if (!result.success) {
    const flat = result.error.flatten().fieldErrors;
    return NextResponse.json({ errors: flat }, { status: 400 });
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("slug", result.data.slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { errors: { slug: ["This slug is already taken"] } },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: result.data.name,
      slug: result.data.slug,
      contact_name: result.data.contact_name || null,
      contact_email: result.data.contact_email || null,
      notes: result.data.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "client_created",
    userId: user.id,
    entityType: "client",
    entityId: data.id,
    metadata: { name: data.name },
  });

  return NextResponse.json({ data }, { status: 201 });
}
