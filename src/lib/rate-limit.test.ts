import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

// ─────────────────────────────────────────────
// TDD: Tests written BEFORE implementation verification
// ─────────────────────────────────────────────

describe("checkRateLimit", () => {
    it("should allow request when rate limiter is null (not configured)", async () => {
        const result = await checkRateLimit(null, "127.0.0.1");
        expect(result.allowed).toBe(true);
        expect(result.retryAfter).toBeUndefined();
    });

    it("should allow request when within rate limit", async () => {
        const mockRateLimiter = {
            limit: vi.fn().mockResolvedValue({
                success: true,
                limit: 5,
                remaining: 4,
                reset: Date.now() + 3600000,
            }),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await checkRateLimit(mockRateLimiter as any, "127.0.0.1");
        expect(result.allowed).toBe(true);
        expect(mockRateLimiter.limit).toHaveBeenCalledWith("127.0.0.1");
    });

    it("should deny request when rate limit exceeded", async () => {
        const futureReset = Date.now() + 1800000; // 30 minutes from now
        const mockRateLimiter = {
            limit: vi.fn().mockResolvedValue({
                success: false,
                limit: 5,
                remaining: 0,
                reset: futureReset,
            }),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await checkRateLimit(mockRateLimiter as any, "127.0.0.1");
        expect(result.allowed).toBe(false);
        expect(result.retryAfter).toBeDefined();
        expect(result.retryAfter).toBeGreaterThan(0);
    });
});
