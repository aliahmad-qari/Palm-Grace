import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { configureCors } from '../src/server/middleware/cors.js';

test('production Palm & Grace domains pass CORS preflight with credentials', async () => {
  const app = express();
  app.use(configureCors());
  app.post('/api/enquiries/partnership', (_req, res) => res.sendStatus(202));
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    for (const origin of ['https://www.palmandgrace.org', 'https://palmandgrace.org']) {
      const response = await fetch(`http://127.0.0.1:${address.port}/api/enquiries/partnership`, {
        method: 'OPTIONS',
        headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' },
      });
      assert.equal(response.status, 204);
      assert.equal(response.headers.get('access-control-allow-origin'), origin);
      assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
    }
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
