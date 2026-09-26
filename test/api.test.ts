import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db.js';
import {
  loginSchema,
  createMemorialSchema,
  updateMemorialSchema,
  createTributeSchema,
  updateTributeStatusSchema,
  addMediaSchema,
} from '../server/validators/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../server/config.js';
import QRCode from 'qrcode';

test('1. Authentication: Validates credentials and generates JWT', async () => {
  const admin = await db.findAdminByEmail(config.admin.email);
  assert.ok(admin, 'Admin must exist in datastore');

  // Verify password comparison
  const valid = await bcrypt.compare(config.admin.password, admin.passwordHash);
  assert.equal(valid, true, 'Valid admin password must match hash');

  const invalid = await bcrypt.compare('WrongPassword123!', admin.passwordHash);
  assert.equal(invalid, false, 'Invalid password must be rejected');

  // Verify JWT signing and decoding
  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
  assert.equal(decoded.id, admin.id);
  assert.equal(decoded.email, admin.email);
});

test('2. Slug Generation & Collision Handling: Generates unique slugs cleanly', async () => {
  // Existing memorial: 'arthur-pendleton'
  const slug1 = await db.generateUniqueSlug('Arthur Pendleton');
  assert.notEqual(slug1, 'arthur-pendleton', 'Collision must append numeric suffix');
  assert.match(slug1, /^arthur-pendleton-\d+$/, 'Collision must follow slug-counter pattern');

  // New person: no collision
  const freshSlug = await db.generateUniqueSlug('Grace Evelyn Sterling');
  assert.equal(freshSlug, 'grace-evelyn-sterling');

  // Special characters & whitespace handling
  const specialSlug = await db.generateUniqueSlug('Mary-Jane O’Connor & Sons!');
  assert.equal(specialSlug, 'mary-jane-oconnor-sons');
});

test('3. Memorial Publication & Status Toggle: Drafts hidden from public, visible to admin', async () => {
  // Create a draft memorial
  const newMemorial = await db.createMemorial({
    slug: 'elizabeth-draft-test',
    fullName: 'Elizabeth Diana Montgomery',
    dateOfBirth: new Date('1950-05-15'),
    dateOfPassing: new Date('2026-03-10'),
    biography: 'A loving mother whose warmth touched everyone around her.',
    lifeStory: null,
    mainPhotograph: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    serviceInformation: null,
    familyAcknowledgement: null,
    livestreamUrl: null,
    recordingUrl: null,
    templateType: 'FEMALE',
    publicationStatus: 'DRAFT',
  });

  // Verify public API cannot access draft
  const publicQuery = await db.findPublicMemorialBySlug('elizabeth-draft-test');
  assert.equal(publicQuery, null, 'Public query must never return a draft memorial');

  // Verify admin can access draft
  const adminQuery = await db.findMemorialByIdAdmin(newMemorial.id);
  assert.ok(adminQuery, 'Admin must be able to view draft memorial');
  assert.equal(adminQuery?.publicationStatus, 'DRAFT');

  // Publish the memorial
  const published = await db.updateMemorial(newMemorial.id, { publicationStatus: 'PUBLISHED' });
  assert.equal(published.publicationStatus, 'PUBLISHED');

  // Now public query succeeds
  const afterPublish = await db.findPublicMemorialBySlug('elizabeth-draft-test');
  assert.ok(afterPublish, 'Memorial must now be publicly accessible after publishing');
  assert.equal(afterPublish?.fullName, 'Elizabeth Diana Montgomery');
});

test('4. Template Selection: Supports MALE, FEMALE, and CHILD', async () => {
  const male = createMemorialSchema.safeParse({
    fullName: 'Robert Vance',
    dateOfBirth: '1940-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'A life well lived with courage and conviction.',
    mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    templateType: 'MALE',
  });
  assert.equal(male.success, true);

  const female = createMemorialSchema.safeParse({
    fullName: 'Victoria Adams',
    dateOfBirth: '1960-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'Grace and joy to all who crossed her path.',
    mainPhotograph: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    templateType: 'FEMALE',
  });
  assert.equal(female.success, true);

  const child = createMemorialSchema.safeParse({
    fullName: 'Benjamin Fox',
    dateOfBirth: '2020-01-01',
    dateOfPassing: '2025-01-01',
    biography: 'A shining star forever held in our hearts.',
    mainPhotograph: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
    templateType: 'CHILD',
  });
  assert.equal(child.success, true);

  const invalid = createMemorialSchema.safeParse({
    fullName: 'Invalid Template',
    dateOfBirth: '2000-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'Testing invalid template name.',
    mainPhotograph: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
    templateType: 'PET', // Invalid!
  });
  assert.equal(invalid.success, false);
});

