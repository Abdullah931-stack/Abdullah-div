import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase Admin client with Service Role key.
 * ⚠️ ONLY use in server-side code (API Routes, Server Actions).
 * This client bypasses Row Level Security (RLS).
 */
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
