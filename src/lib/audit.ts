import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditAction } from "@/lib/types";

interface AuditEntry {
  action: AuditAction;
  userId?: string | null;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      user_id: entry.userId || null,
      action: entry.action,
      entity_type: entry.entityType || null,
      entity_id: entry.entityId || null,
      metadata: entry.metadata || {},
      ip_address: entry.ipAddress || null,
    });
  } catch (err) {
    // Audit logging should never break the main flow
    console.error("Audit log failed:", err);
  }
}