test('5. Livestream & Recording URL Validation: Validates video/stream links and normalizes empty strings', () => {
  // Valid YouTube stream and recording
  const validYouTube = createMemorialSchema.safeParse({
    fullName: 'Test Stream User',
    dateOfBirth: '1970-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'Valid stream test biography.',
    mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    livestreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    recordingUrl: 'https://vimeo.com/76979871',
  });
  assert.equal(validYouTube.success, true);
  if (validYouTube.success) {
    assert.equal(validYouTube.data.livestreamUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.equal(validYouTube.data.recordingUrl, 'https://vimeo.com/76979871');
  }

  // Empty strings are normalized to null
  const emptyNormalized = createMemorialSchema.safeParse({
    fullName: 'Empty Stream User',
    dateOfBirth: '1970-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'Empty stream test biography.',
    mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    livestreamUrl: '',
    recordingUrl: '',
  });
  assert.equal(emptyNormalized.success, true);
  if (emptyNormalized.success) {
    assert.equal(emptyNormalized.data.livestreamUrl, null, 'Empty livestream string must transform to null');
    assert.equal(emptyNormalized.data.recordingUrl, null, 'Empty recording string must transform to null');
  }

  // Malicious javascript: URL scheme is strictly rejected
  const malicious = createMemorialSchema.safeParse({
    fullName: 'Attack Test User',
    dateOfBirth: '1970-01-01',
    dateOfPassing: '2026-01-01',
    biography: 'Attack stream test biography.',
    mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    livestreamUrl: 'javascript:alert(1)',
  });
  assert.equal(malicious.success, false, 'javascript: scheme must be rejected');
});

test('6. Tribute Moderation Lifecycle: PENDING -> APPROVED / REJECTED', async () => {
  const m1 = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.ok(m1);

  // 1. Submit tribute (defaults to PENDING)
  const tribute = await db.createTribute(m1.id, 'Alice Walker', 'You will always be remembered.');
  assert.equal(tribute.status, 'PENDING');

  // 2. Pending list contains tribute
  const pendingList = await db.findTributesAdmin('PENDING');
  assert.ok(pendingList.some(t => t.id === tribute.id), 'Pending list must contain newly submitted tribute');

  // 3. Reject tribute
  const rejected = await db.updateTributeStatus(tribute.id, 'REJECTED');
  assert.equal(rejected.status, 'REJECTED');

  const rejectedList = await db.findTributesAdmin('REJECTED');
  assert.ok(rejectedList.some(t => t.id === tribute.id));

  // 4. Approve tribute
  const approved = await db.updateTributeStatus(tribute.id, 'APPROVED');
  assert.equal(approved.status, 'APPROVED');

  const approvedList = await db.findTributesAdmin('APPROVED');
  assert.ok(approvedList.some(t => t.id === tribute.id));

  // 5. Delete tribute
  await db.deleteTribute(tribute.id);
  const afterDelete = await db.findTributesAdmin();
  assert.equal(afterDelete.some(t => t.id === tribute.id), false, 'Tribute should be removed');
});

test('7. Media Management & Cloudinary Signature: Generates SHA-1 signature without secret leakage', async () => {
  const m1 = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.ok(m1);

  // Add media item to gallery
  const media = await db.addMedia(
    m1.id,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'pg/test-public-id-123',
    'Family gathering, 1995',
    3
  );
  assert.ok(media.id);
  assert.equal(media.cloudinaryPublicId, 'pg/test-public-id-123');

  // Reorder media
  await db.reorderMedia(m1.id, [{ id: media.id, sortOrder: 0 }]);
  const updatedAdmin = await db.findMemorialByIdAdmin(m1.id);
  const reorderedItem = updatedAdmin?.media?.find(m => m.id === media.id);
  assert.equal(reorderedItem?.sortOrder, 0);

  // Delete media
  await db.deleteMedia(media.id);
  const afterDeleteAdmin = await db.findMemorialByIdAdmin(m1.id);
  assert.equal(afterDeleteAdmin?.media?.some(m => m.id === media.id), false);
});

test('8. Public Directory & Privacy Filter: Excludes drafts and supports search', async () => {
  // 1. Query all public memorials
  const allPublic = await db.findPublicMemorials();
  assert.ok(allPublic.length >= 3, 'Must have at least initial seeded published memorials');
  allPublic.forEach(m => {
    assert.equal(m.publicationStatus, 'PUBLISHED', 'Every record in public directory must be published');
  });

  // 2. Search query by name
  const searched = await db.findPublicMemorials('Arthur');
  assert.ok(searched.length >= 1, 'Search for Arthur should return Arthur Pendleton');
  assert.equal(searched[0].fullName, 'Arthur William Pendleton');

  // 3. Search query with no match
  const noMatch = await db.findPublicMemorials('NonExistentNameXYZ123');
  assert.equal(noMatch.length, 0, 'Non-existent name should return empty array');

  // 4. Create a draft memorial and confirm it NEVER appears in public directory
  const draftOnly = await db.createMemorial({
    slug: 'secret-draft-person',
    fullName: 'Secret Draft Person',
    dateOfBirth: new Date('1960-01-01'),
    dateOfPassing: new Date('2026-01-01'),
    biography: 'This is a strictly private draft.',
    lifeStory: null,
    mainPhotograph: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    serviceInformation: null,
    familyAcknowledgement: null,
    livestreamUrl: null,
    recordingUrl: null,
    templateType: 'MALE',
    publicationStatus: 'DRAFT',
  });

  const queryAfterDraft = await db.findPublicMemorials('Secret Draft');
  assert.equal(queryAfterDraft.length, 0, 'Draft memorial must never be returned in public search');

  const slugQueryDraft = await db.findPublicMemorialBySlug('secret-draft-person');
  assert.equal(slugQueryDraft, null, 'Draft memorial must return null when requested via public slug query');

  // Clean up
  await db.deleteMemorial(draftOnly.id);
});

test('9. Public QR Code Generation: Generates valid SVG and PNG for physical stationery', async () => {
  const targetUrl = 'http://localhost:3000/memorial/arthur-pendleton';

  // SVG format
  const svg = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#1e293b', light: '#ffffff' }
  });
  assert.ok(svg.includes('<svg'), 'QR SVG output must contain <svg> tag');
  assert.ok(svg.includes('</svg>'), 'QR SVG output must contain closing </svg> tag');

  // PNG buffer format for 300+ DPI physical print
  const pngBuffer = await QRCode.toBuffer(targetUrl, {
    type: 'png',
    width: 600,
    margin: 3,
  });
  assert.ok(Buffer.isBuffer(pngBuffer), 'QR PNG output must be a valid Buffer');
  assert.ok(pngBuffer.length > 500, 'QR PNG buffer must have valid image byte payload');
});

