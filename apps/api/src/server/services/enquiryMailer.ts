import { config } from '../config.js';

type EnquiryDelivery = {
  to: string;
  subject: string;
  replyTo: string;
  heading: string;
  intro: string;
  lines: Array<[string, string | null | undefined]>;
};

export class EnquiryDeliveryError extends Error {}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] || character);
}

function parseMailbox(value: string): { email: string; name?: string } | null {
  const match = value.trim().match(/^(?:(.*?)\s*<)?([^<>\s]+@[^<>\s]+)>?$/);
  if (!match) return null;
  const name = match[1]?.trim().replace(/^['"]|['"]$/g, '');
  return { email: match[2], ...(name ? { name } : {}) };
}

export function renderEnquiryEmail(delivery: EnquiryDelivery): { text: string; html: string } {
  const visibleLines = delivery.lines.filter(([, value]) => value != null && String(value).trim() !== '');
  const text = [
    delivery.heading,
    delivery.intro,
    '',
    ...visibleLines.map(([label, value]) => `${label}: ${value}`),
    '',
    'This message contains personal information submitted privately to Palm & Grace. Please handle it with care.',
  ].join('\n');

  const rows = visibleLines.map(([label, value], index) => `
    <tr>
      <td style="padding:14px 16px;${index ? 'border-top:1px solid #E7E1D6;' : ''}width:34%;vertical-align:top;color:#495C40;font:600 12px/1.5 Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(label)}</td>
      <td style="padding:14px 16px;${index ? 'border-top:1px solid #E7E1D6;' : ''}vertical-align:top;color:#333333;font:400 15px/1.65 Arial,sans-serif;overflow-wrap:anywhere;">${escapeHtml(String(value)).replace(/\n/g, '<br>')}</td>
    </tr>`).join('');

  const html = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#F4F1EA;padding:0;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(delivery.intro)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F1EA;">
      <tr><td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#FFFFFF;border:1px solid #DED5C3;">
          <tr><td align="center" style="background:#CFD0CF;padding:22px 24px;border-bottom:4px solid #C6A565;">
            <img src="${escapeHtml(config.enquiries.logoUrl)}" width="250" alt="Palm &amp; Grace Memorials" style="display:block;width:100%;max-width:250px;height:auto;border:0;">
          </td></tr>
          <tr><td style="padding:34px 32px 20px;background:#2B4333;color:#FFFFFF;">
            <div style="margin-bottom:9px;color:#EDD39A;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;">Private enquiry</div>
            <h1 style="margin:0;font:400 32px/1.15 Georgia,serif;color:#FFFFFF;">${escapeHtml(delivery.heading)}</h1>
            <p style="margin:14px 0 0;color:#FFFFFF;font:400 15px/1.7 Arial,sans-serif;opacity:.88;">${escapeHtml(delivery.intro)}</p>
          </td></tr>
          <tr><td style="padding:26px 24px 12px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E7E1D6;background:#FFFEFB;">${rows}</table></td></tr>
          <tr><td style="padding:16px 32px 30px;color:#6B6B66;font:400 12px/1.6 Arial,sans-serif;">This email contains information submitted privately to Palm & Grace. Please do not forward or publish it. Replying to this email will respond directly to the enquirer.</td></tr>
          <tr><td style="background:#2B4333;padding:18px 24px;text-align:center;color:#EDD39A;font:500 11px/1.5 Arial,sans-serif;letter-spacing:.08em;">HONOURING LIVES. PRESERVING LEGACIES.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

async function sendWithBrevo(delivery: EnquiryDelivery, text: string, html: string): Promise<void> {
  const requestBody = JSON.stringify({
    sender: { email: config.enquiries.brevoSenderEmail, name: config.enquiries.brevoSenderName },
    to: [{ email: delivery.to }],
    replyTo: { email: delivery.replyTo },
    subject: delivery.subject,
    textContent: text,
    htmlContent: html,
    tags: ['palm-grace', 'public-enquiry'],
  });

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': config.enquiries.brevoApiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: requestBody,
      signal: AbortSignal.timeout(15_000),
    });
    if (response.ok) return;

    const providerMessage = (await response.text()).slice(0, 500).replace(/\s+/g, ' ').trim();
    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt === 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    throw new EnquiryDeliveryError(`Brevo returned ${response.status}${providerMessage ? `: ${providerMessage}` : ''}`);
  }
}

async function sendWithResend(delivery: EnquiryDelivery, text: string, html: string): Promise<void> {
  const from = parseMailbox(config.enquiries.fromEmail);
  if (!config.enquiries.resendApiKey || !from) throw new EnquiryDeliveryError('Legacy email delivery is not configured');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.enquiries.resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.enquiries.fromEmail, to: [delivery.to], reply_to: delivery.replyTo, subject: delivery.subject, text, html }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new EnquiryDeliveryError(`Legacy email provider returned ${response.status}`);
}

export async function sendEnquiryEmail(delivery: EnquiryDelivery): Promise<void> {
  if (!delivery.to) throw new EnquiryDeliveryError('Enquiry destination is not configured');
  const { text, html } = renderEnquiryEmail(delivery);

  if (config.enquiries.brevoApiKey) {
    if (!config.enquiries.brevoSenderEmail) throw new EnquiryDeliveryError('Brevo sender email is not configured');
    try {
      await sendWithBrevo(delivery, text, html);
      return;
    } catch (error) {
      // If a legacy provider is deliberately configured, keep enquiries
      // deliverable during a transient Brevo outage.
      if (!config.enquiries.resendApiKey || !parseMailbox(config.enquiries.fromEmail)) throw error;
      console.warn('[Enquiry email] Brevo failed; using configured fallback provider.');
    }
  }
  await sendWithResend(delivery, text, html);
}
