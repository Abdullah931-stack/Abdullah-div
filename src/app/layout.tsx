import type { Metadata } from "next";
import "@/app/globals.css";
import { readexPro, plusJakartaSans } from "@/app/fonts";

/**
 * Root layout — required by Next.js 16.
 * Must contain <html> and <body> tags.
 * Locale-specific attributes (lang, dir) are set in [locale]/layout.tsx.
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Abdullah",
    default: "Abdullah — Advanced Personal Page",
  },
  description:
    "A professional digital identity showcasing projects, career journey, and visitor engagement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="dark" suppressHydrationWarning>
      <body
        className={`${readexPro.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