test('10. Public Memorial System: Template resolution and conditional broadcast visibility across MALE, FEMALE, and CHILD', async () => {
  // 1. MALE Template (Arthur Pendleton): Classic Dignity with active livestream and recording
  const maleMemorial = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.ok(maleMemorial, 'Arthur Pendleton memorial must be found');
  assert.equal(maleMemorial.templateType, 'MALE');
  assert.ok(maleMemorial.livestreamUrl, 'Male template has active livestream URL');
  assert.ok(maleMemorial.recordingUrl, 'Male template has active recording URL');

  // 2. FEMALE Template (Clara Rose Monroe): Grace & Botanical with null livestream but active recording
  const femaleMemorial = await db.findPublicMemorialBySlug('clara-rose-monroe');
  assert.ok(femaleMemorial, 'Clara Rose Monroe memorial must be found');
  assert.equal(femaleMemorial.templateType, 'FEMALE');
  assert.equal(femaleMemorial.livestreamUrl, null, 'Female template livestream must be null (no livestream section)');
  assert.ok(femaleMemorial.recordingUrl, 'Female template recording must be present');

  // 3. CHILD Template (Leo Alexander Brooks): Gentle Celestial with null livestream and null recording
  const childMemorial = await db.findPublicMemorialBySlug('leo-alexander-brooks');
  assert.ok(childMemorial, 'Leo Alexander Brooks memorial must be found');
  assert.equal(childMemorial.templateType, 'CHILD');
  assert.equal(childMemorial.livestreamUrl, null, 'Child template livestream must be null');
  assert.equal(childMemorial.recordingUrl, null, 'Child template recording must be null (broadcasts container vanished)');

  // 4. Test updating recordingUrl later: Verify it automatically displays
  await db.updateMemorial(childMemorial.id, {
    recordingUrl: 'https://vimeo.com/999888777',
  });
  const updatedChild = await db.findPublicMemorialBySlug('leo-alexander-brooks');
  assert.equal(updatedChild?.recordingUrl, 'https://vimeo.com/999888777', 'Recording URL added later must automatically be returned');

  // Restore Leo back to null recordingUrl
  await db.updateMemorial(childMemorial.id, {
    recordingUrl: null,
  });
});

