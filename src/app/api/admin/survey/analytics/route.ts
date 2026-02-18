import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Survey Analytics API
 *
 * GET — Get survey questions with response analytics
 */

// GET /api/admin/survey/analytics
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        // Get all questions with their responses
        const questions = await prisma.surveyQuestion.findMany({
            orderBy: { order: "asc" },
        });

        const responses = await prisma.surveyResponse.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Aggregate analytics per question
        const analytics = questions.map((question: typeof questions[number]) => {
            const questionResponses = responses.filter(
                (r: typeof responses[number]) => r.questionId === question.id
            );

            // Count answers for multiple choice
            const answerCounts: Record<string, number> = {};
            questionResponses.forEach((r: typeof responses[number]) => {
                answerCounts[r.answer] = (answerCounts[r.answer] || 0) + 1;
            });

            return {
                question,
                totalResponses: questionResponses.length,
                answerCounts,
                recentResponses: questionResponses.slice(0, 10),
            };
        });

        // Overall stats
        const uniqueVisitors = new Set(responses.map((r: typeof responses[number]) => r.visitorId)).size;

        return NextResponse.json({
            success: true,
            data: {
                analytics,
                summary: {
                    totalQuestions: questions.length,
                    totalResponses: responses.length,
                    uniqueVisitors,
                },
            },
        });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/survey/analytics error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
