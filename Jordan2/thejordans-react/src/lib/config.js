// Configure these only after connecting this app to its replacement project.
const env = import.meta.env || {};

export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

// Google Maps key used when none is saved in Admin → Settings.
export const GOOGLE_MAPS_API_KEY = (env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
