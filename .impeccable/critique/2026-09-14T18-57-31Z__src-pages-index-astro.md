---
target: homepage (src/pages/index.astro)
total_score: 23
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-09-14T18-57-31Z
slug: src-pages-index-astro
---
Method: dual-agent (A: aac2b3a40a5e51a12 · B: a8ac69ab8a8f61387)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Reveal-on-scroll gives no anticipation cue; active-nav underline is a faint 1.5px line |
| 2 | Match System / Real World | 4 | Voice is genuinely conversational, the strongest heuristic on the page |
| 3 | User Control and Freedom | 3 | No way to jump between the 01-05 numbered sections despite implying wayfinding |
| 4 | Consistency and Standards | 3 | Fork tiles' strand-color rule (Coffee/Oxblood) only fires on :hover -- inconsistent with every other strand-colored element on the page |
| 5 | Error Prevention | 4 | Nothing destructive on this page; newsletter field has no aggressive validation traps |
| 6 | Recognition Rather Than Recall | 3 | "Read me" tucks the two actual content strands one click deeper than secondary pages like Topics/Saved |
| 7 | Flexibility and Efficiency | n/a | Homepage has no repeat-use efficiency need |
| 8 | Aesthetic and Minimalist Design | 3 | Visually restrained but informationally long -- 7 full-bleed sections before any essay |
| 9 | Error Recovery | n/a | No error-producing surface exists on this page |
| 10 | Help and Documentation | n/a | Correctly absent on a Persuade-mode homepage |
| **Total** | | **23/28** | **Good (82%)** |

## Design Specificity Verdict

**LLM assessment:** Not template-interchangeable, but the specificity is unevenly distributed. The illustrated face mark, the numbered section system, the Fork-as-literal-IA, and the voice are all genuinely this site's. But strip the copy and the underlying skeleton -- hero + scroll cue, centered pull-quote band, three-column "taste" list, newsletter bar, contact row -- is close to any editorial-template structure. Specificity currently lives in copy and a couple of graphic details, not in the structural choices, which is exactly why a site with real personality can still read as safe.

**Deterministic scan:** The static CLI detector (regex mode on the three .astro source files in isolation) found zero findings -- expected, since it can't see rendered/cascaded styles. The browser-injected overlay detector, run against the actual rendered page, found 69 anti-patterns at desktop width and 71 at mobile, almost entirely one rule repeated across dozens of elements: undersized-ui-text -- every nav label, the "01"-"05" step numbers, "Pause scrolling", all five marquee tags, book/artist names, "Subscribe", "CmdK", the keyboard hints -- rendering between 8.96px and 10.88px. The remaining rules (italic-serif-display, all-caps-body, tight-leading at 1.12-1.22 line-height, wide-tracking at 0.10em, radial-spotlight-glow) are, on inspection, the detector recognizing DESIGN.md's own documented system verbatim -- the italic Fraunces display face, the uppercase wide-tracked Label typography, the tight display leading. These are not bugs; they're the brand signature, and fixing them would mean un-designing the system. The undersized-ui-text volume is different: DESIGN.md specifies Label typography at 0.6-0.66rem (~9.6-10.6px) sitewide by design, so this is also intentional -- but intentional and optimal aren't the same thing. Sub-11px is genuinely hard to read for nav-critical text (not decorative labels), and this is worth a real look rather than a blanket dismissal as "on-brand."

**Visual overlays:** No user-visible overlay is available to point you to -- Assessment B's browser access could inject the detector script and read its console output, but the live server used for the overlay was stopped as part of that assessment's own cleanup, per the critique protocol. The console findings above are the full evidence; nothing is currently drawn on a live page to click through.

## Overall Impression

The site has real ingredients for distinctiveness -- the hand-drawn face mark, the pull-quote moment, a disciplined voice -- but they're deployed as isolated flourishes inside a page structure that plays it safe everywhere else. The single biggest opportunity: the Fork section is explicitly the site's thesis ("the reading experience itself argues the site's whole thesis," per DESIGN.md) but at rest it shows two visually identical grey tiles -- the one place the design should be unmissable is currently the place it's most invisible, especially on mobile where hover doesn't exist.

## What's Working

1. **The pull-quote section.** Large italic Fraunces, centered, isolated by hairlines, with the single Signal-Red flourish on "never noticed." This is DESIGN.md's "Vivid-Is-Rare Rule" doing exactly what it's supposed to -- the color hits harder because it's the only saturated color since the hero.
2. **The hero illustration.** A hand-inked, bespectacled face with a small red mark at the mouth is memorable in a way a headshot or generic icon never would be. It's already the strongest answer on the page to "make it stand out" -- it's just underused.
3. **Voice consistency.** "Built slowly, on purpose," "No schedule, no funnel, no 'quick favor,'" carries through nav, footer, and section labels, not just the hero. Most sites let microcopy go generic outside the hero; this one doesn't.

## Priority Issues

