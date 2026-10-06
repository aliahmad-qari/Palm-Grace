ectory speed

1. Open `https://palm-grace-web.vercel.app/`, then select **Memorials**.
2. Confirm the directory begins loading immediately and the cards appear without an extra pause.
3. Type several letters into the search box. Results should filter as you type without a new page load or flashing loading skeleton.
4. In browser Developer Tools → Network, filter for `api/memorials`. The homepage/directory should request `?summary=1`, which omits full Life Stories and gallery records while retaining card counts. Opening the directory after the homepage should normally reuse the recent response. Searching should not send a request for every keystroke.
5. If the first request is slow, repeat after Render is awake and note both timings. A cold Render start and a slow image download are separate from directory filtering.

## 2. Memorial opening on desktop and mobile

Open one published Male, Female and Child memorial from the directory. For each, check:

- The opening image fills the initial screen; the next section is reached by scrolling.
- Portrait, name, enabled dates and **Who They Were** are centred.
- **In Loving Memory** sits at the portrait frame's base.
- The right-side **Scroll to remember** prompt uses the same outlined arrow treatment as the homepage's **Scroll to explore** prompt.
- The portrait has a clear visual presence without covering the name or introduction.
- Clicking the prompt moves to the Chronicle, or to the memorial content when no Life Story exists.

Check at desktop width and at **320 × 568**, **375 × 667**, and **390 × 844** in browser responsive mode. On short screens, content may need a small amount of vertical space when a family supplies an unusually long name or introduction# Palm & Grace — Client Review Testing Guide

Use this guide after the latest web deployment is marked **Ready** in Vercel. The admin QR endpoint also requires the latest API deployment on Render. Test with sample memorials rather than changing a family's live content.

## 1. Memorial dir; there should be no overlap, clipped text, or horizontal scrolling.

## 3. Template backgrounds and palette

- Male and Female templates have different fallback images.
- When a Male or Female memorial has gallery photographs, its first ordered gallery photo becomes the background. Reorder photos in admin if the family prefers another image.
- The Child template uses a separate garden background; the person's portrait must **not** be enlarged behind itself.
- The Female page below the opening uses a warm ivory background with readable dark text and high-contrast content cards.
- The Child background contains no forced religious or sentimental imagery.

## 4. Chronicle and content sections

Use the sample memorial with the long Life Story:

1. The Chronicle should initially show a short preview.
2. Select **Read More**. All supplied paragraphs should appear in order.
3. Select **Read Less**. The story should collapse again.
4. Beneath it, view the actual **Tributes**, **Service Details**, **Photo & Video Gallery**, and optional **Livestream & Recording** content directly on the page. These are content sections rather than shortcut buttons.
5. Check a memorial without livestream/recording. No empty livestream panel should remain; other sections should occupy the available width.
6. Check a memorial with few photos or no service details. Missing sections should disappear cleanly.

## 5. Admin sharing and QR

1. Sign in at `https://palm-grace-web.vercel.app/admin/login`.
2. Open **Memorials**. Each row has a labelled **Share / QR** button in the Actions column. The same button appears at the top of a saved memorial's editor.
3. Open it and verify the memorial link can be copied and the QR can be viewed, printed, or downloaded as **SVG** and **PNG**.
4. For a Draft or Private Preview, the modal should explain that its public page opens only after publication. Do not distribute its QR yet.
5. For a Published memorial, open the public link and scan the QR with a phone. Both should reach the same `/memorial/{slug}` page.

## 6. Record the outcome

For any failed check, send the page URL, memorial template, device width, a screenshot and the approximate time tested. For a slow directory, include the `api/memorials` Network timing and whether it was the first request after Render had been idle.
