import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/projects/[slug]
 * Returns a single project by slug if published.
 * Public endpoint — no authentication required.
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const project = await prisma.project.findUnique({
            where: { slug, isPublished: true },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        console.error("[API] GET /api/public/projects/[slug] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
