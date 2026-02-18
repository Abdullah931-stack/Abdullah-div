import type { MessageInput } from "@/types";

/**
 * Generates an HTML email template for a new contact form message.
 * Contains all message details to help the owner make accept/reject decisions.
 */
export function generateContactEmailHtml(message: MessageInput): string {
    const isArabic = message.locale === "ar";
    const dir = isArabic ? "rtl" : "ltr";

    return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${message.locale}">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
          direction: ${dir};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, hsl(150, 25%, 35%), hsl(150, 35%, 45%));
          color: white;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 20px;
        }
        .body {
          padding: 24px;
        }
        .field {
          margin-bottom: 16px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .field-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .field-value {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }
        .message-body {
          white-space: pre-wrap;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isArabic ? "📬 رسالة جديدة من موقعك الشخصي" : "📬 New Message from Your Portfolio"}</h1>
        </div>
        <div class="body">
          <div class="field">
            <div class="field-label">${isArabic ? "الاسم" : "Name"}</div>
            <div class="field-value">${message.senderName}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "البريد الإلكتروني" : "Email"}</div>
            <div class="field-value">${message.senderEmail}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "نوع الخدمة" : "Service Type"}</div>
            <div class="field-value">${message.serviceType}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "الميزانية" : "Budget"}</div>
            <div class="field-value">${message.budget}</div>
          </div>
          <div class="field">
            <div class="field-label">${isArabic ? "تفاصيل الرسالة" : "Message Details"}</div>
            <div class="field-value message-body">${message.body}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates the email subject line for a contact form message.
 */
export function generateContactEmailSubject(message: MessageInput): string {
    return `🚀 New Project Request: ${message.serviceType} — ${message.budget} | ${message.senderName}`;
}
