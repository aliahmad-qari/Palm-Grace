import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { publicContactEmail, publicContactPhoneDisplay, publicContactPhoneHref } from '../../lib/publicContact.js';

const contact = <a className="font-semibold text-brand-primary underline underline-offset-4" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>;

function PolicyShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <PublicLayout><article className="min-h-screen bg-brand-white px-4 pb-20 pt-36 text-brand-charcoal sm:px-6"><div className="mx-auto max-w-3xl space-y-8"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-secondary">Palm &amp; Grace Memorials</p><h1 className="mt-3 font-serif text-4xl text-brand-primary sm:text-5xl">{title}</h1><p className="mt-3 text-sm text-brand-charcoal/65">Last updated 6 October 2026</p></div><div className="space-y-7 text-base leading-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-brand-primary [&_h2]:mb-2 [&_a]:break-words">{children}</div></div></article></PublicLayout>;
}

export const PrivacyNoticePage: React.FC = () => <PolicyShell title="Privacy Notice">
  <p>We understand that memorial information is personal. This notice explains what Palm &amp; Grace receives through this website and what visitors may see publicly.</p>
  <section><h2>Information we receive</h2><p>Family and Care Partner enquiries include the contact and arrangement details you choose to send. A submitted memory includes your name, optional relationship, message and any optional email address. Families and administrators may provide memorial stories, photographs, videos, dates and service details. Administrator sign-in uses an authentication cookie and a token stored in the administrator's browser.</p></section>
  <section><h2>How it is used</h2><p>We use enquiry details to respond and arrange memorial services. We use memorial material to prepare and display the requested memorial. Submitted memories are reviewed by Palm &amp; Grace administrators before any approval for public display. We also use necessary technical information to keep the site secure and working.</p></section>
  <section><h2>What is public</h2><p>Published memorial pages and approved memories can be viewed by anyone with the page address, and a published memorial may appear in the directory. An approved memory may show your name, relationship and message. Your contributor email is kept private and is not displayed through the public memorial API. Draft, Private Preview and Archived memorials are not available as public pages; administrators can review them in the admin preview.</p></section>
  <section><h2>Service providers</h2><p>The website uses Vercel and Render for hosting, PostgreSQL for memorial records, Cloudinary for uploaded media and Brevo for enquiry email delivery. Information may be processed by these providers outside your country. We do not publish enquiry submissions on the website.</p></section>
  <section><h2>Questions and corrections</h2><p>For questions about information held in a memorial, a correction, or a request to remove a memory, email {contact}. We will review the request with the people responsible for the memorial. Retention depends on the memorial and the purpose for which information was provided; please contact us about a specific record.</p></section>
  <p>For respectful use of this website, please also read our <Link to="/terms" className="font-semibold text-brand-primary underline underline-offset-4">Terms of Use</Link>.</p>
</PolicyShell>;

export const TermsOfUsePage: React.FC = () => <PolicyShell title="Terms of Use">
  <p>Palm &amp; Grace provides a place to remember people through stories, photographs, service information and shared memories. Please use the site with care for the families and people represented here.</p>
  <section><h2>Sharing a memory</h2><p>Only submit words or media you have permission to share. Do not include someone else's private contact details, harmful material, impersonation or content that infringes another person's rights. Submitted memories are reviewed by Palm &amp; Grace administrators and may be approved, declined or removed to protect the memorial space.</p></section>
  <section><h2>Memorial information</h2><p>Memorial content is provided by families and authorised administrators. If you believe a date, name, photograph or service detail is inaccurate, contact us so it can be checked. Service, livestream and recording availability may depend on external providers; where a recording cannot play on this site, a link may open it with that provider.</p></section>
  <section><h2>Links and access</h2><p>A published memorial link or QR code can be shared. Draft, Private Preview and Archived memorials are not publicly accessible. Please do not try to access administrative areas without authorisation or interfere with the site or other visitors.</p></section>
  <section><h2>Contact</h2><p>Questions about these terms or a memorial can be sent to {contact} or by telephone/WhatsApp at <a href={publicContactPhoneHref} className="font-semibold text-brand-primary underline underline-offset-4">{publicContactPhoneDisplay}</a>. Read our <Link to="/privacy" className="font-semibold text-brand-primary underline underline-offset-4">Privacy Notice</Link> to understand how submitted information is handled.</p></section>
</PolicyShell>;
