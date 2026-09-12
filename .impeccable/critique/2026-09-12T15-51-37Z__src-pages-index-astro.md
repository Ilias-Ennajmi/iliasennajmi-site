---
target: homepage (src/pages/index.astro) — re-critique
total_score: 27
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 2
timestamp: 2026-09-12T15-51-37Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review · B: detector+browser-evidence) — RE-CRITIQUE

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Marquee toggle correctly flips label/aria-pressed; the hero's `#cc-cue` link gives no visual signal it's interactive until hover |
| 2 | Match System / Real World | 4/4 | "Pick a door," "follow the money" — language matches the site's own conceit precisely |
| 3 | User Control and Freedom | 3/4 | Marquee pause is solid and sticky; but `#cc-cue`'s hit target is effectively unusable (see P1) |
| 4 | Consistency and Standards | 3/4 | `.pill-cta` extraction is a real win; but the Fork/Loose Threads `<h2>`s run two unrelated text nodes together with no separation |
| 5 | Error Prevention | 4/4 | Honeypot correctly `aria-hidden` + `tabindex="-1"`, native `type=email` + `required` |
| 6 | Recognition Rather Than Recall | 4/4 | Nav labels, "Latest" essay title shown directly in each Fork card |
| 7 | Flexibility and Efficiency | 2/4 | ⌘K exists but nothing on the homepage itself surfaces it as a returning-reader shortcut |
| 8 | Aesthetic and Minimalist Design | 4/4 | One accent, zero shadows (confirmed via full-DOM scan in both themes), hairlines only |
| 9 | Error Recovery | n/a | No error states possible on this static page |
| 10 | Help and Documentation | n/a | Not applicable to an essay-site homepage |

**Total: 27/32 applicable (84%) — Good** (up from the prior run's 25/32)

## Design Specificity Verdict

Reads as authored, not templated. The hero's illustrated coin-profile mark is original artwork built from the site's own vocabulary (beaded ring, ember diamonds), correctly honoring the "no third-party brand assets" constraint. Copy voice and the Fork's live "Latest" essay pull root the page in real content.

**Deterministic scan**: `detect.mjs` exit code **0** — clean, zero findings across `index.astro`, `HeroTitlePage.astro`, `SectionPath.astro`, `global.css`. (The `design-system-font-size` rule suppressed earlier this session, and no other antipatterns present.)

**Cross-agent confirmation**: Both assessments independently verified the prior fixes structurally landed (real `<h2>` tags exist, ContactLinks is all-Oxblood, marquee toggle genuinely works — Assessment B confirmed via `getAnimations()[0].playState` transitioning running→paused→running on real clicks) — but Assessment A caught that one of the fixes has a content-level defect the DOM-structure check alone wouldn't surface.

## Overall Impression

The prior round's two P1s are genuinely fixed at the structural level and stayed fixed under a fresh, independent look — a real, verified improvement (25→27/32). But two new, more subtle defects surfaced: the "jump to Fork" anchor built from a decorative element inherited that element's near-zero hit area, and promoting the section eyebrows to `<h2>` pulled in an adjacent text node that turns the accessible name into a run-on string. Both are the kind of regression that only shows up when you actually interact with the fix rather than just confirming it exists.

## What's Working

1. **The One Accent Rule holds under scrutiny.** `ContactLinks.astro` now hardcodes `accent: 'ember'` for every link with a comment citing the rule directly — confirmed via both a live color audit (all 5 links render `contact-ember`) and the source comment explaining why.
2. **Reduced-motion discipline is thorough.** Every animated piece (reveal, counter, marquee, diamond flash) checks `motionOK()` and renders its end-state instantly.
3. **The shared `.pill-cta`/`.pill-cta-icon` extraction is a genuine consistency win** — verified it now matches `design.json`'s documented button spec exactly (pill, 1px Paper Line border, no fill).

## Priority Issues

- **[P1] The hero's "jump to Fork" anchor has a ~1px-wide hit target.** `#cc-cue` wraps only its decorative inner `<span>` (`width:1px;height:38px`) with no padding on the `<a>` itself — measured `{width:1, height:38}`. This is the exact element that replaced last round's "buried CTA" problem, but as built it's nearly unusable by mouse and untappable by touch, silently defeating the fix's intent.
  **Fix**: Give the `<a>` a padded invisible hit-area (e.g. `padding:20px` extending symmetrically around the visual line) independent of the 1px line's own width.

- **[P1] The Fork and Loose Threads `<h2>`s concatenate two unrelated strings into one run-on accessible name.** Verified via `textContent`: `"02 — The ForkTwo ways down the same hole"` and `"03 — Loose ThreadsA public notebook — some become essays"` — the section label and the descriptive tagline sit inside the same `<h2>` with no separating text node. A side-effect of last round's fix (promoting the eyebrow row to `<h2>` pulled in a sibling `<span>` it shouldn't have).
  **Fix**: Keep only the section label inside the `<h2>` ("The Fork"); move the descriptive tagline to a sibling element outside the heading, matching how sections 01 and 05 already do it correctly.

