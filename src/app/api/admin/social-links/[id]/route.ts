import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Social Links by ID API
 *
 * PUT    — Update social link
 * DELETE — Delete social link
 */

// PUT /api/admin/social-links/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        const body = await request.json();

        const link = await prisma.socialLink.update({
            where: { id },
            data: {
                platform: body.platform,
                url: body.url,
                labelAr: body.labelAr,
                labelEn: body.labelEn,
                icon: body.icon,
                order: body.order,
                isActive: body.isActive,
            },
        });

        return NextResponse.json({ success: true, data: link });
    } catch (error) {
        console.error(
            "[Admin API] PUT /api/admin/social-links/[id] error:",
            error
        );
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/social-links/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        await prisma.socialLink.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(
            "[Admin API] DELETE /api/admin/social-links/[id] error:",
            error
        );
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
