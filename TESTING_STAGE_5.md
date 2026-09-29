# Stage 5 Refactor - Testing Protocol

## Objective
Verify that PublicMemorialViewPage.tsx correctly implements the 6-stage emotional journey (ARRIVAL → RECOGNITION → STORY → CONNECTION → REMEMBRANCE → REFLECTION) while preserving working architecture, template systems, and conditional content rendering.

## Test Environment
- File: `apps/web/src/pages/public/PublicMemorialViewPage.tsx`
- Build Status: ✅ TypeScript validation passed
- Browser: Any modern browser (Chrome/Firefox/Safari/Edge)
- Device: Desktop + Mobile (for responsive testing)

## Template System Verification

The three templates are applied consistently throughout all sections:

### MALE Template (slate-950, amber-400 accents, classical motif)
- Root background: `bg-slate-950`
- Hero gradient: slate radial gradient
- Card styling: slate-900/85 with slate-800/90 borders
- Accent color: amber-300
- Accent border hover: amber-400/40
- Heading color: slate-100
- Body text: slate-300
- Button primary: amber-400 bg with stone-950 text

### FEMALE Template (stone-950, rose accents, botanical motif)
- Root background: `bg-stone-950`
- Hero gradient: stone radial gradient
- Card styling: stone-900/85 with stone-800/90 borders
- Accent color: rose-200
- Accent border hover: rose-300/40
- Heading color: stone-100
- Body text: stone-300
- Button primary: rose-300 bg with stone-950 text

### CHILD Template (sky-950, amber accents, celestial motif)
- Root background: `bg-sky-950`
- Hero gradient: sky radial gradient
- Card styling: sky-900/60 with sky-800/80 borders
- Accent color: amber-200
- Accent border hover: amber-200/40
- Heading color: sky-50
- Body text: sky-100
- Button primary: amber-300 bg with stone-950 text

## Emotional Journey Sections

### 1. ARRIVAL (Section 1)
**Expected:**
- Portrait frame (144x144 on mobile, 224x224 on desktop, circular with template-specific border glow)
- "In Loving Memory" badge below portrait
- Full name in large serif font (font-light, tracking-tight)
- Birth and passing dates (light font-weight, tracking-widest)
- Biography inscription in italics below dates (only if biography field exists)
- Template-specific colors throughout

**Conditional:** Biography displays only if `memorial.biography` is truthy

### 2. RECOGNITION (Section 3)
**Expected:**
- "Who They Were" label (text-[11px] uppercase tracking-widest, template accent color)
- Biography inscription in italics and larger font
- Horizontal divider with template accent color
- Centered layout

**Conditional:** Entire section disappears if no biography

### 3. STORY (Section 4)
**Expected:**
- "The Chronicle" label with accent color
- "The Life & Journey" heading in serif, 2xl-4xl
- Horizontal divider with accent color
- Long-form text in box with template colors (subtleBoxBg, subtleBoxBorder)
- Good typography rhythm and spacing
- Whitespace handling for multiline prose

**Conditional:** Entire section disappears if `memorial.lifeStory` is null

### 4. CONNECTION (Section 5)
**Expected:**
- "Memories & Words of Remembrance" heading
- MessageSquareHeart icon in circular badge
- Tribute submission form:
  - Your Full Name field (text input)
  - Your Memory or Words field (textarea, 4 rows)
  - Submit button with Send icon
  - Honeypot field (hidden from view, aria-hidden="true")
  - Feedback messages (success/error) with appropriate icons
- Approved tributes wall below form:
  - Amber background (bg-amber-50)
  - "Shared Memories (N)" header
  - "Approved by Caretakers" label
  - Empty state message if no tributes
  - Individual tribute cards with visitor name, date, and message
  - Tribute cards have hover states (border-amber-400, bg-white)

**Conditional:** Tributes wall section is always present, empty state shows if none exist

### 5. REMEMBRANCE (Section 6)
**Expected Components:**

