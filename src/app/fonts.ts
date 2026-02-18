import { Readex_Pro, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Arabic font — Readex Pro
 * Used for all Arabic text content
 * display: 'swap' prevents FOIT (Flash of Invisible Text)
 */
export const readexPro = Readex_Pro({
    subsets: ["arabic", "latin"],
    variable: "--font-readex-pro",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});

/**
 * English font — Plus Jakarta Sans
 * Used for all English text content
 * display: 'swap' prevents FOIT (Flash of Invisible Text)
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});
