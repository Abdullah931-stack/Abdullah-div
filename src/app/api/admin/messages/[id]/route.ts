import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Message by ID API
 *
 * PUT    — Mark message as read/unread
 * DELETE — Delete message
 */

// PUT /api/admin/messages/[id] — Toggle read status
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        const body = await request.json();

        const message = await prisma.message.update({
            where: { id },
            data: { isRead: body.isRead },
        });

        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        console.error("[Admin API] PUT /api/admin/messages/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/messages/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        await prisma.message.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(
            "[Admin API] DELETE /api/admin/messages/[id] error:",
            error
        );
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
