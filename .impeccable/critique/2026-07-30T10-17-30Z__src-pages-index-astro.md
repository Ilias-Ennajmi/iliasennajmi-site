---
target: homepage (src/pages/index.astro)
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-07-30T10-17-30Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review · B: detector+browser-evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Scroll-synced SectionPath diamonds give good progress feedback; theme toggle lacks `aria-pressed` for its current state |
| 2 | Match System / Real World | 4/4 | Voice ("Pick a door," "the long way home, basically") matches an unhurried essayist's real register |
| 3 | User Control and Freedom | 2/4 | Loose Threads marquee auto-scrolls indefinitely with no keyboard-operable pause (WCAG 2.2.2 gap) |
| 4 | Consistency and Standards | 3/4 | Diamond motif + accent split applied with real discipline elsewhere, but ContactLinks assigns the Ulysses-only "Coffee" accent to strand-unrelated links (LinkedIn/Threads) |
| 5 | Error Prevention | 3/4 | Newsletter form has honeypot + native POST + type=email; no inline validation beyond browser defaults |
| 6 | Recognition Rather Than Recall | 4/4 | Fork cards show latest essay per strand inline; active-page underline in nav |
| 7 | Flexibility and Efficiency | n/a | Read-mode surface; not applicable to a reading homepage |
| 8 | Aesthetic and Minimalist Design | 3/4 | Restraint holds structurally (zero shadows, one accent, confirmed by DOM scan) but the hero alone stacks 7+ discrete elements |
| 9 | Error Recovery | 3/4 | Native email-type/required cues present; unverified whether a failed Netlify POST gives user-facing feedback |
| 10 | Help and Documentation | n/a | Not applicable to a reading homepage; About page serves this role elsewhere |

**Total: 25/32 applicable (78%) — Good**

## Design Specificity Verdict

**LLM assessment**: Not a swappable template. The Fork section's copy ("Why people act." / "Who profits when they do."), the Loose Threads marquee's five behavioral-economics one-liners, and the pull-quote ("The most expensive choices are the ones you never noticed you were making") are all written specifically for this site's dual-strand thesis. The one weak spot: "The Shelf"'s "Music I spin" / "Books I loved" columns read as generic personal-site "currently into" furniture, though "My latest reads" (Cialdini, Kahneman, Schwartz) and the "Ulysses" Joyce wink redeem it partially.

**Deterministic scan**: `detect.mjs` exit code 2, 65 findings across `src/pages/index.astro`, `src/components/HeroTitlePage.astro`, `src/styles/global.css` (none in `SectionPath.astro`): 3 `layout-transition` warnings (animating `width`/`max-height` instead of transform — minor jank risk, not layout-breaking), 55 `design-system-font-size` advisories, 9 `design-system-color` advisories, 2 `design-system-radius` advisories (both `border-radius:1px` on focus-ring corners).

Cross-checked against DESIGN.md: the 55 font-size hits are near-entirely fluid `clamp()` endpoints — DESIGN.md's Layout section explicitly documents fluid `clamp()` sizing as the real system, so the detector's static ramp just doesn't recognize that syntax. **False positive**, not drift. The `border-radius:1px` hits are the global `:focus-visible` outline's corner nudge — functionally indistinguishable from "sharp," **false positive** against the Sharp-Except-Pills rule's intent. 6 of the 9 color hits (`#fff`/`#000`/`#555`) live entirely inside the `@media print` block, where true black/white is the correct, intentional override for printed output — **false positive**. The remaining 2 color hits are real: `#e8e1cf` and `#efe7d4` (index.astro:198,201) are near-duplicates of the documented `--coal`/`--coal-soft` tokens but not equal to them — likely a hardcoded gradient stop that drifted from the token system (see Minor Observations).

**Visual overlays**: Not available — the sandboxed browser pane could not composite/screenshot in this environment. Compensated with DOM/JS-based evidence (full-page `getComputedStyle` box-shadow scan across every element, programmatic WCAG contrast check across 131 text elements, overflow checks at 1280px and 375px) instead, which for these specific mechanical checks is equivalent or more precise than a screenshot.

