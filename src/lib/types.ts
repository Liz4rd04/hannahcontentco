// ============================================================
// Database Types
// ============================================================

export type MediaType = "image" | "video";

export type AuditAction =
  | "client_created"
  | "client_updated"
  | "client_deleted"
  | "album_created"
  | "album_updated"
  | "album_deleted"
  | "media_uploaded"
  | "media_updated"
  | "media_deleted"
  | "token_rotated"
  | "client_link_accessed";

export interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientAccessToken {
  id: string;
  client_id: string;
  token_hash: string;
  label: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

export interface Album {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  cover_path: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  media_count?: number;
}

export interface Media {
  id: string;
  album_id: string;
  client_id: string;
  type: MediaType;
  storage_path: string;
  thumbnail_path: string | null;
  filename: string;
  caption: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  sort_order: number;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  // Client-side enrichments
  signed_url?: string;
  thumbnail_url?: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: AuditAction;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// ============================================================
// Form / API Types
// ============================================================

export interface ClientFormData {
  name: string;
  slug: string;
  contact_name?: string;
  contact_email?: string;
  notes?: string;
  is_active?: boolean;
}

export interface AlbumFormData {
  title: string;
  description?: string;
  is_published?: boolean;
  sort_order?: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
