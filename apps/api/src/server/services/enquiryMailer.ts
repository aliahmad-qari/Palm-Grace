import { config } from '../config.js';

type EnquiryDelivery = {
  to: string;
  subject: string;
  replyTo: string;
  lines: Array<[string, string | null | undefined]>;
};

export class EnquiryDeliveryError extends Error {}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] || character);
}

export async function sendEnquiryEmail(delivery: EnquiryDelivery): Promise<void> {
  const { resendApiKey, fromEmail } = config.enquiries;
  if (!resendApiKey || !fromEmail || !delivery.to) {
    throw new EnquiryDeliveryError('Enquiry email delivery is not configured');
  }

  const visibleLines = delivery.lines.filter(([, value]) => value);
  const text = visibleLines.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = visibleLines
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(String(value)).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [delivery.to],
      reply_to: delivery.replyTo,
      subject: delivery.subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new EnquiryDeliveryError(`Enquiry provider returned ${response.status}`);
  }
}
