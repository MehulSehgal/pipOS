#!/usr/bin/env bash
# Creates labels and starter issues. Needs GitHub CLI: https://cli.github.com  then: gh auth login
set -e
REPO=Tech4Aditya/pipOS

gh label create 'good first issue' --color 7057ff --repo $REPO --force >/dev/null
gh label create 'help wanted' --color 008672 --repo $REPO --force >/dev/null
gh label create testing --color fbca04 --repo $REPO --force >/dev/null
gh label create accessibility --color 0e8a16 --repo $REPO --force >/dev/null
gh label create enhancement --color a2eeef --repo $REPO --force >/dev/null
gh label create 'new toy' --color f9d0c4 --repo $REPO --force >/dev/null
gh label create performance --color d93f0b --repo $REPO --force >/dev/null
gh label create bug --color d73a4a --repo $REPO --force >/dev/null
gh label create documentation --color 0075ca --repo $REPO --force >/dev/null
gh label create i18n --color c5def5 --repo $REPO --force >/dev/null

gh issue create --repo $REPO --title 'Test on Safari, Firefox and real phones, report what breaks' --label 'good first issue,testing' --body '**Why**
The site was tested in Chromium only. Safari and Firefox handle Web Audio, `mask-image`, `<dialog>` and `100svh` differently.

**Task**
- Open the live site in Safari (macOS/iOS), Firefox and a real Android phone
- Check: sound on/off, Lullaby Lab, Nightlight flashlight, Rattle & Blocks, route scroll, story scroll, night mode, gold-star Easter egg
- Comment on this issue with browser, OS, what broke, and a screenshot

**Done when**
A table of browser results is posted and each real bug has its own issue.'
sleep 2
gh issue create --repo $REPO --title 'Accessibility audit: screen reader, focus order and contrast' --label 'good first issue,accessibility' --body '**Task**
- Tab through the whole page. Is every control reachable, visible when focused, and in a sensible order?
- Test with NVDA, VoiceOver or TalkBack
- Check colour contrast in day AND night mode (use a contrast checker)
- Fix problems in `index.html` / `css/style.css`

**Areas to look at**
Story scenes (inactive scenes are only visually hidden), the dark-room lantern radio group, the Pip SVG labels, the wish wall form errors.

**Done when**
A PR lists what was found and fixed, with before/after notes.'
sleep 2
gh issue create --repo $REPO --title 'Shared wish wall backend (replace device-only storage)' --label 'help wanted,enhancement' --body '**Why**
The wish wall currently saves to `localStorage` (this device only). A real shared wall would be a stronger guestbook.

**Task**
- Propose a free backend (Supabase, Firebase, Cloudflare Workers + KV) in a comment first
- Implement read/post with basic rate limiting and length limits
- Keep rendering via `textContent` (no `innerHTML`) to avoid XSS
- Keep the local fallback if the backend is down, and keep the console clean

**Done when**
Wishes from two different browsers appear on the same wall, with a short setup guide in the README.'
sleep 2
gh issue create --repo $REPO --title 'New toy: Bedtime Storybook (flipbook)' --label 'enhancement,new toy' --body 'Add a fifth Work window: a short illustrated storybook with page-flip interaction (CSS 3D or simple slide transitions).

**Requirements**
- Plain JS, no new dependencies
- 5 to 8 pages, each under 60 words, original story and art (SVG preferred)
- Works with touch swipe, arrow keys and buttons
- Respects `prefers-reduced-motion`
- Matches the window style in `css/style.css`'
sleep 2
gh issue create --repo $REPO --title 'New toy: Pip'"'"'s Growth Chart (skills on a nursery wall)' --label 'enhancement,new toy' --body 'Show Pip'"'"'s skills as marks on a nursery height chart (lullabies, nightlights, rooftop navigation, giggling).

**Requirements**
- Animated when scrolled into view (use `IntersectionObserver`, see `js/util.js`)
- Accessible: values available as text, not only visuals
- Mobile friendly, theme-aware (day/night tokens in `css/style.css`)'
sleep 2
gh issue create --repo $REPO --title 'Lullaby Lab: volume slider and more melodies' --label 'good first issue,enhancement' --body '**Task**
- Add a labelled volume slider wired to the master gain in `js/audio.js`
- Add 2 more original short tunes (arrays like `TUNE` in `js/toys.js`) with a picker
- Do not use copyrighted melodies

**Done when**
Volume persists via the existing `store` helper, the mute switch still wins, and the console stays clean.'
sleep 2
gh issue create --repo $REPO --title 'Lighthouse performance and mobile polish pass' --label 'good first issue,performance' --body '**Task**
- Run Lighthouse (mobile) and post the scores
- Fix quick wins: font loading, unused CSS, layout shift, tap target sizes
- Do not add dependencies

**Done when**
A PR improves at least one category and includes before/after scores.'
sleep 2
gh issue create --repo $REPO --title 'Make it a PWA (manifest + offline service worker)' --label enhancement --body 'Add `manifest.webmanifest`, icons (reuse `assets/favicon.svg`) and a small service worker so Pip works offline and can be installed.

**Notes**
Cache only local files. Google Fonts must degrade gracefully when offline.'
sleep 2
gh issue create --repo $REPO --title 'Unit tests for block game and audio logic' --label 'good first issue,testing' --body '**Task**
- Extract the pure logic from `drop()` in `js/toys.js` (overlap, perfect-drop snap, chips) into a function that does not touch the DOM
- Add tests with Node'"'"'s built-in `node --test` (no frameworks)
- Add a short "Running tests" section to the README

**Done when**
Tests cover miss, partial overlap and perfect drop.'
sleep 2
gh issue create --repo $REPO --title 'Dark room on touch devices: scrolling vs light dragging' --label 'bug,help wanted' --body 'The Nightlight dark room uses `touch-action: pan-y` so the page still scrolls. On some phones dragging the light can feel unreliable or scroll the page.

**Task**
- Reproduce on iOS Safari and Android Chrome
- Propose and implement a better touch approach (for example a drag handle or a press-and-hold mode)
- Keep keyboard arrow control working'
sleep 2
gh issue create --repo $REPO --title 'README: screenshots, GIF demo and architecture notes' --label 'good first issue,documentation' --body 'Add to `README.md`:
- 3 screenshots (day, night, mobile) and a short GIF of the music box and flashlight
- A diagram or table of how `js/` modules interact (`window.PIP` namespace)
- A "Good first issues" link'
sleep 2
gh issue create --repo $REPO --title 'Add Hindi (and other language) support' --label enhancement,i18n --body 'Extract visible strings into a small JSON dictionary and add a language switch. Start with Hindi.

**Notes**
Keep the no-framework approach. Story scenes must stay under 150 words each.'
sleep 2
gh issue create --repo $REPO --title 'Add LICENSE and CODE_OF_CONDUCT' --label 'good first issue,documentation' --body 'Add an MIT `LICENSE` (confirm with the maintainer first) and a Contributor Covenant `CODE_OF_CONDUCT.md`, then link both from the README.'
sleep 2
