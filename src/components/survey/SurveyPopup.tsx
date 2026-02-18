"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { SurveyQuestion, SurveyResponseInput } from "@/types";

/**
 * Survey Popup — First-visit triggered
 * Per 04-PAGE-SPECIFICATIONS.md & 05-ANIMATION-SPEC.md:
 * - Appears on first visit (cookie-based)
 * - Glassmorphism overlay
 * - Multi-step: one question at a time
 * - Slide animation between questions
 * - Skip option
 */

const SURVEY_COOKIE = "survey_completed";

export default function SurveyPopup() {
    const t = useTranslations("survey");
    const locale = useLocale();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [responses, setResponses] = useState<SurveyResponseInput[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check cookie on mount — show popup if first visit
    useEffect(() => {
        const hasCompleted = document.cookie.includes(`${SURVEY_COOKIE}=true`);
        if (!hasCompleted) {
            // Delay popup appearance for better UX
            const timer = setTimeout(() => {
                fetchQuestions();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    async function fetchQuestions() {
        try {
            const res = await fetch("/api/public/survey/questions");
            if (!res.ok) return;
            const data = await res.json();
            if (data.data && data.data.length > 0) {
                setQuestions(data.data);
                setIsVisible(true);
            }
        } catch {
            // Silently fail — survey is not critical
        }
    }

    function handleAnswer(questionId: string, answer: string) {
        setResponses((prev) => {
            const existing = prev.findIndex((r) => r.questionId === questionId);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { questionId, answer };
                return updated;
            }
            return [...prev, { questionId, answer }];
        });
    }

    function handleNext() {
        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    }

    function handleSkip() {
        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleClose();
        }
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        try {
            await fetch("/api/public/survey/responses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: crypto.randomUUID(),
                    locale,
                    responses,
                }),
            });
        } catch {
            // Silently fail
        } finally {
            handleClose();
        }
    }

    function handleClose() {
        setIsVisible(false);
        // Set cookie for 30 days
        document.cookie = `${SURVEY_COOKIE}=true; max-age=${30 * 24 * 60 * 60}; path=/`;
    }

    const currentQuestion = questions[currentStep];
    const currentAnswer = responses.find(
        (r) => r.questionId === currentQuestion?.id
    )?.answer;

    return (
        <AnimatePresence>
            {isVisible && currentQuestion && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: "var(--color-overlay)" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[16px] border border-[var(--color-border)]"
                        style={{
                            background: "var(--color-surface)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                        }}
                    >
                        {/* Header */}
                        <div className="border-b border-[var(--color-border)] p-6 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{t("title")}</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {t("subtitle")}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                                    aria-label="Close survey"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
                                <motion.div
                                    className="h-full rounded-full bg-[var(--color-primary)]"
                                    animate={{
                                        width: `${((currentStep + 1) / questions.length) * 100}%`,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="mb-4 font-medium">
                                        {locale === "ar"
                                            ? currentQuestion.textAr
                                            : currentQuestion.textEn}
                                    </p>

                                    {/* Multiple Choice */}
                                    {currentQuestion.type === "multiple_choice" && (
                                        <div className="space-y-2">
                                            {(locale === "ar"
                                                ? currentQuestion.optionsAr
                                                : currentQuestion.optionsEn
                                            ).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() =>
                                                        handleAnswer(currentQuestion.id, option)
                                                    }
                                                    className={`w-full rounded-[12px] border px-4 py-3 text-start text-sm transition-all ${currentAnswer === option
                                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Free Text */}
                                    {currentQuestion.type === "free_text" && (
                                        <textarea
                                            value={currentAnswer || ""}
                                            onChange={(e) =>
                                                handleAnswer(currentQuestion.id, e.target.value)
                                            }
                                            rows={3}
                                            className="w-full resize-none rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm transition-colors focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder={t("freeTextPlaceholder")}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between border-t border-[var(--color-border)] p-4">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                            >
                                {currentStep < questions.length - 1
                                    ? t("skip")
                                    : t("skipAll")}
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="rounded-[12px] bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                            >
                                {currentStep < questions.length - 1
                                    ? t("next")
                                    : t("finish")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
