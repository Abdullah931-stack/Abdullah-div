import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * next-intl request configuration.
 * Loads the appropriate translation file based on the requested locale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
    // Validate that the incoming locale is supported
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`@/messages/${locale}.json`)).default,
    };
});