## Overall Impression

The homepage genuinely executes its own documented design system — zero shadows confirmed by a full-DOM scan, the one-accent rule holds almost everywhere, and the twin-strand thesis is demonstrated structurally (identical Ulysses/Ilias tile markup, differing only by accent color) rather than just described in copy. The biggest opportunity: the page's actual differentiator — the choice between two strands — is invisible until ~2 screen-heights of scroll, and the semantic HTML underneath the (visually disciplined) design doesn't match its own polish, with 3 of 5 sections carrying no heading at all.

## What's Working

1. **Numerically-verified restraint on the one-accent rule.** Oxblood measures 5.78:1 and Signal Red measures 3.85:1 against the paper ground — Signal Red is used *only* where large-text AA (3:1) applies (hero h1, pull-quote emphasis), exactly matching DESIGN.md's "Vivid-Is-Rare Rule." This is enforced correctly everywhere checked, not accidental.
2. **The diamond motif carries real structural weight.** It recurs as the hero coin's markers, SectionPath's lit nodes, the Fork's "New here?" tag, and the Shelf's bullets — one shape doing, per DESIGN.md's own framing, "quietly everywhere what a logo would do loudly." Reusing one shape across five unrelated components without it feeling like reused clip-art is a real craft achievement.
3. **The Fork section performs the site's thesis rather than just stating it.** The Ulysses and Ilias tiles share identical markup/spacing/type scale, differing only by the coffee/oxblood swap — structurally demonstrating "same mechanism, two angles" rather than just writing that idea in a paragraph.

## Priority Issues

- **[P1] Three of five homepage sections have no semantic heading.** Only two `<h2>`s exist in the entire DOM ("Who's speaking?", "Get in touch."); "The Fork" (the actual strand-choice UI), "Loose Threads," and "The Shelf" are all styled `<div>`s. A screen-reader user navigating by heading list skips the entire strand-selection section — the site's core value proposition — entirely.
  **Why it matters**: This isn't a cosmetic a11y gap; it hides the one piece of navigation that embodies the site's whole positioning from anyone using assistive tech's primary wayfinding tool.
  **Fix**: Promote the existing numbered section labels ("02 — The Fork," "03 — Loose Threads," "04 — The Shelf") to real `<h2>` elements. Visual Label typography doesn't need to change, only the tag.
  **Suggested command**: `/impeccable harden`

- **[P1] The Loose Threads marquee has no keyboard-operable pause control.** It only binds `mouseenter`/`mouseleave` (desktop hover) and a touch-only tap toggle gated behind `(hover:none)` — a keyboard-only user has no way to stop indefinitely-scrolling text, a WCAG 2.2.2 (Pause, Stop, Hide) gap.
  **Why it matters**: Continuous auto-scrolling text with no keyboard escape is a documented, specific WCAG failure, not a style nitpick — it actively blocks a category of user.
  **Fix**: Add a small focusable pause/play affordance (the diamond marker works as a ready-made icon) reachable by Tab.
  **Suggested command**: `/impeccable harden`

- **[P2] The command-palette search input has no accessible name beyond its placeholder.** `#cmdk-input` (global chrome, opened from every page including the homepage) has no `<label>` and no `aria-label` — placeholder-only naming is a known gap since placeholder text isn't reliably exposed as an accessible name across AT/browser combinations.
  **Why it matters**: The ⌘K search is the site's primary power-user navigation path; if its accessible name silently disappears in some screen-reader/browser combos, that whole path breaks for Sam without any visible symptom for sighted testers.
  **Fix**: Add `aria-label="Search essays"` to the input directly (redundant with the visible placeholder for sighted users, but gives AT a reliable name).
  **Suggested command**: `/impeccable clarify`

