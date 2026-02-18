"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/components/shared/ThemeProvider";

/**
 * Navbar — Shared Navigation Component
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Logo/Name (left)
 * - Navigation links (center)
 * - Language Switcher + Theme Switcher (right)
 * - Glassmorphism background with blur
 * - Fixed position, visible on scroll
 */
export default function Navbar() {
    const t = useTranslations("nav");
    const tLang = useTranslations("language");
    const tTheme = useTranslations("theme");
    const locale = useLocale();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const otherLocale = locale === "ar" ? "en" : "ar";

    const navLinks = [
        { href: `/${locale}`, label: t("home") },
        { href: `/${locale}/portfolio`, label: t("portfolio") },
        { href: `/${locale}/journey`, label: t("journey") },
        { href: `/${locale}/contact`, label: t("contact") },
    ];

    return (
        <nav
            className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border)]"
            style={{
                background: "rgba(var(--color-bg), 0.8)",
                backdropFilter: `blur(var(--blur-md))`,
                WebkitBackdropFilter: `blur(var(--blur-md))`,
                backgroundColor:
                    theme === "dark"
                        ? "rgba(10, 15, 20, 0.85)"
                        : "rgba(245, 240, 235, 0.85)",
            }}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo / Name */}
                <Link
                    href={`/${locale}`}
                    className="text-xl font-bold transition-colors hover:text-[var(--color-primary)]"
                >
                    Abdullah
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions: Language + Theme + Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <Link
                        href={`/${otherLocale}`}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]"
                        title={tLang("switch")}
                    >
                        {locale === "ar" ? "EN" : "ع"}
                    </Link>

                    {/* Theme Switcher */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-lg border border-[var(--color-border)] p-2 transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]"
                        title={tTheme("toggle")}
                        aria-label={tTheme("toggle")}
                    >
                        {theme === "dark" ? (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg border border-[var(--color-border)] p-2 transition-all hover:bg-[var(--color-surface)] md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            {mobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
                    >
                        <div className="flex flex-col gap-4 px-6 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
