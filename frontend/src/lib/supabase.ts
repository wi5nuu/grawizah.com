import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here');

if (!isConfigured) {
  console.warn('[Grawizah] Supabase not configured. Using local backend auth instead.');
}

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null as any; // App uses Go backend auth, Supabase is optional


// Helper functions
export const getSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Direct-to-Supabase Storage upload helper
export const uploadToSupabase = async (file: File, folder: string): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized or configured.');
  }

  // Generate unique clean path: grawizah/folder/timestamp-random.ext
  const fileExt = file.name.split('.').pop();
  const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('grawizah')
    .upload(cleanFileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('grawizah')
    .getPublicUrl(cleanFileName);

  return publicUrl;
};
