import { describe, it, expect } from "vitest";
import type {
    Locale,
    ServiceType,
    BudgetRange,
    EmailStatus,
    Theme,
    MessageInput,
    SurveySubmission,
    ApiResponse,
} from "@/types";

// ─────────────────────────────────────────────
// TDD: Type safety and contract verification tests
// ─────────────────────────────────────────────

describe("Type Definitions", () => {
    describe("Locale", () => {
        it("should accept valid locale values", () => {
            const ar: Locale = "ar";
            const en: Locale = "en";
            expect(ar).toBe("ar");
            expect(en).toBe("en");
        });
    });

    describe("ServiceType", () => {
        it("should accept valid service types", () => {
            const types: ServiceType[] = ["MVP", "SaaS", "AI Integration"];
            expect(types).toHaveLength(3);
        });
    });

    describe("BudgetRange", () => {
        it("should accept valid budget ranges", () => {
            const budgets: BudgetRange[] = [
                "$150-$500",
                "$500-$1000",
                "+$1000",
            ];
            expect(budgets).toHaveLength(3);
        });
    });

    describe("EmailStatus", () => {
        it("should accept valid email status values", () => {
            const statuses: EmailStatus[] = ["pending", "sent", "failed"];
            expect(statuses).toHaveLength(3);
        });
    });

    describe("Theme", () => {
        it("should accept valid theme values", () => {
            const themes: Theme[] = ["dark", "light"];
            expect(themes).toHaveLength(2);
        });
    });

    describe("MessageInput", () => {
        it("should create a valid message input object", () => {
            const message: MessageInput = {
                senderName: "Test User",
                senderEmail: "test@example.com",
                serviceType: "MVP",
                budget: "$150-$500",
                body: "Test message body",
                locale: "ar",
            };

            expect(message.senderName).toBe("Test User");
            expect(message.serviceType).toBe("MVP");
            expect(message.locale).toBe("ar");
        });
    });

    describe("SurveySubmission", () => {
        it("should create a valid survey submission", () => {
            const submission: SurveySubmission = {
                visitorId: "test-uuid",
                locale: "en",
                responses: [
                    { questionId: "q1", answer: "LinkedIn" },
                    { questionId: "q2", answer: "Free text answer" },
                ],
            };

            expect(submission.responses).toHaveLength(2);
            expect(submission.locale).toBe("en");
        });
    });

    describe("ApiResponse", () => {
        it("should create a success response", () => {
            const response: ApiResponse<{ id: string }> = {
                success: true,
                data: { id: "test-id" },
            };

            expect(response.success).toBe(true);
            expect(response.data?.id).toBe("test-id");
        });

        it("should create an error response", () => {
            const response: ApiResponse = {
                success: false,
                error: "Something went wrong",
            };

            expect(response.success).toBe(false);
            expect(response.error).toBe("Something went wrong");
        });
    });
});
