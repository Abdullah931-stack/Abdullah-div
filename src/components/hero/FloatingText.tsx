"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

/**
 * Floating Text Component — Hero Section
 * Text "floats" with a subtle Y-axis animation (per 05-ANIMATION-SPEC.md)
 *
 * Used for the "greeting + name + role" in the hero section foreground layer.
 */
interface FloatingTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function FloatingText({
    children,
    delay = 0,
    className = "",
}: FloatingTextProps) {
    const controls = useAnimationControls();

    useEffect(() => {
        controls.start({
            y: [0, -8, 0],
            transition: {
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay,
            },
        });
    }, [controls, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay * 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
