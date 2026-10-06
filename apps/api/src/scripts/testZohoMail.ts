import { renderEnquiryEmail } from '../server/services/enquiryMailer.js';
import { safeZohoError, sendZohoMail } from '../server/services/zohoMailer.js';

async function main() {
  const content = renderEnquiryEmail({
    kind: 'test',
    heading: 'Zoho Mail REST API integration test',
    intro: 'This private test checks Palm & Grace website notification delivery over HTTPS.',
    lines: [['Result', 'Zoho Mail REST API test message']],
  });
  try {
    await sendZohoMail({ subject: 'Palm & Grace — Zoho Mail API Integration Test', text: content.text, html: content.html });
    console.log('Zoho Mail API accepted the test message. Confirm receipt in the configured ZOHO_TO_EMAIL inbox.');
  } catch (error) {
    console.error('Zoho Mail API test failed:', safeZohoError(error));
    process.exitCode = 1;
  }
}

void main();
