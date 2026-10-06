import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/server/config.js';
import { renderEnquiryEmail } from '../src/server/services/enquiryMailer.js';
import { buildSmtpMessage, isSmtpSelected, safeSmtpError, SmtpConfigurationError } from '../src/server/services/smtpMailer.js';

test('Zoho SMTP message uses configured send-as, shared inbox, and valid visitor Reply-To', () => {
  const previous = { ...config.smtp };
  try {
    Object.assign(config.smtp, {
      host: 'smtppro.zoho.com', port: '465', secure: 'true',
      user: 'shamario@palmandgrace.org', password: 'test-only-placeholder',
      from: 'care@palmandgrace.org', to: 'care@palmandgrace.org',
    });
    assert.equal(isSmtpSelected(), true);
    const message = buildSmtpMessage({
      subject: 'Begin a Memorial enquiry — Example\r\nInjected: no',
      replyTo: 'visitor@example.com', text: 'Private message', html: '<p>Private message</p>',
    });
    assert.deepEqual(message.from, { name: 'Palm & Grace', address: 'care@palmandgrace.org' });
    assert.equal(message.to, 'care@palmandgrace.org');
    assert.equal(message.replyTo, 'visitor@example.com');
    assert.equal(message.subject, 'Begin a Memorial enquiry — Example Injected: no');
    assert.equal(buildSmtpMessage({ subject: 'Test', replyTo: 'invalid', text: 'x', html: 'x' }).replyTo, undefined);
  } finally {
    Object.assign(config.smtp, previous);
  }
});

test('partial SMTP setup fails explicitly without revealing password', () => {
  const previous = { ...config.smtp };
  try {
    Object.assign(config.smtp, { host: 'smtppro.zoho.com', port: '', secure: '', user: '', password: '', from: '', to: '' });
    assert.equal(isSmtpSelected(), true);
    assert.throws(() => buildSmtpMessage({ subject: 'Test', text: 'x', html: 'x' }), SmtpConfigurationError);
    assert.equal(safeSmtpError({ code: 'EAUTH', responseCode: 535, response: 'secret password' }), 'Zoho SMTP delivery failed (EAUTH, SMTP 535)');
  } finally {
    Object.assign(config.smtp, previous);
  }
});

test('tribute notification template escapes private values and states moderation requirement', () => {
  const content = renderEnquiryEmail({
    kind: 'tribute', heading: 'A new tribute awaits review', intro: 'A private memory was submitted.',
    lines: [['Private contributor email', 'visitor@example.com'], ['Memory', '<script>alert(1)</script>']],
  });
  assert.match(content.html, /visitor@example\.com/);
  assert.doesNotMatch(content.html, /<script>/);
  assert.match(content.html, /does not publish it/);
});
