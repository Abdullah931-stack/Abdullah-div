import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import PortfolioList from "@/components/portfolio/PortfolioList";
import { prisma } from "@/lib/prisma";

/**
 * Portfolio Page — Projects List
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Grid of project cards
 * - Hover effects with subtle scale
 * - Links to individual project detail pages
 */
interface PortfolioPageProps {
    params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("projects");

    // Fetch published projects directly from DB (server component)
    const projects = await prisma.project.findMany({
        where: { isPublished: true },
        include: {
            images: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
    });

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("title")}</h1>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Projects Grid */}
                <PortfolioList projects={projects} />
            </div>
        </section>
    );
}