#### Part A: Service Information (if exists)
- "Ceremonial Service Gathering" header with MapPin icon
- "Copy Address" button (if address exists)
- Venue name in serif, xl-2xl
- Grid with Date & Time and Sanctuary Address (responsive: 1 col on mobile, 2 cols on desktop)
- Date uses Clock icon with amber color
- Address uses MapPin icon with amber color
- Reception notes section (if exists)
- Copy to clipboard functionality for address

**Conditional:** Entire section disappears if `serviceInformation` is null

#### Part B: Photo Gallery (if exists)
- "Archival Photographs" label with accent color
- "Remembrance Gallery" heading in serif, 2xl-4xl
- Photo count display: "N Photographs preserved in honor of [name]"
- Responsive grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Each photo: 
  - Aspect ratio 4:3
  - Rounded corners with borders
  - Hover scale effect (scale-[1.02])
  - Caption displayed at bottom if present
  - Darkened overlay on hover
- Lightbox integration:
  - Click on photo opens lightbox
  - Navigate between photos
  - Close button

**Conditional:** Gallery section disappears if no media

#### Part C: Broadcasts (if exists - Rule #18)
- "Ceremonial Service Broadcasts" header with Video icon
- Livestream section (if `livestreamUrl` exists):
  - Green pulse indicator
  - "Live Service Stream" heading
  - Description about joining in real-time
  - "Join Live Broadcast" button with ExternalLink icon (rose-600 bg)
  - Opens in new tab
- Recording section (if `recordingUrl` exists):
  - Play icon with amber color
  - "Ceremony Recording" heading
  - Description about archived broadcast
  - "Watch Ceremony Recording" button with ExternalLink icon (stone-800 bg, amber-200 text)
  - Opens in new tab

