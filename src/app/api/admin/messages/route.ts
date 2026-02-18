import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Messages API
 *
 * GET — List all messages (newest first)
 */

// GET /api/admin/messages
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/messages error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
