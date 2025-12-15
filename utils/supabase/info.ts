// Supabase configuration
// Extract project ID from NEXT_PUBLIC_SUPABASE_URL (format: https://projectId.supabase.co)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opmkeahvpeuqbzltwbgy.supabase.co';
export const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '').split('/')[0] || 'opmkeahvpeuqbzltwbgy';
export const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbWtlYWh2cGV1cWJ6bHR3Ymd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjUzMTUsImV4cCI6MjA4MDk0MTMxNX0.IzQiEUwSmSYpcjbDHaQ9hmdtIV7QqxJhFTAJ26mJ9hY';
export const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbWtlYWh2cGV1cWJ6bHR3Ymd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM2NTMxNSwiZXhwIjoyMDgwOTQxMzE1fQ.DPc9wP1DQKIKsSyaqJv5vuPt7h5uM2yLKMe7Y7v7IHs';

