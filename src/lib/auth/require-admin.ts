import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin Auth Helper
 * Validates the current session using Supabase Auth.
 * Returns the user if authenticated, or a 401 response.
 * Used in all admin API routes.
 */
export async function requireAdmin(request: NextRequest) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            authenticated: false as const,
            response: NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            ),
        };
    }

    return {
        authenticated: true as const,
        user,
    };
}
