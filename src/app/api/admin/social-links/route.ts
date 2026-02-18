import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Social Links API — CRUD
 *
 * GET  — List all social links
 * POST — Create a new social link
 */

// GET /api/admin/social-links
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: links });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/social-links error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/admin/social-links
export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const body = await request.json();

        const link = await prisma.socialLink.create({
            data: {
                platform: body.platform,
                url: body.url,
                labelAr: body.labelAr || "",
                labelEn: body.labelEn || "",
                icon: body.icon || null,
                order: body.order || 0,
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json(
            { success: true, data: link },
            { status: 201 }
        );
    } catch (error) {
        console.error("[Admin API] POST /api/admin/social-links error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
