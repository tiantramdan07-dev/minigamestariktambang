/**
 * Vercel Serverless Function - API Teachers
 * Endpoint: /api/teachers
 * 
 * Setup Supabase:
 * 1. Buat project di https://supabase.com
 * 2. Jalankan SQL: CREATE TABLE game_data (key TEXT PRIMARY KEY, value JSONB, updated_at TIMESTAMPTZ DEFAULT NOW());
 * 3. Set env variables di Vercel: SUPABASE_URL dan SUPABASE_ANON_KEY
 */
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sb = getSupabase();
  if (!sb) {
    return res.status(503).json({ error: 'Database not configured. Using localStorage instead.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('game_data').select('value').eq('key', 'tt-teachers').single();
      if (error && error.code !== 'PGRST116') throw error;
      return res.json({ data: data?.value || null });
    }

    if (req.method === 'POST') {
      const { teachers } = req.body || {};
      if (!teachers) return res.status(400).json({ error: 'teachers required' });
      const { error } = await sb.from('game_data').upsert(
        { key: 'tt-teachers', value: teachers, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      if (error) throw error;
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
