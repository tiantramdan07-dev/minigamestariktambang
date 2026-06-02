-- =====================================================
-- Setup Database Supabase untuk Tarik Tambang
-- Jalankan di: Supabase → SQL Editor → New Query
-- =====================================================

-- 1. Buat tabel
CREATE TABLE IF NOT EXISTS game_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security
ALTER TABLE game_data ENABLE ROW LEVEL SECURITY;

-- 3. Buat policy akses publik (read + write)
DROP POLICY IF EXISTS "public_access" ON game_data;
CREATE POLICY "public_access" ON game_data
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Index untuk performa
CREATE INDEX IF NOT EXISTS idx_game_data_key ON game_data(key);

-- ✅ Selesai! Sekarang set environment variables di Vercel.
