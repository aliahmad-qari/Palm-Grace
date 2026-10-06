import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { config } from '../src/server/config.js';
import { db } from '../src/server/db.js';
import { enquiriesRouter } from '../src/server/routes/enquiries.js';
import { memorialsRouter } from '../src/server/routes/memorials.js';
import { getZohoAccessToken, isZohoSelected, safeZohoError, sendZohoMail, ZohoConfigurationError, ZohoMailError, ZohoOAuthError } from '../src/server/services/zohoMailer.js';

test('Zoho REST OAuth and all three notifications use HTTPS, private inbox, and pending moderation', async () => {
  const previous = { ...config.zoho };
  const originalFetch = globalThis.fetch;
  const deliveries: Array<Record<string, unknown>> = [];
  let refreshes = 0;
  const app = express();
  app.use(express.json());
  app.use('/api/enquiries', enquiriesRouter);
  app.use('/api/memorials', memorialsRouter);
  const server = app.listen(0, '127.0.0.1');
  try {
    Object.assign(config.zoho, {
      clientId: 'test-client', clientSecret: 'test-secret', refreshToken: 'test-refresh',
      accountId: '7651386000000008002', accountsUrl: 'https://accounts.zoho.com',
      mailApiUrl: 'https://mail.zoho.com', from: 'care@palmandgrace.org', to: 'care@palmandgrace.org',
    });
    assert.equal(isZohoSelected(), true);
    globalThis.fetch = (async () => new Response(JSON.stringify({ error: 'invalid_code' }), { status: 400 })) as typeof fetch;
    await assert.rejects(getZohoAccessToken(), (error: unknown) => {
      assert.ok(error instanceof ZohoOAuthError);
      assert.match(safeZohoError(error), /Zoho OAuth token exchange failed \(HTTP 400/);
      assert.doesNotMatch(safeZohoError(error), /test-secret|test-refresh/);
      return true;
    });
    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === 'https://accounts.zoho.com/oauth/v2/token') {
        refreshes += 1;
        assert.equal(init?.method, 'POST');
        assert.equal(new URLSearchParams(String(init?.body)).get('grant_type'), 'refresh_token');
        return new Response(JSON.stringify({ access_token: 'test-access-token', expires_in: 3600 }), { status: 200 });
      }
      if (url === 'https://mail.zoho.com/api/accounts/7651386000000008002/messages') {
        assert.equal((init?.headers as Record<string, string>).Authorization, 'Zoho-oauthtoken test-access-token');
        const body = JSON.parse(String(init?.body));
        deliveries.push(body);
        return new Response(JSON.stringify({ status: { code: 200, description: 'success' } }), { status: 200 });
      }
      return originalFetch(input, init);
    }) as typeof fetch;
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const base = `http://127.0.0.1:${address.port}`;
    const post = (path: string, body: object) => originalFetch(`${base}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });

    const family = await post('/api/enquiries/memorial', {
      yourName: 'Test Family', email: 'family@example.test', personName: 'Test Person', hasArrangements: 'planning', website: '',
    });
    assert.equal(family.status, 202);
    const partner = await post('/api/enquiries/partnership', {
      organisationName: 'Test Funeral Home', contactPerson: 'Test Partner', email: 'partner@example.test', website: '',
    });
    assert.equal(partner.status, 202);
    const memorial = await db.findPublicMemorialBySlug('arthur-pendleton');
    assert.ok(memorial);
    const tribute = await post('/api/memorials/arthur-pendleton/tributes', {
      contributorName: 'Test Visitor', contributorEmail: 'visitor@example.test', message: 'A thoughtful memory for testing.', website: '',
    });
    assert.equal(tribute.status, 201);
    const tributeBody = await tribute.json() as { data: { status: string } };
    assert.equal(tributeBody.data.status, 'PENDING');
    assert.equal(deliveries.length, 3);
    assert.equal(refreshes, 1, 'access token should be reused while valid');
    assert.deepEqual(deliveries.map(mail => mail.subject), [
      'Begin a Memorial enquiry — Test Person',
      'Care Partner enquiry — Test Funeral Home',
      `New Tribute awaiting review — ${memorial.preferredDisplayName || memorial.fullName}`,
    ]);
    for (const mail of deliveries) {
      assert.equal(mail.fromAddress, 'care@palmandgrace.org');
      assert.equal(mail.toAddress, 'care@palmandgrace.org');
      assert.equal(mail.mailFormat, 'html');
    }
    assert.match(String(deliveries[0].content), /mailto:family@example\.test/);
    assert.match(String(deliveries[1].content), /mailto:partner@example\.test/);
    assert.match(String(deliveries[2].content), /Pending Review/);
    let rejectedOnce = false;
    globalThis.fetch = (async (input: string | URL | Request) => {
      if (String(input).endsWith('/oauth/v2/token')) {
        refreshes += 1;
        return new Response(JSON.stringify({ access_token: 'refreshed-test-token', expires_in: 3600 }), { status: 200 });
      }
      if (!rejectedOnce) {
        rejectedOnce = true;
        return new Response(JSON.stringify({ status: { code: 401 } }), { status: 200 });
      }
      return new Response(JSON.stringify({ status: { code: 200 } }), { status: 200 });
    }) as typeof fetch;
    await sendZohoMail({ subject: 'Expired token recovery', html: '<p>Test</p>', text: 'Test' });
    assert.equal(refreshes, 2, 'an API-level 401 refreshes the cached token once');
    globalThis.fetch = (async () => new Response(JSON.stringify({ status: { code: 500 } }), { status: 200 })) as typeof fetch;
    await assert.rejects(sendZohoMail({ subject: 'Failure test', html: '<p>Test</p>', text: 'Test' }), (error: unknown) => {
      assert.ok(error instanceof ZohoMailError);
      assert.match(safeZohoError(error), /Zoho Mail API rejected notification/);
      assert.doesNotMatch(safeZohoError(error), /test-access-token/);
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
    Object.assign(config.zoho, previous);
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test('partial Zoho setup fails explicitly', async () => {
  const previous = { ...config.zoho };
  try {
    Object.assign(config.zoho, { clientId: 'partial', clientSecret: '', refreshToken: '', accountId: '', accountsUrl: '', mailApiUrl: '', from: '', to: '' });
    await assert.rejects(getZohoAccessToken(), ZohoConfigurationError);
  } finally {
    Object.assign(config.zoho, previous);
  }
});
