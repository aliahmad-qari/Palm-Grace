import nodemailer, { type SendMailOptions } from 'nodemailer';
import { z } from 'zod';
import { config } from '../config.js';

export type WebsiteEmail = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string | null;
};

export class SmtpConfigurationError extends Error {}
export class SmtpDeliveryError extends Error {}

/** A partial SMTP rollout must fail visibly, rather than silently using Brevo. */
export function isSmtpSelected(): boolean {
  return Object.values(config.smtp).some(value => String(value).trim() !== '');
}

function smtpSettings() {
  const smtp = config.smtp;
  const missing = Object.entries({
    SMTP_HOST: smtp.host,
    SMTP_PORT: smtp.port,
    SMTP_SECURE: smtp.secure,
    SMTP_USER: smtp.user,
    SMTP_PASSWORD: smtp.password,
    MAIL_FROM: smtp.from,
    MAIL_TO: smtp.to,
  }).filter(([, value]) => !String(value).trim()).map(([name]) => name);
  if (missing.length) throw new SmtpConfigurationError(`SMTP configuration is incomplete: ${missing.join(', ')}`);

  const port = Number(smtp.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new SmtpConfigurationError('SMTP_PORT must be a valid port');
  if (smtp.secure !== 'true' && smtp.secure !== 'false') throw new SmtpConfigurationError('SMTP_SECURE must be true or false');
  const secure = smtp.secure === 'true';
  if (port === 465 && !secure) throw new SmtpConfigurationError('SMTP_SECURE must be true for port 465');
  if (!z.string().email().safeParse(smtp.user).success) throw new SmtpConfigurationError('SMTP_USER must be an email address');
  if (!z.string().email().safeParse(smtp.from).success) throw new SmtpConfigurationError('MAIL_FROM must be an email address');
  if (!z.string().email().safeParse(smtp.to).success) throw new SmtpConfigurationError('MAIL_TO must be an email address');

  return { ...smtp, port, secure };
}

function createSmtpTransport() {
  const smtp = smtpSettings();
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: !smtp.secure,
    auth: { user: smtp.user, pass: smtp.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export function buildSmtpMessage(email: WebsiteEmail): SendMailOptions {
  const smtp = smtpSettings();
  const replyTo = email.replyTo?.trim();
  return {
    from: { name: 'Palm & Grace', address: smtp.from },
    to: smtp.to,
    ...(replyTo && z.string().email().safeParse(replyTo).success ? { replyTo } : {}),
    subject: email.subject.replace(/[\r\n]+/g, ' ').trim(),
    text: email.text,
    html: email.html,
  };
}

/** Never include a provider's raw error text: it can contain SMTP commands or addresses. */
export function safeSmtpError(error: unknown): string {
  if (error instanceof SmtpConfigurationError || error instanceof SmtpDeliveryError) return error.message;
  const details = error && typeof error === 'object' ? error as { code?: unknown; responseCode?: unknown } : {};
  const code = typeof details.code === 'string' && /^[A-Z0-9_]{2,32}$/.test(details.code) ? details.code : 'UNKNOWN';
  const responseCode = typeof details.responseCode === 'number' && details.responseCode >= 400 && details.responseCode <= 599
    ? `, SMTP ${details.responseCode}` : '';
  return `Zoho SMTP delivery failed (${code}${responseCode})`;
}

export async function verifySmtpTransport(): Promise<void> {
  const transport = createSmtpTransport();
  try {
    await transport.verify();
  } catch (error) {
    throw new SmtpDeliveryError(safeSmtpError(error));
  } finally {
    transport.close();
  }
}

export async function sendSmtpEmail(email: WebsiteEmail): Promise<void> {
  const message = buildSmtpMessage(email);
  const transport = createSmtpTransport();
  try {
    const result = await transport.sendMail(message);
    if (result.rejected?.length) throw new SmtpDeliveryError('Zoho SMTP rejected the notification recipient');
  } catch (error) {
    throw new SmtpDeliveryError(safeSmtpError(error));
  } finally {
    transport.close();
  }
}
