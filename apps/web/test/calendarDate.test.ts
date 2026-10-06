import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarYear, formatCalendarDate } from '../src/lib/calendarDate.js';

test('memorial calendar dates remain the entered day in a western timezone', () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    assert.equal(formatCalendarDate('1956-04-16T00:00:00.000Z'), '16 April 1956');
    assert.equal(formatCalendarDate('2024-03-19T00:00:00.000Z'), '19 March 2024');
    assert.equal(formatCalendarDate('2020-09-08T00:00:00.000Z'), '8 September 2020');
    assert.equal(formatCalendarDate('2020-04-10T00:00:00.000Z'), '10 April 2020');
    assert.equal(calendarYear('1956-04-16T00:00:00.000Z'), '1956');
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
