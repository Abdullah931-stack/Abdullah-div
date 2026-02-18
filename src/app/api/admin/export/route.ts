import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * GET /api/admin/export
 * Exports all data as JSON for backup/migration.
 * Protected — requires admin authentication.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const [projects, timeline, socialLinks, messages, surveyQuestions, surveyResponses] =
            await Promise.all([
                prisma.project.findMany({
                    include: { images: true },
                    orderBy: { order: "asc" },
                }),
                prisma.timelineEntry.findMany({ orderBy: { order: "asc" } }),
                prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
                prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
                prisma.surveyQuestion.findMany({ orderBy: { order: "asc" } }),
                prisma.surveyResponse.findMany({ orderBy: { createdAt: "desc" } }),
            ]);

        const exportData = {
            exportedAt: new Date().toISOString(),
            data: {
                projects,
                timeline,
                socialLinks,
                messages,
                surveyQuestions,
                surveyResponses,
            },
        };

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="portfolio-export-${new Date().toISOString().split("T")[0]
                    }.json"`,
            },
        });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/export error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
