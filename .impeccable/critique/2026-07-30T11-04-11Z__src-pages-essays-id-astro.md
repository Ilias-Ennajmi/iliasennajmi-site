---
target: essay reader page (src/pages/essays/[id].astro, tested via /essays/first-number/)
total_score: 26
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 2
timestamp: 2026-07-30T11-04-11Z
slug: src-pages-essays-id-astro
---
Method: dual-agent (A: design-review · B: detector+browser-evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Reading meter is 0.58rem and near-invisible until 1.5% scroll; Cite/Save state changes are text-only with no `aria-live` |
| 2 | Match System / Real World | 4/4 | Essayistic, direct voice, no funnel language |
| 3 | User Control and Freedom | 2/4 | Global ArrowLeft/Right instantly navigates away with no confirm, guarded only against form fields |
| 4 | Consistency and Standards | 3/4 | Diamond/pill/hairline motif holds; but "Now ask why people act" / "The occasional letter" section titles are unstyled `div`/`span`, not real headings |
| 5 | Error Prevention | 3/4 | Clipboard-copy has a `window.prompt` fallback; anchor-demo silently no-ops on invalid input |
| 6 | Recognition Rather Than Recall | 3/4 | Prev/next show real titles; TOC/sidenotes never render on any live content |
| 7 | Flexibility and Efficiency | 3/4 | Arrow-key nav + ⌘K serve returning readers; no text-size/reading-preference controls |
| 8 | Aesthetic and Minimalist Design | 4/4 | One accent, sharp edges, generous whitespace — strongest heuristic on the page |
| 9 | Error Recovery | 2/4 | No visible error state anywhere on the page; anchor-demo fails silently on bad input |
| 10 | Help and Documentation | n/a | Not applicable to a Read-mode surface |

**Total: 26/36 applicable (72%) — Good**

## Design Specificity Verdict

**LLM assessment**: The page has real bones no generic Markdown-blog template would have — a bespoke interactive anchoring demo, a completion "meter-flash" tied to the site's diamond motif, Tufte-style sidenote infrastructure, prev/next shown by actual title. But this is the report's central finding: **none of the 6 published essays contain a single footnote (`[^n]`), and none have the ≥3 `##` headings the Contents/TOC needs to render.** Every live essay is ~200-315 words (~1 minute), against PRODUCT.md's stated 5-12 minute target. The two most distinctive "reading room" features this page should be judged on are currently dead code paths in production, not proven experience.

**Deterministic scan**: `detect.mjs` exit code 2, 34 findings across `src/pages/essays/[id].astro` and `src/styles/global.css`: 27 `design-system-font-size` advisories (clamp fluid endpoints — same documented false positive as the homepage critique: DESIGN.md's Layout section explicitly names fluid clamp() as the real system), 1 `layout-transition` warning (`global.css:218`, the `.shelf-note` max-height transition — same pre-existing item already logged as a Minor Observation in the homepage critique, unrelated to this page), 6 `design-system-color` advisories (5 of these are `#fff`/`#000`/`#555` inside the `@media print` block — same confirmed false positive as before), 2 `design-system-radius` advisories (`border-radius:1px` — the focus-ring corner, same false positive as before).

**Independent confirmation, not just one agent's read**: Assessment B independently grepped every published and draft essay for footnote syntax (`\[\^`) and found zero matches anywhere — hard evidence behind Assessment A's design-specificity verdict, not just an impression.

**Visual overlays**: Not available — the sandboxed browser pane could not composite/screenshot. Both assessments compensated with DOM/JS-based evidence (computed box-shadow scan, programmatic contrast checks, localStorage/state inspection on Save/Cite, overflow checks at 1440px/375px) instead.

## Overall Impression

The page executes its documented type system with real precision — measured line-height/font-size ratio is exactly 1.66 at 1280px, matching DESIGN.md's claim that this is "the system's single most load-bearing typographic decision." The completion flash is genuinely considered: one-shot, reduced-motion-safe, feeding a private log rather than a public reward banner. But the page can't currently demonstrate its own thesis — its signature reading features (sidenotes, TOC) have never rendered against real content because no published essay is long enough or footnoted enough to trigger them — and a real, diagnosed accessibility gap (zero focus-visible outline on any native `<button>`) sits underneath otherwise disciplined visual restraint.

## What's Working

1. **`InteractiveAnchor.astro` is genuinely bespoke, not template chrome.** It deliberately declines to fabricate aggregate reader stats ("inventing an aggregate would be exactly the dishonesty the essay is about"), uses the diamond kicker and mono labels, and correctly handles `focus-visible` and `prefers-reduced-motion`. This is the strongest evidence the site can build features specific to its own argument.
2. **Body typography hits its documented target under actual measurement, not assumption** — verified live at 1280px: `21.76px` font-size, `36.12px` line-height = exactly 1.66.
3. **The completion `meter-flash` is built exactly as DESIGN.md describes it** — the one recurring shape catching light once, gated behind `prefers-reduced-motion`, feeding a private reading log rather than a congratulatory banner.

## Priority Issues

- **[P0] Zero focus-visible outline on any native `<button>` on this page.** Verified directly: `.cite-btn`, `.save-btn`, `.listen-btn`, and the theme toggle all compute `outlineStyle: "none"` when focused. Root cause: `global.css:77`'s global rule (`a:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--ember)... }`) only matches `<a>` and elements with an explicit `[tabindex]` — plain `<button>` elements never match it, despite DESIGN.md explicitly stating this outline applies "sitewide, on every focusable element."
  **Why it matters**: This is the project's own documented accessibility invariant silently failing on its most interactive page — a keyboard user tabbing through Cite/Save/Listen/theme-toggle gets no visual focus feedback anywhere.
  **Fix**: Add `button` to the global selector: `a, button, [tabindex]:focus-visible`.
  **Suggested command**: `/impeccable harden`

- **[P1] 56px horizontal overflow at 375px width, with two independently-measured but conflicting root causes.** Both assessments measured the identical number (`scrollWidth: 431` vs `clientWidth: 375`) but disagree on cause: Assessment A attributes it to the byline/share-row's unwrapped `flex` `nowrap`; Assessment B traces it to the newsletter-signup honeypot field (`position:absolute; left:-9999px`), noting `body{overflow-x:hidden}` prevents it from being a user-scrollable problem in practice.
  **Why it matters**: Whichever the exact cause, this violates the project's own stated QA bar ("the layout is verified at 375px mobile width for overflow on every visual change" — PRODUCT.md) on measurement alone, even if not currently visible to a real user.
  **Fix**: Add `flex-wrap: wrap` to the byline/share-link row regardless of final cause — cheap, safe, and directly addresses Assessment A's specific finding; if the overflow number persists after that, the honeypot field is the remaining suspect.
  **Suggested command**: `/impeccable adapt`

- **[P1] The two most distinctive "reading room" features have never rendered against real content.** No published or draft essay contains footnote syntax or ≥3 `##` headings — confirmed by direct grep, not inference — so sidenotes and the Contents/TOC menu are unexercised in production. Combined with every essay running ~1 minute against PRODUCT.md's stated 5-12 minute target, this isn't a bug so much as a standing gap between the page's design ambition and the site's actual content.
  **Why it matters**: This is the design-specificity risk the whole critique should be read against — a page can't be judged as executing its thesis if the content never invokes the mechanism that thesis depends on.
  **Fix**: Not a code fix — the next real essay should deliberately use at least one footnote and a proper `##`-structured outline, both to serve the writing and to give this code its first real production test.
  **Suggested command**: (content, not a design command — flagging for the standing "write the next essay" item already in project memory)

- **[P2] The Share/Cite/Save/Listen row is a flat 5-item group sitting before the first paragraph.** Violates the ≤4-items-per-chunk cognitive-load guideline, and gives "share to others" (X, LinkedIn) and "do something with your own read" (Cite, Save, Listen) identical typography with only a small dot separator — no grouping distinguishes the two different intents.
  **Why it matters**: This is the exact point where the page should have single focus on "start reading," and instead front-loads a small wall of options.
  **Fix**: Visually separate the two groups, and/or relocate Cite/Save/Listen down to the existing end-of-article marker (`{endLabel}` row), which is already a natural secondary-actions zone.
  **Suggested command**: `/impeccable layout`

- **[P2] Global ArrowLeft/ArrowRight navigation has no guard beyond input/textarea/select focus.** Fires while focused on any toolbar button, mid-text-selection, or mid-TTS playback, and navigates instantly with no confirmation.
  **Why it matters**: A reader using arrow keys for any other reason (adjusting a text selection, general keyboard navigation) gets silently redirected off the page they're reading.
  **Fix**: Additionally guard against focus being on any button/link, or require a modifier key, or scope the shortcut to only fire when no interactive element has focus.
  **Suggested command**: `/impeccable harden`

## Persona Red Flags

**Sam (Accessibility-Dependent User)**: Zero focus-visible outline on all four page buttons (P0 above). Cite/Save button-text state changes have no `aria-pressed`/`aria-live`, so a screen-reader user gets no confirmation an action succeeded. Past the `<h1>`, this page has exactly one heading in the accessibility tree — "Now ask why people act" and "The occasional letter" are unlabeled `<div>`s, so heading-navigation gives no waypoints for the paired-essay or newsletter sections.

**Riley (Deliberate Stress Tester)**: The arrow-key hijack redirects away from the page with no warning (P2 above). The wide-screen sidenote positioning math (`left:100%; margin-left:36px; width:200px`, gated at `min-width:1280px`) has never been checked against real content in any audit, because nothing in production currently triggers it — the first real long essay with footnotes is effectively the first QA pass that code will ever get.

**Casey (Distracted Mobile User)**: The byline/share row's measured 375px overflow (P1 above). X/LinkedIn/Cite/Listen touch targets measured 13px tall with no padding — well under any reasonable tap-target minimum.

## Minor Observations

- Reading meter text sits at 0.58rem, opacity 0 until 1.5% scroll progress, settling at 0.55 opacity after completion — easy to miss entirely for both its "X min left" utility and its role as the emotional payoff cue.
- Internal CSS variable naming is inverted relative to intuition (`--coal` = the light-theme paper background, `--bone` = ink text) — output colors match `design.json` correctly, this is purely a naming-convention note for future contributors.
- Desktop measure is ~53ch (552px inside a 680px capped column), narrower than the commonly-cited 65-75ch target — not unreadable, but worth knowing it runs narrow.
- The `data-reveal` fade/rise applied to every paragraph is sitewide-consistent but worth a second look specifically on the reading surface, where it re-triggers every scroll-step during active reading — mild motion tax during otherwise "unhurried" reading.
- The completion peak (meter-flash) is immediately followed by three consecutive asks (paired-essay CTA, newsletter signup, prev/next nav) with no moment of earned quiet in between.
- `layout-transition` detector hit at `global.css:218` (`.shelf-note` max-height transition) is a pre-existing item already logged in the homepage critique, unrelated to this page's own changes — not re-littigating here.
- Dev-console showed a repeated `SendBeforeConnectError` from Astro's dev toolbar — confirmed dev-tooling noise, not application code, doesn't appear in production builds.
