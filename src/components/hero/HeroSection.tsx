"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ParallaxCharacter from "./ParallaxCharacter";
import FloatingText from "./FloatingText";

/**
 * Hero Section — "The Hook"
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Left side: About Me text with floating animation
 * - Right side: 2.5D Parallax Character
 * - Background: gradient (Layer 1)
 *
 * Layout: Grid 2 columns on desktop, stacked on mobile.
 */
export default function HeroSection() {
    const t = useTranslations("hero");

    return (
        <section className="relative flex min-h-screen items-center overflow-hidden">
            {/* Background Layer — Layer 1 */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 30% 50%, rgba(45, 74, 62, 0.15), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(45, 74, 62, 0.08), transparent 50%)",
                }}
            />

            {/* Content Grid */}
            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:gap-12 lg:px-12">
                {/* Left: Text Content — Layer 3 (Foreground) */}
                <div className="order-2 text-center md:order-1 md:text-start">
                    <FloatingText delay={0}>
                        <p className="mb-2 text-lg text-[var(--color-text-secondary)]">
                            {t("greeting")}
                        </p>
                    </FloatingText>

                    <FloatingText delay={1}>
                        <h1 className="mb-4 text-5xl font-bold md:text-7xl">
                            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                {t("name")}
                            </span>
                        </h1>
                    </FloatingText>

                    <FloatingText delay={2}>
                        <h2 className="mb-6 text-2xl font-medium text-[var(--color-text-secondary)] md:text-3xl">
                            {t("role")}
                        </h2>
                    </FloatingText>

                    <FloatingText delay={3}>
                        <p className="mb-8 max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
                            {t("bio")}
                        </p>
                    </FloatingText>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                    >
                        <a
                            href="#journey"
                            className="btn-primary inline-flex items-center gap-2 text-white transition-all duration-300 hover:shadow-lg"
                        >
                            {t("cta")}
                            <span className="text-xl">↓</span>
                        </a>
                    </motion.div>
                </div>

                {/* Right: 2.5D Character — Layer 2 (Middle) */}
                <div className="order-1 md:order-2">
                    <ParallaxCharacter
                        characterSrc="/images/character/character.svg"
                        characterAlt={t("name")}
                    />
                </div>
            </div>
        </section>
    );
}
