"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

/**
 * Smart Contact Form — Glassmorphism Design
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Fields: Name, Email, Service Type, Budget, Details
 * - "Start Project 🚀" submit button
 * - Glassmorphism card styling
 * - Form validation
 * - Rate-limited submission
 * - Success state after submission
 */

export default function ContactForm() {
    const t = useTranslations("contact");
    const locale = useLocale();

    const [formData, setFormData] = useState({
        senderName: "",
        senderEmail: "",
        serviceType: "",
        budget: "",
        body: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    /**
     * Validates form fields.
     */
    function validate(): boolean {
        const newErrors: Record<string, string> = {};

        if (!formData.senderName.trim()) {
            newErrors.senderName = t("errors.required");
        }
        if (!formData.senderEmail.trim()) {
            newErrors.senderEmail = t("errors.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
            newErrors.senderEmail = t("errors.email");
        }
        if (!formData.serviceType) {
            newErrors.serviceType = t("errors.required");
        }
        if (!formData.budget) {
            newErrors.budget = t("errors.required");
        }
        if (!formData.body.trim()) {
            newErrors.body = t("errors.required");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    /**
     * Submits the form data to the API.
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/public/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, locale }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setSubmitError(t("errors.rateLimit"));
                } else {
                    setSubmitError(data.error || t("errors.generic"));
                }
                return;
            }

            setIsSuccess(true);
        } catch {
            setSubmitError(t("errors.generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    // ─── Success State ───
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="smart-contact-card mx-auto max-w-lg text-center"
            >
                <div className="mb-6 text-6xl">🎉</div>
                <h3 className="mb-4 text-2xl font-bold">{t("success.title")}</h3>
                <p className="text-[var(--color-text-secondary)]">
                    {t("success.message")}
                </p>
            </motion.div>
        );
    }

    // ─── Form ───
    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="smart-contact-card mx-auto max-w-lg space-y-6"
        >
            {/* Name */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t("name")}
                </label>
                <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) =>
                        setFormData({ ...formData, senderName: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder={t("name")}
                />
                {errors.senderName && (
                    <p className="mt-1 text-sm text-[var(--color-error)]">
                        {errors.senderName}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t("email")}
                </label>
                <input
                    type="email"
                    value={formData.senderEmail}
                    onChange={(e) =>
                        setFormData({ ...formData, senderEmail: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder={t("email")}
                />
                {errors.senderEmail && (
                    <p className="mt-1 text-sm text-[var(--color-error)]">
                        {errors.senderEmail}
                    </p>
                )}
            </div>

            {/* Service Type */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t("serviceType")}
                </label>
                <select
                    value={formData.serviceType}
                    onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                >
                    <option value="">{t("serviceType")}</option>
                    <option value="MVP">{t("services.mvp")}</option>
                    <option value="SaaS">{t("services.saas")}</option>
                    <option value="AI Integration">{t("services.ai")}</option>
                </select>
                {errors.serviceType && (
                    <p className="mt-1 text-sm text-[var(--color-error)]">
                        {errors.serviceType}
                    </p>
                )}
            </div>

            {/* Budget */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t("budget")}
                </label>
                <select
                    value={formData.budget}
                    onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                >
                    <option value="">{t("budget")}</option>
                    <option value="$150-$500">{t("budgets.low")}</option>
                    <option value="$500-$1000">{t("budgets.mid")}</option>
                    <option value="+$1000">{t("budgets.high")}</option>
                </select>
                {errors.budget && (
                    <p className="mt-1 text-sm text-[var(--color-error)]">
                        {errors.budget}
                    </p>
                )}
            </div>

            {/* Message Body */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t("message")}
                </label>
                <textarea
                    value={formData.body}
                    onChange={(e) =>
                        setFormData({ ...formData, body: e.target.value })
                    }
                    rows={5}
                    className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder={t("message")}
                />
                {errors.body && (
                    <p className="mt-1 text-sm text-[var(--color-error)]">
                        {errors.body}
                    </p>
                )}
            </div>

            {/* Submit Error */}
            {submitError && (
                <div className="rounded-lg bg-[var(--color-error)]/10 p-3 text-sm text-[var(--color-error)]">
                    {submitError}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-project w-full font-medium text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="h-5 w-5 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="opacity-25"
                            />
                            <path
                                d="M4 12a8 8 0 018-8V0"
                                fill="currentColor"
                                className="opacity-75"
                            />
                        </svg>
                        {locale === "ar" ? "جاري الإرسال..." : "Sending..."}
                    </span>
                ) : (
                    t("submit")
                )}
            </button>
        </motion.form>
    );
}
