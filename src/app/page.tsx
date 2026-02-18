/**
 * Root page — redirects to the default locale.
 * This file handles the base "/" route.
 * The actual content is served from /[locale]/page.tsx
 */
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