**[P1] The Fork doesn't visually differentiate its two strands at rest.** Both tiles render in identical grey; the Coffee/Oxblood strand-color rule only activates on .js-ulysses:hover / .js-ilias:hover in index.astro. On mobile -- no hover -- a reader never sees the two-strand color identity at all, on the page whose entire stated thesis is that color split.
Why it matters: The site's one documented structural differentiator is invisible at the exact moment it should be most visible, and invisible entirely on touch devices.
Fix: Apply strand color to each tile at rest -- a colored left-edge rule, or resting-state headline color -- not just on hover.
Suggested command: /impeccable bolder

**[P1] Fixed nav collides with scrolling display headlines.** Confirmed at both breakpoints: desktop, the pull-quote's italic text scrolls behind the nav's translucent gradient scrim with only partial legibility; mobile at 375px, "Who's speaking?"'s red question mark sits behind the "MENU" label, and the Fork headline "Why people act." scrolls up with the theme/search icons overlapping "people."
Why it matters: A translucent scrim can't survive display-sized serif type crossing it -- this is a real, repeatable legibility failure, not an edge case.
Fix: Increase scrim opacity or add backdrop-filter: blur() (stays on-brand, no shadow needed).
Suggested command: /impeccable polish

**[P1] The top nav surfaces 9 simultaneous decision targets at equal weight.** Index, Read me (+2 nested), Topics, The Shelf, Saved, About, theme toggle, search, wordmark, all in one row.
Why it matters: For a site whose product truth is "two cross-linked strands," nothing signals that Ulysses/Ilias (behind "Read me") outrank Topics or Saved in importance.
Fix: Either visually promote the Read Me group above the utility links, or make the Fork itself unmissable so the nav's flatness stops mattering.
Suggested command: /impeccable layout

**[P2] The homepage is a lot of homepage before any essay.** Hero -> About -> Fork -> Threads -> Pull-quote -> Shelf -> Contact -> Newsletter -- seven full-bleed sections, and the only essay content visible anywhere is one buried "Latest: [title]" line per Fork tile.
Why it matters: For a product principle that says "protect the reading experience," the homepage spends most of its scroll distance building personality rather than getting someone into a piece of writing.
Fix: Consider whether Shelf and Threads work better as a link-out than full sections, freeing space for 2-3 real essay cards higher up.
Suggested command: /impeccable distill

**[P3] "Loose Threads" reopens unresolved choices right after the Fork asks you to commit to one.** The five aphorisms aren't links, and most don't map to a published essay ("some become essays").
Why it matters: Right after asking the reader to pick a door, this section shows five more doors that don't open.
Fix: Link a thread to its matching essay/topic where one genuinely exists; otherwise move the section later so it reads as bonus texture, not a second decision point.
Suggested command: /impeccable clarify

## Persona Red Flags

**Jordan (first-timer):** The hero's face illustration has alt="" and aria-hidden="true" -- deliberately decorative, so even a curious visitor gets zero explanation of what they're looking at. "Written by a behavior obsessive / a marketing strategist" reads as two unlabeled bio links, not obviously "the site's two content strands," until the Fork explains it -- which itself doesn't visually sell the choice.

**Casey (mobile):** The nav/headline collision is worse here specifically -- confirmed at scroll position ~700px on a 375px viewport. And the Fork's hover-only strand differentiation simply doesn't exist on touch at all: the site's "two colors, two strands" thesis is invisible to every mobile reader by design, not by accident.

**Sam (accessibility-dependent):** The reduced-motion handling is genuinely well-built (verified in source -- every scroll-reveal, the marquee, and the ink-pour toggle all check motionOK() and render end-states instantly). The real gap is the nav scrim/headline collision: it's a compositing interaction that only breaks mid-scroll when specific content lines up behind specific nav elements -- exactly the kind of bug a static contrast audit won't catch.

## Minor Observations

- The falling-dot scroll cue is a nice detail with a thoughtfully-documented 44px tap target, but visually subtle enough to read as decoration rather than an affordance.
- Mobile Shelf stacks to 9 sequential list rows of pure personal-taste content with no essay relevance -- a lot of low-information scroll distance on a homepage.
- The mobile drawer is vertically centered, leaving notable dead air above "Index" and below "About" on a standard 375x812 screen.
- "Read me" as a nav label is slightly ambiguous next to "Index" and "About" -- could easily read as "read this intro text" rather than "here are the essays."
- Many undersized-ui-text hits are on genuinely interactive nav-critical text (9.6-10.88px), distinct from the decorative labels the size choice was designed for -- worth a second look specifically on nav links, not the whole label system.

## Questions to Consider

- If the Fork is really the site's thesis, not decoration, what would make the two-color split impossible to miss at a glance -- background tone, not just hover text color?
- What if the homepage's job wasn't "build atmosphere, then hand off to /ulysses/ and /ilias/" but "let someone start reading in one click from here"? Would Threads and Shelf still deserve full sections against that?
- The face mark is the boldest, most specific asset on the page and it's used once, small, and hidden from assistive tech. What happens if that illustrated hand became a recurring visual actor -- section markers, the 404 page, the theme toggle -- instead of a one-time hero flourish?
