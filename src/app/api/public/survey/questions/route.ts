import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/survey/questions
 * Returns all active survey questions ordered by `order` field.
 * Public endpoint — no authentication required.
 */
export async function GET() {
    try {
        const questions = await prisma.surveyQuestion.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        console.error("[API] GET /api/public/survey/questions error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
