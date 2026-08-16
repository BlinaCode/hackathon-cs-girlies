import { createClient } from '@supabase/supabase-js';

// Read VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export let supabase = null;
export let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey) {
  try {
    // This will throw if the URL doesn't start with http/https
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConfigured = true;
  } catch (err) {
    console.error('Invalid VITE_SUPABASE_URL format. It must include https://. Falling back to Guest Mode.', err);
  }
}