- **[P2] The Ulysses-only "Coffee" accent is applied to strand-unrelated contact links.** `ContactLinks.astro` hardcodes LinkedIn and Threads to `contact-tide` (Coffee) while Email/Instagram/Substack get `contact-ember` (Oxblood) — but DESIGN.md's own Named Rule states Coffee "exists solely to mark 'this is Ulysses content'... never as a general highlight color." LinkedIn has no relationship to the Ulysses strand.
  **Why it matters**: This is the project's own documented rule being violated in its own codebase — exactly the failure mode DESIGN.md exists to prevent, and it will keep recurring in future work unless fixed at the source.
  **Fix**: Make all ContactLinks hover states Oxblood-only, or drop the accent split entirely (the existing border-color hover shift is enough feedback on its own).
  **Suggested command**: `/impeccable polish`

- **[P2] The two-strand choice is invisible for ~2 screen-heights, and then arrives as three co-equal CTAs.** Measured via DOM offsets: the Fork section begins at 1518px scrollY against a 720px viewport (>2x scroll before any explicit strand choice appears), and once it does, "Start Here," "Ulysses," and "Ilias" all carry equal visual weight with no sequencing — diluting the site's own stated core differentiator (per PRODUCT.md's Positioning section) by making it compete with a tertiary curated-path callout.
  **Why it matters**: PRODUCT.md names the cross-strand pairing as one of exactly two things that differentiate this site — burying the mechanism that demonstrates it undercuts the homepage's one job.
  **Fix**: Surface a lighter visual cue toward the Fork earlier (even reusing the existing coffee/oxblood split already applied to "a behavior obsessive" / "a marketing strategist" in the hero byline), and visually subordinate "Start Here" beneath the primary Ulysses/Ilias choice.
  **Suggested command**: `/impeccable layout`

## Persona Red Flags

**Sam (Accessibility-Dependent User)**: Navigating by heading shortcut (H key), Sam jumps from "Who's speaking?" straight to "Get in touch.", skipping the entire strand-selection UI and the marquee (P1 above). If also using keyboard/switch navigation, Sam has no way to stop the auto-scrolling Loose Threads quotes (P1 above). And if relying on a screen reader that doesn't expose placeholder text as a field name, the ⌘K search field reads as unlabeled (P2 above).

**Jordan (Confused First-Timer)**: Jordan reads the hero's HN-commenter joke and has no obvious next action — the actual "start reading" decision sits ~2 screens down, and once reached, asks Jordan to pick between three simultaneous, equally-weighted CTAs rather than being guided toward one clear next step.

**Casey (Distracted Mobile User)**: Casey's only way to pause the Loose Threads marquee is an undocumented tap-to-toggle with zero visual affordance indicating the interaction exists at all — nothing on screen hints that tapping does anything.

## Minor Observations

- Two hardcoded hex colors (`#e8e1cf`, `#efe7d4` in index.astro) are near-but-not-exact duplicates of the documented `--coal`/`--coal-soft` tokens — likely a gradient stop that drifted from the token system; worth swapping to the actual CSS variables.
- 3 `layout-transition` detector warnings (`transition: width` ×2 in index.astro, `transition: max-height` in global.css's `.shelf-note`) animate layout-affecting properties instead of `transform`/`opacity` — low risk of jank, not layout-breaking, but a cheap perf win if touched anyway.
- Theme-toggle button's `aria-label` is static and doesn't announce current state to assistive tech (no `aria-pressed`).
- CSS custom-property names (`--coal`, `--bone`, `--ash`, `--tide`, `--ember`) don't match DESIGN.md/design.json's documented token names (`paper`, `ink`, `umber`, `coffee`, `oxblood`) — hex values match exactly 1:1, so this is naming drift between the doc and the code, not a visual defect, but could confuse future cross-referencing.
- SectionPath's decorative connecting-line SVG has no `aria-hidden="true"` (unlike the hero's decorative SVG, which does) — low-impact since it has no readable content, but inconsistent with the rest of the page's practice.
- Nav bar's 7 top-level links sit at the edge of the "≤4 per decision point" guidance — sitewide chrome, not homepage-specific, so noted rather than scored.
- No horizontal overflow found at 1280px or 375px (`scrollWidth` matched `innerWidth` at both) — the PRODUCT.md-mandated 375px check holds.
