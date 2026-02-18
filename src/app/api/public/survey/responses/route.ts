import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSurveyRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import type { SurveySubmission } from "@/types";

/**
 * POST /api/public/survey/responses
 * Submits survey responses.
 * Rate limited: 3 submissions per IP per hour.
 * Public endpoint — no authentication required.
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const rateLimiter = getSurveyRateLimiter();
        const { allowed, retryAfter } = await checkRateLimit(rateLimiter, ip);

        if (!allowed) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Too many requests",
                    retryAfter,
                },
                { status: 429 }
            );
        }

        const body: SurveySubmission = await request.json();

        // Validate
        if (!body.visitorId || !body.responses || body.responses.length === 0) {
            return NextResponse.json(
                { success: false, error: "Invalid submission" },
                { status: 400 }
            );
        }

        // Save all responses
        const createdResponses = await prisma.surveyResponse.createMany({
            data: body.responses.map((r) => ({
                visitorId: body.visitorId,
                questionId: r.questionId,
                answer: r.answer,
                locale: body.locale || "ar",
            })),
        });

        return NextResponse.json(
            {
                success: true,
                data: { count: createdResponses.count },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API] POST /api/public/survey/responses error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
