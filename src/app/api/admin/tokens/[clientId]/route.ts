import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRawToken, hashToken, signCookie } from "@/lib/tokens";
import { logAudit } from "@/lib/audit";

interface Context {
  params: Promise<{ clientId: string }>;
}

// GET /api/admin/tokens/[clientId] — Check active token status
export async function GET(_request: NextRequest, context: Context) {
  const { clientId } = await context.params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: activeToken } = await supabase
    .from("client_access_tokens")
    .select("id, created_at, expires_at")
    .eq("client_id", clientId)
    .eq("is_active", true)
    .maybeSingle();

  return NextResponse.json({ data: { activeToken } });
}

// POST /api/admin/tokens/[clientId] — Generate or rotate token
export async function POST(request: NextRequest, context: Context) {
  const { clientId } = await context.params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const rotate = body.rotate === true;

  // Get client slug
  const { data: client } = await supabase
    .from("clients")
    .select("slug")
    .eq("id", clientId)
    .single();

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const admin = createAdminClient();

  // If rotating, revoke all existing active tokens
  if (rotate) {
    await admin
      .from("client_access_tokens")
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq("client_id", clientId)
      .eq("is_active", true);
  }

  // Check if there's already an active token (and not rotating)
  if (!rotate) {
    const { data: existing } = await admin
      .from("client_access_tokens")
      .select("id")
      .eq("client_id", clientId)
      .eq("is_active", true)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Active token already exists. Use rotate to replace it." },
        { status: 400 }
      );
    }
  }

  // Generate new token
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);

  const { error } = await admin.from("client_access_tokens").insert({
    client_id: clientId,
    token_hash: tokenHash,
    label: rotate ? "Rotated token" : "Initial token",
    is_active: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build the full link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const link = `${siteUrl}/c/${client.slug}?token=${rawToken}`;

  await logAudit({
    action: "token_rotated",
    userId: user.id,
    entityType: "client",
    entityId: clientId,
    metadata: { rotated: rotate },
  });

  return NextResponse.json({ data: { link } }, { status: 201 });
}