**Conditional:** 
- Entire broadcasts section disappears if BOTH livestream AND recording are absent (Rule #18)
- Individual broadcast sections disappear if their URL is missing/empty
- If both livestream and recording exist, use 2-column grid on desktop

### 6. REFLECTION (Section 8)
**Expected:**
- Family Acknowledgement section (if exists):
  - Heart icon at top
  - "Words of Gratitude from the Family" label (text-xs uppercase)
  - Acknowledgement text in italics, serif font
  - Subtle background (white/5 opacity)
  - Rounded borders with slight glow effect

**Conditional:** Entire section disappears if no family acknowledgement

## Navigation Bar (Persistent at Top)
**Expected:**
- Sticky positioning (`sticky top-0 z-40`)
- Minimal controls with borders
- Back to Directory link with ArrowLeft icon
  - Desktop shows: "Back to Directory"
  - Mobile shows: "Back"
- QR button with QrCode icon (amber-300)
  - Tooltip: "View & Print Stationery QR Code"
- Share button with Share2 icon
  - Tooltip: "Share Sanctuary Link"
- Semi-transparent background (bg-stone-950/50) with backdrop blur
- Light border at bottom (border-white/5)

## Modals

### QR Modal
- Opens on QR button click
- Displays QR code image (white background)
- Downloads available:
  - Vector SVG link
  - 300 DPI PNG link
- Close button (X) in top right
- Semi-transparent overlay background

### Share Modal (via MemorialSocialShareModal component)
- Opens on Share button click
- Social sharing options
- Opens QR modal option
- Close button

## Test Cases

### TEST 1: Male Template - Full Content
**Template:** MALE
**Content:**
- ✓ fullName: "James Harrison"
- ✓ dateOfBirth: "1945-03-15"
- ✓ dateOfPassing: "2024-08-22"
- ✓ biography: "A devoted father, engineer, and lover of classical music."
- ✓ lifeStory: "[Multiple paragraphs of life story]"
- ✓ mainPhotograph: [Valid image URL]
- ✓ serviceInformation: JSON with venue, date, address, reception
- ✓ familyAcknowledgement: "Thank you for your heartfelt support during this time."
- ✓ livestreamUrl: [Valid YouTube/Vimeo URL]
- ✓ recordingUrl: [Valid recording URL]
- ✓ media: [5+ photos with captions]
- ✓ tributes: [2-3 approved tributes]

**Expected Results:**
- [ ] Entire page renders without errors
- [ ] Slate/amber color scheme applied throughout
- [ ] All 6 emotional journey sections visible and in correct order
- [ ] ARRIVAL: Portrait with slate border/glow, amber badge
- [ ] RECOGNITION: Biography displayed
- [ ] STORY: Life story text readable with good spacing
- [ ] CONNECTION: Tribute form visible, existing tributes displayed
- [ ] REMEMBRANCE: Service info card visible, broadcasts section visible with both livestream and recording, 5+ photos in grid
- [ ] REFLECTION: Family acknowledgement visible with proper styling
- [ ] Navigation bar visible and functional
- [ ] QR and Share buttons responsive and open modals
- [ ] Lightbox opens and navigates photos correctly
- [ ] Mobile responsive: all sections readable on 375px viewport

### TEST 2: Female Template - Full Content
**Template:** FEMALE
**Content:** Same as TEST 1 but with:
- fullName: "Margaret Eleanor"
- biography: "A passionate educator and mother of two."
- familyAcknowledgement: "Your kindness means more than words can express."

**Expected Results:**
- [ ] Stone/rose color scheme applied throughout
- [ ] Rose accent colors visible in badges, buttons, borders
- [ ] All sections render identically to TEST 1 but with rose accents instead of amber
- [ ] Rose-300 primary button on tribute form
- [ ] Rose-200 accent text on labels
- [ ] No stereotypical pink coloring (accent is rose-200, not bright pink)

### TEST 3: Child Template - Full Content (Personality Focus)
**Template:** CHILD
**Content:**
- ✓ fullName: "Emma Grace"
- ✓ dateOfBirth: "2018-06-20"
- ✓ dateOfPassing: "2024-09-10"
- ✓ biography: "Emma loved drawing, making people laugh, and building with blocks."
- ✓ lifeStory: "[Personality-focused narrative, warm and natural]"
- ✓ mainPhotograph: [Photo showing personality]
- ✓ serviceInformation: "[Details about family gathering]"
- ✓ familyAcknowledgement: "Emma would have loved knowing how many people cared about her."
- ✓ media: [3-4 photos showing activities and moments]
- ✓ tributes: [1-2 tributes from extended family]

**Expected Results:**
- [ ] Sky/amber color scheme applied throughout
- [ ] Sky-50 heading color (lighter/brighter than adult templates)
- [ ] Amber-200 accent color throughout
- [ ] All sections render correctly with sky background
- [ ] STORY section conveys personality without sentimentality
- [ ] No angel/cloud/teddy-bear imagery or clichés
- [ ] Life story reads naturally and personality-forward
- [ ] Gallery shows Emma's personality through photos
- [ ] REFLECTION section warm and family-focused without being maudlin

### TEST 4: Male Template - Minimal Content
**Template:** MALE
**Content:**
- ✓ fullName: "Robert Mitchell"
- ✓ dateOfBirth: "1950-01-10"
- ✓ dateOfPassing: "2024-09-15"
- ✓ biography: "A quiet man who loved his family."
- ✓ lifeStory: NULL (absent)
- ✓ mainPhotograph: [Valid image]
- ✓ serviceInformation: NULL (absent)
- ✓ familyAcknowledgement: NULL (absent)
- ✓ livestreamUrl: NULL (absent)
- ✓ recordingUrl: NULL (absent)
- ✓ media: [] (empty array)
- ✓ tributes: [] (empty array)

**Expected Results:**
- [ ] Page renders cleanly with only ARRIVAL and RECOGNITION sections
- [ ] No empty gallery section
- [ ] No empty service info section
- [ ] No broadcasts section (both URLs absent)
- [ ] No family acknowledgement section
- [ ] Tribute form still visible with "Be the first to share a memory..." message
- [ ] Page feels complete and dignified, not barren
- [ ] All existing sections have proper spacing/padding
- [ ] Navigation bar fully functional

### TEST 5: Female Template - Partial Content
**Template:** FEMALE
**Content:**
- ✓ fullName: "Catherine Anne"
- ✓ dateOfBirth: "1960-05-22"
- ✓ dateOfPassing: "2024-08-30"
- ✓ biography: "A talented artist and cherished friend."
- ✓ lifeStory: "[2 paragraphs about her art and impact]"
- ✓ mainPhotograph: [Valid image]
- ✓ serviceInformation: NULL (absent)
- ✓ familyAcknowledgement: NULL (absent)
- ✓ livestreamUrl: NULL (absent)
- ✓ recordingUrl: "https://example.com/recording" (RECORDING ONLY)
- ✓ media: [3 photos]
- ✓ tributes: [] (empty)

**Expected Results:**
- [ ] ARRIVAL section visible
- [ ] RECOGNITION section visible
- [ ] STORY section visible with life story
- [ ] CONNECTION section visible with tribute form
- [ ] REMEMBRANCE section visible:
  - [ ] No service info (section absent)
  - [ ] Broadcasts section visible (recording only, no livestream)
  - [ ] Gallery visible with 3 photos
- [ ] REFLECTION section absent (no family acknowledgement)
- [ ] Recording button present, livestream section absent
- [ ] Tribute wall shows empty state
- [ ] All stone/rose styling applied

### TEST 6: Child Template - Conditional Broadcasts
**Template:** CHILD
**Content:**
- ✓ fullName: "Lucas William"
- ✓ dateOfBirth: "2016-09-10"
- ✓ dateOfPassing: "2024-09-12"
- ✓ biography: "Lucas was always smiling and loved soccer."
- ✓ lifeStory: "[Personality narrative]"
- ✓ mainPhotograph: [Valid image]
- ✓ serviceInformation: "[Address and time info]"
- ✓ familyAcknowledgement: NULL
- ✓ livestreamUrl: "https://example.com/live" (LIVESTREAM ONLY)
- ✓ recordingUrl: NULL (absent)
- ✓ media: [2 photos]
- ✓ tributes: [1 tribute from coach]

**Expected Results:**
- [ ] All sections render
- [ ] Broadcasts section visible (livestream only, no recording section)
- [ ] Service info visible
- [ ] Gallery visible with 2 photos
- [ ] Tribute wall visible with 1 tribute
- [ ] Sky theme applied consistently
- [ ] Grid layout single column (only livestream, no 2-col grid)

## Responsive Testing

For each test case, verify on:
- [ ] Mobile (375px viewport - iPhone SE)
- [ ] Tablet (768px viewport - iPad)
- [ ] Desktop (1920px viewport - Full HD)

**Mobile-specific checks:**
- [ ] Navigation back button shows "Back" not "Back to Directory"
- [ ] Portrait size appropriate (144x144)
- [ ] Gallery grid is 2 columns
- [ ] Form fields full width
- [ ] Tributes cards readable
- [ ] Broadcasts stack vertically (1 column)
- [ ] Service info stacks vertically (1 column)

**Tablet-specific checks:**
- [ ] Gallery grid is 3 columns
- [ ] Service info grid is 2 columns
- [ ] Broadcasts grid is 2 columns (if both present)
- [ ] Form maintains good spacing

**Desktop-specific checks:**
- [ ] Gallery grid is 4 columns
- [ ] All sections properly constrained to max-w-* classes
- [ ] Service info grid is 2 columns
- [ ] Broadcasts grid is 2 columns (if both present)

## Accessibility Testing

- [ ] Page uses semantic HTML (sections, headings hierarchy)
- [ ] Color contrast meets WCAG AA standards
- [ ] Navigation buttons have aria-labels
- [ ] Honeypot field is aria-hidden="true"
- [ ] Buttons have clear text labels
- [ ] Form labels are associated with inputs
- [ ] Images have alt text
- [ ] QR/Share modals are properly trapped (can close with ESC or close button)
- [ ] No keyboard traps
- [ ] Tab order is logical

## Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Lightbox opens smoothly (no jank on photo transitions)
- [ ] Form submission has loading state visible
- [ ] Modals open/close without lag
- [ ] No console errors or warnings

## Sign-Off

**Date Tested:** _________________
**Tester Name:** _________________
**Test Environment:** Desktop / Mobile / Both
**All Tests Passed:** ✓ YES / ❌ NO

**Notes/Issues Found:**
_____________________________________________________________________________
_____________________________________________________________________________

**Approved by:** _________________
