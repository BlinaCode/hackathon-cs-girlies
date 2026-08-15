import { createClient } from '@supabase/supabase-js';

// Read VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client if configured, otherwise provide a safe mock fallback
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
