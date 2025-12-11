// Supabase configuration
// Extract project ID from NEXT_PUBLIC_SUPABASE_URL (format: https://projectId.supabase.co)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opmkeahvpeuqbzltwbgy.supabase.co';
export const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '').split('/')[0] || 'opmkeahvpeuqbzltwbgy';
export const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

