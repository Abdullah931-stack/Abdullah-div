import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import { prisma } from "@/lib/prisma";

/**
 * Project Detail Page — Individual Project View
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Full project info: title, body, images gallery, skills, build time
 * - Story-driven layout
 */
interface ProjectPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const project = await prisma.project.findUnique({
        where: { slug, isPublished: true },
        include: {
            images: { orderBy: { order: "asc" } },
        },
    });

    if (!project) {
        notFound();
    }

    return <ProjectDetail project={project} />;
}

