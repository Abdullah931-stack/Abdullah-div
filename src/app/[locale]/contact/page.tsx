import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";

/**
 * Contact Page — "Start Your Project"
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Smart Contact Form with Glassmorphism design
 * - Fields: Name, Email, Service Type, Budget, Details
 * - "Start Project 🚀" button
 */
interface ContactPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("contact");

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

                {/* Contact Form */}
                <ContactForm />
            </div>
        </section>
    );
}