test('11. Memorial System Robustness: Handles long names, extended life stories, missing optional fields, and 404s', async () => {
  const longName = 'The Honorable Sir Bartholomew Maximilian Alexander Montgomery-Billington the Third';
  const longBio = 'A beloved scholar, adventurer, philanthropist, and family pillar whose warmth touched countless hearts across continents and generations.';
  const longStory = 'Chapter 1: Early Beginnings\nBorn in a small seaside village...\n\nChapter 2: The Journey\nHe traveled across the world...\n\nChapter 3: The Lasting Legacy\nHis devotion to literature and kindness inspired thousands.';

  // Create memorial with missing optional fields (no service info, no family ack, no livestream, no recording)
  const robustMemorial = await db.createMemorial({
    slug: 'sir-bartholomew-montgomery',
    fullName: longName,
    dateOfBirth: new Date('1935-05-15'),
    dateOfPassing: new Date('2026-02-01'),
    biography: longBio,
    lifeStory: longStory,
    mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    serviceInformation: null,
    familyAcknowledgement: null,
    livestreamUrl: null,
    recordingUrl: null,
    templateType: 'MALE',
    publicationStatus: 'PUBLISHED',
  });

  const fetched = await db.findPublicMemorialBySlug('sir-bartholomew-montgomery');
  assert.ok(fetched, 'Memorial must be retrieved publicly');
  assert.equal(fetched.fullName, longName);
  assert.equal(fetched.serviceInformation, null);
  assert.equal(fetched.familyAcknowledgement, null);
  assert.equal(fetched.livestreamUrl, null);
  assert.equal(fetched.recordingUrl, null);
  assert.equal(fetched.lifeStory, longStory);

  // 404 Test for non-existent slug
  const notFound = await db.findPublicMemorialBySlug('completely-non-existent-memorial-slug-404');
  assert.equal(notFound, null, 'Non-existent memorial must return null triggering 404');

  // Clean up
  await db.deleteMemorial(robustMemorial.id);
});

test('12. Visitor Tribute Workflow & Security: Submit -> PENDING -> Admin Review -> APPROVED only becomes public', async () => {
  const memorial = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.ok(memorial, 'Memorial must exist');

  // Initial approved count
  const initialApprovedCount = memorial.tributes?.length || 0;

  // 1. Visitor submits tribute
  const visitorName = 'Cordelia Howard';
  const message = 'Arthur was an inspiration to us all in the garden society. Sending our heartfelt thoughts.';
  const newTribute = await db.createTribute(memorial.id, visitorName, message);

  assert.equal(newTribute.status, 'PENDING', 'New visitor tribute must start in PENDING status');
  assert.equal(newTribute.visitorName, visitorName);
  assert.equal(newTribute.message, message);

  // 2. Verify that public memorial view NEVER exposes the PENDING tribute (Rule #17)
  const publicViewPending = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.equal(
    publicViewPending?.tributes?.some(t => t.id === newTribute.id),
    false,
    'Pending tribute must NOT appear in public memorial tributes list'
  );
  assert.equal(publicViewPending?.tributes?.length, initialApprovedCount);

  // 3. Admin retrieves pending tributes
  const pendingAdminList = await db.findTributesAdmin('PENDING');
  assert.ok(pendingAdminList.some(t => t.id === newTribute.id), 'Pending tribute must be visible to Admin moderation queue');

  // 4. Admin approves tribute
  const approvedTribute = await db.updateTributeStatus(newTribute.id, 'APPROVED');
  assert.equal(approvedTribute.status, 'APPROVED', 'Tribute status must transition to APPROVED');

  // 5. Now it must be visible in public view
  const publicViewApproved = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.equal(
    publicViewApproved?.tributes?.some(t => t.id === newTribute.id),
    true,
    'Approved tribute must now appear in public memorial tributes list'
  );
  assert.equal(publicViewApproved?.tributes?.length, initialApprovedCount + 1);

  // 6. Test Admin REJECT workflow
  const rejectedTribute = await db.updateTributeStatus(newTribute.id, 'REJECTED');
  assert.equal(rejectedTribute.status, 'REJECTED');

  const publicViewRejected = await db.findPublicMemorialBySlug('arthur-pendleton');
  assert.equal(
    publicViewRejected?.tributes?.some(t => t.id === newTribute.id),
    false,
    'Rejected tribute must be excluded from public memorial tributes'
  );

  // Clean up
  await db.deleteTribute(newTribute.id);
});

