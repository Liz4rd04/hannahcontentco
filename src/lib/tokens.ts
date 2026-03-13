import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "fallback-dev-secret";

// Generate a URL-safe random token
export function generateRawToken(length = 32): string {
  return crypto.randomBytes(length).toString("base64url");
}

// Hash a token with SHA-256 for storage
export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// Sign data for cookie storage (HMAC)
export function signCookie(data: string): string {
  const hmac = crypto.createHmac("sha256", TOKEN_SECRET);
  hmac.update(data);
  const signature = hmac.digest("hex");
  return `${data}.${signature}`;
}

// Verify a signed cookie
export function verifyCookie(cookie: string): string | null {
  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return null;

  const data = cookie.substring(0, lastDot);
  const signature = cookie.substring(lastDot + 1);

  const hmac = crypto.createHmac("sha256", TOKEN_SECRET);
  hmac.update(data);
  const expected = hmac.digest("hex");

  if (signature !== expected) return null;
  return data; // Returns the slug:tokenHash
}

// Validate a raw token against the database
export async function validateClientToken(
  slug: string,
  rawToken: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const hash = hashToken(rawToken);

  const { data, error } = await supabase
    .from("client_access_tokens")
    .select("id, expires_at, clients!inner(slug)")
    .eq("token_hash", hash)
    .eq("is_active", true)
    .eq("clients.slug", slug)
    .maybeSingle();

  if (error || !data) return false;

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return false;
  }

  return true;
}

// Validate a portal cookie (used in middleware and API routes)
export async function validatePortalCookie(
  slug: string,
  cookieValue: string
): Promise<boolean> {
  const data = verifyCookie(cookieValue);
  if (!data) return false;

  const [cookieSlug, tokenHash] = data.split(":");
  if (cookieSlug !== slug || !tokenHash) return false;

  const supabase = createAdminClient();
  const { data: token, error } = await supabase
    .from("client_access_tokens")
    .select("id, expires_at, clients!inner(slug)")
    .eq("token_hash", tokenHash)
    .eq("is_active", true)
    .eq("clients.slug", slug)
    .maybeSingle();

  if (error || !token) return false;
  if (token.expires_at && new Date(token.expires_at) < new Date()) return false;

  return true;
}
