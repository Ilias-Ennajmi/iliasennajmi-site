# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Readers interested in the hidden mechanics of choice — why people act, and who profits when they do. Two overlapping audiences read across two strands: **Ulysses** (`/ulysses/`, psychology-of-decision-making essays) and **Ilias** (`/ilias/`, marketing/business-strategy essays), explicitly cross-linked so a reader of one is invited into the other. Situation: casual, unhurried reading (essay lengths 5-12 min, with sidenotes, a reading meter, TTS read-aloud, and a save-for-later list built for return visits, not one-off skims).

## Product Purpose

A personal essay site for Ilias Ennajmi, a marketing strategist, publishing long-form writing that pairs a psychology essay with a marketing essay on the same underlying mechanism (e.g. anchoring bias / anchoring in pricing). Primarily a public writing practice, done for its own sake — not a lead-generation funnel. Success is honest, well-crafted essays that reward a returning reader, not traffic or conversion metrics.

## Positioning

Two things reinforce each other, roughly equally, and neither alone is the real differentiator: (1) the structural idea of pairing a psychology essay with a marketing essay on the same mechanism (the cross-strand format itself, visualized in the `/topics` constellation map), and (2) Ilias's own practitioner point of view as a working marketing strategist, not an academic or aggregator.

## Operating Context

Astro static site + Decap CMS (git-backed, DecapBridge auth) for essay authoring, deployed to Netlify (`iliasennajmi-site.netlify.app`, auto-deploy on push to `main`). Content lives as markdown in `src/content/{ulysses,ilias}/` with a `draft` flag and a `pairsWith` field linking cross-strand essays. Reader-facing tools: ⌘K command palette, sidenotes, cite/highlight-share, TTS read-aloud, save-for-later + honest reading-log stats, ink/paper theme toggle, OG image generation, RSS/llms.txt.

## Capabilities and Constraints

- Content is intentionally thin right now: only 6 of 12 originally-drafted essays are published (3 per strand); the other 6 are `draft: true` after a mid-2026 audit found them to be AI-template filler with fabricated read times. Re-publishing any of them requires it to actually be rewritten, not just un-flagged.
- Read times are computed from real word counts, not invented.
- No third-party brand assets: never embed another creator's real logo or brand mark, even as a placeholder (hit before with a Neuebel&Mark-style palette reference — the palette was fine to adapt, a literal logo would not have been).
- Social links (`src/lib/site.ts`) are deliberately nullable — an unconfigured account renders nothing rather than a dead or generic link. Currently configured: LinkedIn, Instagram, Threads, Substack. X is intentionally left unset.
- Analytics (Cloudflare/GoatCounter/Plausible) are opt-in and env-var-gated; zero third-party scripts load unless configured.
- Known recurring implementation bug pattern: any component whose markup is rebuilt via `innerHTML` (search results, dynamic lists) needs `<style is:global>`, not scoped `<style>`, or the styles silently don't apply.

## Brand Commitments

- Fonts: Fraunces (display/serif headlines), EB Garamond (body serif), Space Grotesk (mono/label accents) — all self-hosted via Fontsource.
- Palette: warm light-beige paper ground (not pink/salmon-tinted), near-black ink text, a red accent split into two tokens — a WCAG-AA-safe `--ember` for text/links and a more vivid `--ember-vivid` reserved for headline punctuation and other large/high-impact decorative text only. A subtle grain-texture overlay is part of the identity, not an accident. Mirrored ink (dark) theme.
- Voice: direct, unhurried, essayistic — no funnel language, no fake urgency. The About page's one consulting-inquiry line was deliberately worded against the site's existing "no funnel" copy.
- Visual motif: a repeated diamond/rhombus mark (used in the hero, the ⌘K palette, the topics constellation map, and rating-style decorative rows).

## Evidence on Hand

- 6 real, published essays (3 Ulysses, 3 Ilias), each part of a genuine cross-strand pair.
- No testimonials, client logos, case studies, or press are on the site, and none should be fabricated or implied.

## Product Principles

1. Writing quality and honesty outrank feature count or traffic — do not propose new features before checking whether the user actually wants to write next.
2. Every design choice should read as a deliberate editorial decision, not a template default — verify (contrast, hue, spacing) numerically rather than eyeballing or copying a reference at face value.
3. Consulting is a quiet, secondary door, not a priority — protect the reading experience over conversion mechanics.
4. Never overstate what's real: no invented read times, no dead social links, no placeholder brand assets, no fabricated proof.

## Accessibility & Inclusion

WCAG AA contrast is enforced sitewide (scripted contrast audits across every page/theme before each palette change), `prefers-reduced-motion` is honored throughout (scroll-driven animations render fully-drawn/static instead), and the layout is verified at 375px mobile width for overflow on every visual change. No further accessibility requirement has been established beyond AA.
