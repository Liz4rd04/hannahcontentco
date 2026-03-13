-- ============================================================
-- SOCIAL MEDIA MANAGEMENT PLATFORM — DATABASE SETUP
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates all tables, indexes, RLS policies, and triggers.
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE audit_action AS ENUM (
  'client_created', 'client_updated', 'client_deleted',
  'album_created', 'album_updated', 'album_deleted',
  'media_uploaded', 'media_updated', 'media_deleted',
  'token_rotated', 'client_link_accessed'
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  logo_url      TEXT,
  contact_name  TEXT,
  contact_email TEXT,
  notes         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_slug ON clients (slug);
CREATE INDEX idx_clients_active ON clients (is_active);

-- ============================================================
-- CLIENT ACCESS TOKENS
-- ============================================================
CREATE TABLE client_access_tokens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL,
  label         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ
);

CREATE INDEX idx_cat_client ON client_access_tokens (client_id);
CREATE INDEX idx_cat_hash ON client_access_tokens (token_hash) WHERE is_active = true;

-- ============================================================
-- ALBUMS
-- ============================================================
CREATE TABLE albums (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  cover_path    TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_albums_client ON albums (client_id);
CREATE INDEX idx_albums_published ON albums (client_id, is_published);

-- ============================================================
-- MEDIA
-- ============================================================
CREATE TABLE media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id      UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type          media_type NOT NULL,
  storage_path  TEXT NOT NULL,
  thumbnail_path TEXT,
  filename      TEXT NOT NULL,
  caption       TEXT,
  file_size     BIGINT,
  mime_type     TEXT,
  width         INT,
  height        INT,
  duration      FLOAT,
  sort_order    INT NOT NULL DEFAULT 0,
  uploaded_by   UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_album ON media (album_id, sort_order);
CREATE INDEX idx_media_client ON media (client_id);
CREATE INDEX idx_media_storage ON media (storage_path);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id),
  action        audit_action NOT NULL,
  entity_type   TEXT,
  entity_id     UUID,
  metadata      JSONB DEFAULT '{}',
  ip_address    INET,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_time ON audit_log (created_at DESC);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_albums_updated BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_media_updated BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clients: admins get full access
CREATE POLICY "admin_clients_all" ON clients
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Access tokens: admins only
CREATE POLICY "admin_tokens_all" ON client_access_tokens
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Albums: admins get full access
CREATE POLICY "admin_albums_all" ON albums
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Media: admins get full access
CREATE POLICY "admin_media_all" ON media
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Audit log: admins can read and insert
CREATE POLICY "admin_audit_read" ON audit_log
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_audit_insert" ON audit_log
  FOR INSERT WITH CHECK (is_admin());

-- ============================================================
-- STORAGE BUCKETS (run this in Supabase Dashboard > Storage)
-- Or via API:
-- ============================================================
-- Create these manually in the Storage section:
-- 
-- 1. Bucket: "client-media"
--    - Public: OFF (private)
--    - File size limit: 100MB
--    - Allowed MIME types: image/*, video/*
--
-- 2. Bucket: "public-assets" 
--    - Public: ON
--    - File size limit: 10MB
--    - Allowed MIME types: image/*
-- ============================================================
