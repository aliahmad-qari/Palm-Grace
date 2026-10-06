import { renderEnquiryEmail } from '../server/services/enquiryMailer.js';
import { safeSmtpError, sendSmtpEmail, verifySmtpTransport } from '../server/services/smtpMailer.js';

async function main() {
  try {
    await verifySmtpTransport();
    console.log('Zoho SMTP transport verification succeeded.');

    if (process.argv.includes('--send')) {
      const content = renderEnquiryEmail({
        kind: 'test',
        heading: 'Zoho SMTP integration test',
        intro: 'This test confirms that the Palm & Grace website can deliver through the configured Zoho SMTP account.',
        lines: [['Result', 'Zoho SMTP test message']],
      });
      await sendSmtpEmail({
        subject: 'Palm & Grace — Zoho SMTP Integration Test',
        text: content.text,
        html: content.html,
      });
      console.log('Zoho SMTP test message was accepted for delivery. Check the configured MAIL_TO inbox.');
    } else {
      console.log('No message was sent. Add --send to perform the inbox delivery test.');
    }
  } catch (error) {
    console.error('Zoho SMTP test failed:', safeSmtpError(error));
    process.exitCode = 1;
  }
}

void main();
