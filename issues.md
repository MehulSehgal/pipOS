# Starter issues for pipOS

Copy each into GitHub (New issue), or run `create_issues.sh` with the GitHub CLI.

## 1. Test on Safari, Firefox and real phones, report what breaks
**Labels:** good first issue, testing

**Why**
The site was tested in Chromium only. Safari and Firefox handle Web Audio, `mask-image`, `<dialog>` and `100svh` differently.

**Task**
- Open the live site in Safari (macOS/iOS), Firefox and a real Android phone
- Check: sound on/off, Lullaby Lab, Nightlight flashlight, Rattle & Blocks, route scroll, story scroll, night mode, gold-star Easter egg
- Comment on this issue with browser, OS, what broke, and a screenshot

**Done when**
A table of browser results is posted and each real bug has its own issue.

---

## 2. Accessibility audit: screen reader, focus order and contrast
**Labels:** good first issue, accessibility

**Task**
- Tab through the whole page. Is every control reachable, visible when focused, and in a sensible order?
- Test with NVDA, VoiceOver or TalkBack
- Check colour contrast in day AND night mode (use a contrast checker)
- Fix problems in `index.html` / `css/style.css`

**Areas to look at**
Story scenes (inactive scenes are only visually hidden), the dark-room lantern radio group, the Pip SVG labels, the wish wall form errors.

**Done when**
A PR lists what was found and fixed, with before/after notes.

---

## 3. Shared wish wall backend (replace device-only storage)
**Labels:** help wanted, enhancement

**Why**
The wish wall currently saves to `localStorage` (this device only). A real shared wall would be a stronger guestbook.

**Task**
- Propose a free backend (Supabase, Firebase, Cloudflare Workers + KV) in a comment first
- Implement read/post with basic rate limiting and length limits
- Keep rendering via `textContent` (no `innerHTML`) to avoid XSS
- Keep the local fallback if the backend is down, and keep the console clean

**Done when**
Wishes from two different browsers appear on the same wall, with a short setup guide in the README.

---

## 4. New toy: Bedtime Storybook (flipbook)
**Labels:** enhancement, new toy

Add a fifth Work window: a short illustrated storybook with page-flip interaction (CSS 3D or simple slide transitions).

**Requirements**
- Plain JS, no new dependencies
- 5 to 8 pages, each under 60 words, original story and art (SVG preferred)
- Works with touch swipe, arrow keys and buttons
- Respects `prefers-reduced-motion`
- Matches the window style in `css/style.css`

---

## 5. New toy: Pip's Growth Chart (skills on a nursery wall)
**Labels:** enhancement, new toy

Show Pip's skills as marks on a nursery height chart (lullabies, nightlights, rooftop navigation, giggling).

**Requirements**
- Animated when scrolled into view (use `IntersectionObserver`, see `js/util.js`)
- Accessible: values available as text, not only visuals
- Mobile friendly, theme-aware (day/night tokens in `css/style.css`)

---

## 6. Lullaby Lab: volume slider and more melodies
**Labels:** good first issue, enhancement

**Task**
- Add a labelled volume slider wired to the master gain in `js/audio.js`
- Add 2 more original short tunes (arrays like `TUNE` in `js/toys.js`) with a picker
- Do not use copyrighted melodies

**Done when**
Volume persists via the existing `store` helper, the mute switch still wins, and the console stays clean.

---

## 7. Lighthouse performance and mobile polish pass
**Labels:** good first issue, performance

**Task**
- Run Lighthouse (mobile) and post the scores
- Fix quick wins: font loading, unused CSS, layout shift, tap target sizes
- Do not add dependencies

**Done when**
A PR improves at least one category and includes before/after scores.

---

## 8. Make it a PWA (manifest + offline service worker)
**Labels:** enhancement

Add `manifest.webmanifest`, icons (reuse `assets/favicon.svg`) and a small service worker so Pip works offline and can be installed.

**Notes**
Cache only local files. Google Fonts must degrade gracefully when offline.

---

## 9. Unit tests for block game and audio logic
**Labels:** good first issue, testing

**Task**
- Extract the pure logic from `drop()` in `js/toys.js` (overlap, perfect-drop snap, chips) into a function that does not touch the DOM
- Add tests with Node's built-in `node --test` (no frameworks)
- Add a short "Running tests" section to the README

**Done when**
Tests cover miss, partial overlap and perfect drop.

---

## 10. Dark room on touch devices: scrolling vs light dragging
**Labels:** bug, help wanted

The Nightlight dark room uses `touch-action: pan-y` so the page still scrolls. On some phones dragging the light can feel unreliable or scroll the page.

**Task**
- Reproduce on iOS Safari and Android Chrome
- Propose and implement a better touch approach (for example a drag handle or a press-and-hold mode)
- Keep keyboard arrow control working

---

## 11. README: screenshots, GIF demo and architecture notes
**Labels:** good first issue, documentation

Add to `README.md`:
- 3 screenshots (day, night, mobile) and a short GIF of the music box and flashlight
- A diagram or table of how `js/` modules interact (`window.PIP` namespace)
- A "Good first issues" link

---

## 12. Add Hindi (and other language) support
**Labels:** enhancement, i18n

Extract visible strings into a small JSON dictionary and add a language switch. Start with Hindi.

**Notes**
Keep the no-framework approach. Story scenes must stay under 150 words each.

---

## 13. Add LICENSE and CODE_OF_CONDUCT
**Labels:** good first issue, documentation

Add an MIT `LICENSE` (confirm with the maintainer first) and a Contributor Covenant `CODE_OF_CONDUCT.md`, then link both from the README.

---

