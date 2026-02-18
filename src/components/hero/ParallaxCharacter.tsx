"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Image from "next/image";

// ─────────────────────────────────────────────
// Constants — per Animation Spec (05-ANIMATION-SPEC.md)
// ─────────────────────────────────────────────
const CHARACTER_MAX_OFFSET = 20; // ±20px max movement
const SPRING_CONFIG = { stiffness: 100, damping: 25, mass: 0.5 };

/**
 * 2.5D Parallax Character Component
 *
 * Three-layer parallax system:
 * 1. Background: static gradient
 * 2. Character (middle): moves OPPOSITE to mouse direction (±20px)
 * 3. Foreground text: floats with subtle animation
 *
 * Per docs: Conditional loading — only loads on desktop (>768px).
 * Mobile receives a static version.
 */
interface ParallaxCharacterProps {
    characterSrc: string;
    characterAlt: string;
}

export default function ParallaxCharacter({
    characterSrc,
    characterAlt,
}: ParallaxCharacterProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Raw mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring values for character movement
    const springX = useSpring(mouseX, SPRING_CONFIG);
    const springY = useSpring(mouseY, SPRING_CONFIG);

    // Transform mouse position to character offset (OPPOSITE direction)
    const characterX = useTransform(
        springX,
        [-1, 1],
        [CHARACTER_MAX_OFFSET, -CHARACTER_MAX_OFFSET]
    );
    const characterY = useTransform(
        springY,
        [-1, 1],
        [CHARACTER_MAX_OFFSET * 0.5, -CHARACTER_MAX_OFFSET * 0.5]
    );

    // Detect mobile for conditional loading
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle mouse movement — normalize to [-1, 1] range
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current || isMobile) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize to [-1, 1] relative to container center
            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);

            mouseX.set(Math.max(-1, Math.min(1, normalizedX)));
            mouseY.set(Math.max(-1, Math.min(1, normalizedY)));
        },
        [mouseX, mouseY, isMobile]
    );

    // Reset position when mouse leaves
    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    // ─── Mobile: Static fallback ───
    if (isMobile) {
        return (
            <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[250px]">
                    <Image
                        src={characterSrc}
                        alt={characterAlt}
                        fill
                        priority
                        className="object-contain"
                        sizes="250px"
                    />
                </div>
            </div>
        );
    }

    // ─── Desktop: Full 2.5D Parallax ───
    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                className="relative h-[500px] w-[350px]"
                style={{
                    x: characterX,
                    y: characterY,
                    rotateY: useTransform(springX, [-1, 1], [3, -3]),
                    rotateX: useTransform(springY, [-1, 1], [-2, 2]),
                }}
            >
                <Image
                    src={characterSrc}
                    alt={characterAlt}
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                    sizes="350px"
                />
            </motion.div>
        </div>
    );
}
