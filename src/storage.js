/**
 * Storage Layer: localStorage + opsional Supabase sync
 * Bekerja langsung tanpa setup apapun (localStorage).
 * Jika VITE_SUPABASE_URL dikonfigurasi → sync ke cloud.
 */
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'tt-teachers-v4';
let _sb = null;

function getSupabase() {
  if (_sb) return _sb;
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  if (url && key && url.startsWith('https://')) {
    try { _sb = createClient(url, key); } catch(e) {}
  }
  return _sb;
}

function saveLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

export async function loadTeachers() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('game_data').select('value').eq('key','tt-teachers').single();
      if (!error && data?.value) { saveLocal(data.value); return data.value; }
    } catch(e) {}
  }
  return loadLocal();
}

export async function saveTeachers(teachers) {
  saveLocal(teachers);
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('game_data').upsert(
        { key: 'tt-teachers', value: teachers, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    } catch(e) {}
  }
}
