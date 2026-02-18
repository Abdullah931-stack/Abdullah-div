import { describe, it, expect } from "vitest";
import {
    generateContactEmailHtml,
    generateContactEmailSubject,
} from "@/lib/resend/templates";
import type { MessageInput } from "@/types";

// ─────────────────────────────────────────────
// TDD: Tests written BEFORE implementation verification
// ─────────────────────────────────────────────

describe("generateContactEmailHtml", () => {
    const arabicMessage: MessageInput = {
        senderName: "أحمد",
        senderEmail: "ahmed@example.com",
        serviceType: "SaaS",
        budget: "$500-$1000",
        body: "أريد بناء منصة SaaS لإدارة المخزون",
        locale: "ar",
    };

    const englishMessage: MessageInput = {
        senderName: "John",
        senderEmail: "john@example.com",
        serviceType: "MVP",
        budget: "$150-$500",
        body: "I want to build an inventory management MVP",
        locale: "en",
    };

    it("should generate valid HTML email content", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain("</html>");
    });

    it("should include all message fields in the email", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain(arabicMessage.senderName);
        expect(html).toContain(arabicMessage.senderEmail);
        expect(html).toContain(arabicMessage.serviceType);
        expect(html).toContain(arabicMessage.budget);
        expect(html).toContain(arabicMessage.body);
    });

    it("should set RTL direction for Arabic locale", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain('dir="rtl"');
        expect(html).toContain('lang="ar"');
    });

    it("should set LTR direction for English locale", () => {
        const html = generateContactEmailHtml(englishMessage);
        expect(html).toContain('dir="ltr"');
        expect(html).toContain('lang="en"');
    });

    it("should use Arabic labels for Arabic locale", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain("الاسم");
        expect(html).toContain("البريد الإلكتروني");
    });

    it("should use English labels for English locale", () => {
        const html = generateContactEmailHtml(englishMessage);
        expect(html).toContain("Name");
        expect(html).toContain("Email");
    });
});

describe("generateContactEmailSubject", () => {
    it("should include service type, budget, and sender name", () => {
        const message: MessageInput = {
            senderName: "Ahmed",
            senderEmail: "ahmed@test.com",
            serviceType: "SaaS",
            budget: "$500-$1000",
            body: "Project details...",
            locale: "ar",
        };

        const subject = generateContactEmailSubject(message);
        expect(subject).toContain("SaaS");
        expect(subject).toContain("$500-$1000");
        expect(subject).toContain("Ahmed");
    });
});
