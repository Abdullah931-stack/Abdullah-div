"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Project } from "@/types";
import { useState } from "react";

/**
 * Project Detail Component
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Header with title, summary, skills, build time
 * - Full story (body content)
 * - Image gallery with lightbox
 * - Back to portfolio link
 */

interface ProjectDetailProps {
    project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
    const t = useTranslations("projects");
    const locale = useLocale();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const title = locale === "ar" ? project.titleAr : project.titleEn;
    const summary = locale === "ar" ? project.summaryAr : project.summaryEn;
    const body = locale === "ar" ? project.bodyAr : project.bodyEn;

    return (
        <article className="py-24">
            <div className="mx-auto max-w-4xl px-6">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href={`/${locale}/portfolio`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
                    >
                        ← {locale === "ar" ? "العودة للمشاريع" : "Back to Portfolio"}
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
                    <p className="mb-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                        {summary}
                    </p>

                    {/* Meta: Skills + Build Time */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-sm font-medium text-[var(--color-text-secondary)]"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {project.buildTime && (
                            <span className="text-sm text-[var(--color-text-muted)]">
                                🕐 {t("buildTime")}: {project.buildTime}
                            </span>
                        )}
                    </div>

                    {/* Preview URL */}
                    {project.previewUrl && (
                        <a
                            href={project.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2 text-sm text-white transition-all hover:shadow-md"
                        >
                            {t("preview")} ↗
                        </a>
                    )}
                </motion.header>

                {/* Image Gallery */}
                {project.images.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {project.images.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="cursor-pointer overflow-hidden rounded-xl"
                                    onClick={() => setLightboxIndex(index)}
                                >
                                    <img
                                        src={image.url}
                                        alt={
                                            locale === "ar"
                                                ? image.altAr || title
                                                : image.altEn || title
                                        }
                                        className="h-64 w-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Story / Body */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="prose prose-lg max-w-none"
                >
                    <div
                        className="leading-relaxed text-[var(--color-text-secondary)]"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {body}
                    </div>
                </motion.section>

                {/* Lightbox */}
                {lightboxIndex !== null && project.images[lightboxIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: "var(--color-overlay)" }}
                        onClick={() => setLightboxIndex(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="relative max-h-[80vh] max-w-4xl overflow-hidden rounded-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={project.images[lightboxIndex].url}
                                alt={title}
                                className="max-h-[80vh] w-auto object-contain"
                            />

                            {/* Navigation */}
                            {project.images.length > 1 && (
                                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
                                    <button
                                        onClick={() =>
                                            setLightboxIndex(
                                                (lightboxIndex - 1 + project.images.length) %
                                                project.images.length
                                            )
                                        }
                                        className="rounded-full bg-black/50 p-2 text-white"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={() =>
                                            setLightboxIndex(
                                                (lightboxIndex + 1) % project.images.length
                                            )
                                        }
                                        className="rounded-full bg-black/50 p-2 text-white"
                                    >
                                        →
                                    </button>
                                </div>
                            )}

                            {/* Close */}
                            <button
                                onClick={() => setLightboxIndex(null)}
                                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white"
                            >
                                ✕
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </article>
    );
}
