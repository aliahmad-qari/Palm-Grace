import { z } from 'zod';
import { config } from '../config.js';

export type ZohoEmail = { subject: string; html: string; text: string };
export class ZohoConfigurationError extends Error {}
export class ZohoOAuthError extends Error {}
export class ZohoMailError extends Error {}

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

export function isZohoSelected(): boolean {
  return Object.values(config.zoho).some(value => String(value).trim() !== '');
}

function settings() {
  const fields = {
    ZOHO_CLIENT_ID: config.zoho.clientId,
    ZOHO_CLIENT_SECRET: config.zoho.clientSecret,
    ZOHO_REFRESH_TOKEN: config.zoho.refreshToken,
    ZOHO_ACCOUNT_ID: config.zoho.accountId,
    ZOHO_ACCOUNTS_URL: config.zoho.accountsUrl,
    ZOHO_MAIL_API_URL: config.zoho.mailApiUrl,
    ZOHO_FROM_EMAIL: config.zoho.from,
    ZOHO_TO_EMAIL: config.zoho.to,
  };
  const missing = Object.entries(fields).filter(([, value]) => !value.trim()).map(([key]) => key);
  if (missing.length) throw new ZohoConfigurationError(`Zoho Mail configuration incomplete: ${missing.join(', ')}`);
  if (!/^\d+$/.test(config.zoho.accountId)) throw new ZohoConfigurationError('ZOHO_ACCOUNT_ID must be numeric');
  for (const [name, value] of [['ZOHO_FROM_EMAIL', config.zoho.from], ['ZOHO_TO_EMAIL', config.zoho.to]]) {
    if (!z.string().email().safeParse(value).success) throw new ZohoConfigurationError(`${name} must be an email address`);
  }
  for (const [name, value] of [['ZOHO_ACCOUNTS_URL', config.zoho.accountsUrl], ['ZOHO_MAIL_API_URL', config.zoho.mailApiUrl]]) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || !/^([a-z0-9-]+\.)*zoho\.(com|eu|in|com\.au|jp|ae|sa|com\.cn)$|^mail\.zohocloud\.ca$/i.test(url.hostname)) throw new Error('Invalid Zoho endpoint');
    } catch {
      throw new ZohoConfigurationError(`${name} must be a Zoho HTTPS origin`);
    }
  }
  return config.zoho;
}

function safeCode(value: unknown): string {
  return typeof value === 'string' && /^[A-Z0-9_]{2,32}$/.test(value) ? value : 'UNKNOWN';
}

export function safeZohoError(error: unknown): string {
  if (error instanceof ZohoConfigurationError || error instanceof ZohoOAuthError || error instanceof ZohoMailError) return error.message;
  const code = error && typeof error === 'object' ? (error as { code?: unknown }).code : undefined;
  return `Zoho Mail request failed (${safeCode(code)})`;
}

async function requestAccessToken(): Promise<string> {
  const zoho = settings();
  let response: Response;
  try {
    response = await fetch(`${zoho.accountsUrl}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ client_id: zoho.clientId, client_secret: zoho.clientSecret, refresh_token: zoho.refreshToken, grant_type: 'refresh_token' }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new ZohoOAuthError(`Zoho OAuth connection failed (${safeCode((error as { code?: unknown })?.code)})`);
  }
  let data: { access_token?: unknown; expires_in?: unknown; error?: unknown };
  try {
    const parsed: unknown = await response.json();
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid OAuth response');
    data = parsed as typeof data;
  } catch { throw new ZohoOAuthError(`Zoho OAuth returned invalid JSON (HTTP ${response.status})`); }
  if (!response.ok || typeof data.access_token !== 'string' || !data.access_token) {
    throw new ZohoOAuthError(`Zoho OAuth token exchange failed (HTTP ${response.status}, ${safeCode(data.error)})`);
  }
  const lifetime = Number(data.expires_in);
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (Number.isFinite(lifetime) && lifetime > 60 ? lifetime - 60 : 300) * 1000 };
  return data.access_token;
}

export async function getZohoAccessToken(): Promise<string> {
  settings();
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  if (!pendingToken) pendingToken = requestAccessToken().finally(() => { pendingToken = null; });
  return pendingToken;
}

export async function sendZohoMail(email: ZohoEmail): Promise<void> {
  await sendZohoMailAttempt(email, true);
}

async function sendZohoMailAttempt(email: ZohoEmail, mayRetryAuth: boolean): Promise<void> {
  const zoho = settings();
  const token = await getZohoAccessToken();
  const body = {
    fromAddress: zoho.from,
    toAddress: zoho.to,
    subject: email.subject.replace(/[\r\n]+/g, ' ').trim(),
    content: email.html,
    mailFormat: 'html',
  };
  let response: Response;
  try {
    response = await fetch(`${zoho.mailApiUrl}/api/accounts/${zoho.accountId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new ZohoMailError(`Zoho Mail API connection failed (${safeCode((error as { code?: unknown })?.code)})`);
  }
  let data: { status?: { code?: unknown } };
  try {
    const parsed: unknown = await response.json();
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid Mail API response');
    data = parsed as typeof data;
  } catch { throw new ZohoMailError(`Zoho Mail API returned invalid JSON (HTTP ${response.status})`); }
  const status = Number(data.status?.code);
  if (!response.ok || status !== 200) {
    if (response.status === 401 || status === 401) {
      cachedToken = null;
      if (mayRetryAuth) return sendZohoMailAttempt(email, false);
    }
    throw new ZohoMailError(`Zoho Mail API rejected notification (HTTP ${response.status}, status ${Number.isFinite(status) ? status : 'unknown'})`);
  }
}