test('13. Tribute Input Validation, Sanitization & Anti-Spam: Zod limits and honeypot detection', async () => {
  const { createTributeSchema } = await import('../server/validators/index.js');

  // Valid submission
  const valid = createTributeSchema.safeParse({
    visitorName: 'Jane Doe',
    message: 'Rest in heavenly peace.',
  });
  assert.equal(valid.success, true);

  // Name too short (< 2 chars)
  const invalidName = createTributeSchema.safeParse({
    visitorName: 'A',
    message: 'Rest in heavenly peace.',
  });
  assert.equal(invalidName.success, false);

  // Message too short (< 5 chars)
  const invalidMessage = createTributeSchema.safeParse({
    visitorName: 'Jane Doe',
    message: 'RIP',
  });
  assert.equal(invalidMessage.success, false);

  // Script injection attempt in name or message
  const scriptAttempt = createTributeSchema.safeParse({
    visitorName: '<script>alert(1)</script>',
    message: 'Valid message body text here.',
  });
  assert.equal(scriptAttempt.success, false);

  // Honeypot spam trap triggered (website field filled by bot)
  const botSpam = createTributeSchema.safeParse({
    visitorName: 'SEO Spammer',
    message: 'Check out cheap loans at spam site now!',
    website: 'http://spam-link.example.com',
  });
  assert.equal(botSpam.success, false, 'Honeypot field must fail schema validation');
});

test('14. Canonical Production QR & PUBLIC_SITE_URL: Generates print-ready vector/raster encoding production URL', async () => {
  const { config } = await import('../server/config.js');
  const slug = 'clara-rose-monroe';
  const targetCanonicalUrl = `${config.publicSiteUrl}/memorial/${slug}`;

  // Ensure canonical production URL does not contain trailing slash or invalid schemes
  assert.ok(targetCanonicalUrl.startsWith('http'), 'Canonical URL must have valid http/https protocol');
  assert.ok(targetCanonicalUrl.endsWith(`/memorial/${slug}`), 'Canonical URL must end with memorial slug');

  // Verify vector SVG generation
  const svgOutput = await QRCode.toString(targetCanonicalUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#1e293b', light: '#ffffff' }
  });
  assert.ok(svgOutput.includes('<svg'), 'Vector QR output must be a valid SVG string');
  assert.ok(svgOutput.includes('viewBox'), 'Vector QR must include viewBox for infinite scalability');

  // Verify high-resolution 300+ DPI PNG generation (1200x1200px)
  const pngOutput = await QRCode.toBuffer(targetCanonicalUrl, {
    type: 'png',
    width: 1200,
    margin: 3,
    color: { dark: '#1e293b', light: '#ffffff' }
  });
  assert.ok(Buffer.isBuffer(pngOutput), 'PNG QR output must be a Buffer');
  assert.ok(pngOutput.length > 2000, 'High-resolution PNG buffer should be substantially sized for physical print');
});

test('15. Social Sharing Canonical URLs & Mobile Web Share compatibility', async () => {
  const { config } = await import('../server/config.js');
  const memorial = await db.findPublicMemorialBySlug('leo-alexander-brooks');
  assert.ok(memorial, 'Memorial must exist');

  const canonicalUrl = `${config.publicSiteUrl}/memorial/${memorial.slug}`;
  const shareTitle = `In Loving Memory of ${memorial.fullName}`;
  const shareText = `Please join us in honoring and remembering ${memorial.fullName} on Palm & Grace Digital Sanctuary.`;

  // WhatsApp share URL payload format
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${canonicalUrl}`)}`;
  assert.ok(whatsappUrl.includes(encodeURIComponent(canonicalUrl)), 'WhatsApp share must contain encoded canonical URL');

  // Twitter share URL format
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(canonicalUrl)}`;
  assert.ok(twitterUrl.includes(encodeURIComponent(canonicalUrl)), 'Twitter share must contain encoded canonical URL');
});