- **[P2] Section 04's actual headline isn't a heading at all.** "04 — The Shelf" is the `<h2>` (the small mono eyebrow), but the visually dominant line "Whatever's shaping the work right now." sits in a plain `<div>` right after it. A screen-reader user navigating by headings gets "THE SHELF" and skips past the section's real title — the letter of the prior fix is satisfied but not its spirit.
  **Fix**: Wrap the descriptive headline in an `<h3>` beneath the `<h2>` eyebrow, giving heading-navigation users the actual title.

- **[P2] The marquee pause button is 134×28.4px** — passes the 24px WCAG floor but fails the site's own 44px mobile-tap-target convention (already applied to nav/drawer controls), and hover-pause doesn't work on touch devices, making this button the *only* way touch users can stop the scrolling text.
  **Fix**: Increase to 44px min-height, matching the treatment already given to nav/drawer controls.

- **[P2] Activating the hero's scroll-cue moves the viewport but not keyboard focus.** Confirmed via direct test: `cue.click()` scrolls `window.scrollY` 0→1324 correctly, but `document.activeElement` stays on `<body>` since `#fork` has no `tabindex`. A keyboard/screen-reader user who activates the link doesn't get taken to the destination in any way their assistive tech announces — scroll works, the "jump" itself doesn't.
  **Fix**: Add `tabindex="-1"` to the `#fork` section and call `.focus()` on it in the click handler (the standard in-page "skip link" pattern).

- **[P3] The "Start Here" pill has no empty-state guard.** `getStartHerePath()` returns `[]` if no essay has `startHereOrder` set; the pill renders unconditionally as `"Start Here — {startHere.length} essays, ~{startHereMinutes} min →"` with no fallback — a future content change could ship "0 essays, ~0 min" live.

## Persona Red Flags

**Sam (Accessibility)**: Heading-navigates and hears "zero two dash the fork two ways down the same hole" as one unbroken string; never lands on "Whatever's shaping the work right now." via heading jump; activating the hero's Fork-jump link moves the page but never their focus point.

**Casey (Mobile)**: After the hero, Casey's instinct is to tap the falling-dot cue to jump to the Fork — but its 1px-wide box means the tap almost certainly misses. If Casey does reach the marquee, the only touch-accessible pause control is a 28px-tall button, under the site's own 44px standard.

**Riley (Stress Tester)**: A future content edit that clears all `startHereOrder` flags would silently ship "Start Here — 0 essays, ~0 min →" with no guard.

## Minor Observations

- The pull-quote, About, and Contact sections keep clean single-purpose `<h2>`s — the heading-concatenation bug is isolated to sections 02/03, not systemic.
- Hovering/clicking anywhere on the marquee row still pauses it (by design, per code comments) without updating the toggle button's own label/`aria-pressed` — intentional, not a bug, but worth knowing if it ever reads as a "control doesn't reflect true state" complaint.
- Nav carries 7 links sitewide (persistent utility nav, not a single decision point) — a softer violation than it would be inline, unchanged from before.
- The fixed nav's gradient scrim was flagged then ruled out on inspection — deliberate, correct implementation, not a defect.
