import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveDateAliases, resolveServiceFields } from '../src/server/memorialPayload.js';

test('date-only admin inputs are stored as the same UTC calendar day', () => {
  const dates = resolveDateAliases({ birthDate: '1956-04-16', deathDate: '2024-03-19' }, true);
  assert.equal(dates.birthDate?.toISOString(), '1956-04-16T00:00:00.000Z');
  assert.equal(dates.dateOfBirth?.toISOString(), '1956-04-16T00:00:00.000Z');
  assert.equal(dates.deathDate?.toISOString(), '2024-03-19T00:00:00.000Z');
  assert.equal(dates.dateOfPassing?.toISOString(), '2024-03-19T00:00:00.000Z');

  const service = resolveServiceFields({ serviceDate: '2024-04-06', serviceTime: '11:00' });
  assert.equal(service.serviceDate?.toISOString(), '2024-04-06T00:00:00.000Z');
});
