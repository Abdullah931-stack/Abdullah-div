import { Resend } from "resend";

/**
 * Resend email client instance.
 * Used for forwarding Smart Contact Form messages to the site owner.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Owner email address — destination for forwarded messages.
 */
export const OWNER_EMAIL = process.env.OWNER_EMAIL || "";
