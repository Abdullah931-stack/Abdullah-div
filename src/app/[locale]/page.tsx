import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/hero/HeroSection";
import CardShuffle from "@/components/home/CardShuffle";
import { prisma } from "@/lib/prisma";

/**
 * Home Page — "The Hook"
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Hero Section: About Me + 2.5D Character
 * - Card Shuffle: Featured Projects
 */
interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch featured published projects
    const featuredProjects = await prisma.project.findMany({
        where: { isPublished: true, isFeatured: true },
        include: {
            images: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
    });

    return (
        <>
            {/* Hero Section — 2.5D Parallax + Floating Text */}
            <HeroSection />

            {/* Card Shuffle Section — Featured Projects */}
            {featuredProjects.length > 0 && (
                <section id="projects" className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <CardShuffle projects={featuredProjects} />
                    </div>
                </section>
            )}
        </>
    );
}

