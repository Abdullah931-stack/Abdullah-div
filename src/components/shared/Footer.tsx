import { prisma } from "@/lib/prisma";
import FooterClient from "@/components/shared/FooterClient";

/**
 * Footer — Server Component
 * Fetches social links from DB and passes to client component.
 */
export default async function Footer() {
    const socialLinks = await prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    return <FooterClient socialLinks={socialLinks} />;
}
