/**
 * Transactional Email Service
 * 
 * Interacts with the Resend API to deliver post-action secure communication,
 * such as alerting the user of an account deletion or password change.
 * Uses native fetch to minimize dependency weight on the backend.
 */
const RESEND_API_URL = "https://api.resend.com/emails";

function buildMessage(type) {
  if (type === "password_changed") {
    return {
      subject: "Your Travelyx password was updated",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#10233f">
          <h2 style="margin-bottom:8px;">Password updated</h2>
          <p>Your Travelyx account password was changed successfully.</p>
          <p>If you made this change, no further action is needed.</p>
          <p>If this was not you, reset your password immediately and review your account access.</p>
        </div>
      `,
    };
  }

  if (type === "account_deleted") {
    return {
      subject: "Your Travelyx account was deleted",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#10233f">
          <h2 style="margin-bottom:8px;">Account deleted</h2>
          <p>Your Travelyx account and related saved travel data were deleted successfully.</p>
          <p>If you did not request this, contact support immediately.</p>
        </div>
      `,
    };
  }

  return null;
}

export async function sendTransactionalEmail({ to, type }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const template = buildMessage(type);

  if (!apiKey || !from || !template || !to) {
    return { sent: false, reason: "missing_configuration" };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: template.subject,
      html: template.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Transactional email failed:", body);
    return { sent: false, reason: "provider_error" };
  }

  return { sent: true };
}
