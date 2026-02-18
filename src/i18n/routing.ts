import { defineRouting } from "next-intl/routing";

/**
 * i18n routing configuration.
 * Defines supported locales and default locale.
 */
export const routing = defineRouting({
    locales: ["ar", "en"],
    defaultLocale: "ar",
});

export type Locale = (typeof routing.locales)[number];
