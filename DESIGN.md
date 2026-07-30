---
name: Ilias Ennajmi — Why people act, who profits
description: A quiet, paper-and-ink essay site pairing psychology and marketing writing under one restrained red accent.
colors:
  paper: "#ebe5db"
  paper-soft: "#e3dac9"
  paper-line: "rgba(41, 28, 15, 0.14)"
  ink: "#291c0f"
  umber: "#574738"
  coffee: "#755938"
  oxblood: "#a52716"
  signal-red: "#d92e1c"
typography:
  display:
    fontFamily: "'Fraunces Variable', 'Fraunces', Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 6.5rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'EB Garamond Variable', 'EB Garamond', Garamond, 'Hoefler Text', Georgia, serif"
    fontSize: "clamp(1.18rem, 1.9vw, 1.36rem)"
    fontWeight: 400
    lineHeight: 1.66
  label:
    fontFamily: "'Space Grotesk Variable', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  none: "0"
  pill: "40px"
  circle: "50%"
spacing:
  gap-sm: "8px"
  gap-md: "16px"
  gap-lg: "24px"
  section-y: "clamp(3.5rem, 7vw, 6rem)"
  hero-y: "clamp(8rem, 16vh, 12rem)"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.oxblood}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.oxblood}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.umber}"
    typography: "{typography.label}"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  list-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "13px 20px"
  list-item-active:
    backgroundColor: "{colors.paper-line}"
    textColor: "{colors.ink}"
    padding: "13px 20px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 3.5vw, 42px)"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
---

# Design System: Ilias Ennajmi — Why people act, who profits

## Overview

**Creative North Star: "The Reading Room"**

A quiet, paper-and-ink space built for uninterrupted long-form reading — every decision defers to the words on the page rather than competing with them. The voice is unhurried and precise: pacing is editorial, never urgent, with nothing on the page performing for attention it hasn't earned. Two long-form strands (Ulysses for psychology, Ilias for marketing) are typographically identical twins distinguished only by a single accent-color swap (coffee brown vs. oxblood red), so the reading experience itself argues the site's whole thesis — these are the same mechanism, seen from two angles.

Depth is conveyed only through tonal layering and hairline dividers, never shadows; color is almost entirely absent except for one recurring red, spent rarely and on purpose. The repeated diamond mark — a small square rotated 45°, standing in for bullets, ticks, active-state dots, and section nodes — is the system's one recurring shape, doing quietly everywhere what a logo would do loudly.

**Key Characteristics:**
- Warm beige paper ground with near-black ink text — never true white/black
- Exactly one accent hue family (oxblood/signal-red), spent sparingly
- Flat surfaces throughout: zero box-shadows, depth via tone + hairline only
- Sharp rectangular edges by default; pill and circle are the only rounded exceptions
- One recurring diamond mark as the sole decorative motif
- Fully mirrored dark ("ink") theme, toggled with a signature circular ink-pour transition

## Colors

A near-monochrome warm paper palette carries almost the entire system; the oxblood/signal-red pair is the only real color, and it is rationed.

### Primary
- **Oxblood** (`#a52716` / `{colors.oxblood}`): the everyday accent — body links, small icons, active-state underlines, strand-accent color for the Ilias (marketing) strand. AA-contrast-safe against the paper ground by construction (verified ≥5.7:1 on every page/theme pass).
- **Signal Red** (`#d92e1c` / `{colors.signal-red}`): a rarer, more saturated flare reserved for headline punctuation, drop caps, pull-quote borders, and other large/high-impact decorative moments only. Never used for body text or large surface fills.

### Secondary
- **Coffee** (`#755938` / `{colors.coffee}`): the Ulysses (psychology) strand's accent, standing in exactly where Oxblood would stand for Ilias content — same role, different strand, never used as a general-purpose third color.

### Neutral
- **Paper** (`#ebe5db` / `{colors.paper}`): the base ground color sitewide — warm beige, explicitly not pink/salmon-tinted (a hue correction made after direct user feedback that an earlier pass "read reddish").
- **Paper Soft** (`#e3dac9` / `{colors.paper-soft}`): secondary surface tone — card backgrounds, hover states, code blocks, the command-palette panel.
- **Paper Line** (`rgba(41,28,15,0.14)` / `{colors.paper-line}`): the hairline border/divider color used everywhere depth or separation is needed instead of a shadow.
- **Ink** (`#291c0f` / `{colors.ink}`): primary text color — a warm near-black, never pure `#000`.
- **Umber** (`#574738` / `{colors.umber}`): muted label, meta, and secondary-text color (nav links at rest, timestamps, byline chrome).

### Named Rules
**The One Accent Rule.** Exactly one hue family (Oxblood/Signal Red) is allowed to carry emphasis or urgency anywhere in the system. Coffee is not a second accent — it exists solely to mark "this is Ulysses content," never as a general highlight color.

**The Vivid-Is-Rare Rule.** Signal Red is reserved for headline punctuation, drop caps, and pull-quote accents. The moment it would appear in body copy, a link, or any surface larger than a few square centimeters, use Oxblood instead — Signal Red's whole effect depends on staying rare.

## Typography

**Display Font:** Fraunces Variable (with Georgia fallback)
**Body Font:** EB Garamond Variable (with Garamond/Hoefler Text/Georgia fallback)
**Label/Mono Font:** Space Grotesk Variable (with Helvetica Neue/Arial fallback)

**Character:** A classic editorial serif pairing (a warm display serif over a literary body serif) with one deliberately foreign element — a geometric grotesk for every piece of UI chrome — so structure (nav, labels, metadata) always reads as distinctly *system*, never mistaken for the writing itself.

### Hierarchy
- **Display** (500 weight, `clamp(3rem, 9vw, 6.5rem)`, 0.94 line-height): hero titles, page `<h1>`s, drop caps, blockquote text. Tight leading, slightly negative tracking (`-0.015em`).
- **Body** (400 weight, `clamp(1.18rem, 1.9vw, 1.36rem)`, 1.66 line-height): essay paragraph text. Generous line-height is deliberate — this is the system's single most load-bearing typographic decision, since reading comfort over long essays is the product.
- **Label** (600 weight, `0.66rem`, 0.18em letter-spacing, uppercase): every piece of UI chrome — nav links, buttons, eyebrows, metadata, timestamps, kbd hints. Always small, always uppercase, always wide-tracked.

### Named Rules
**The Mono-Never-Reads Rule.** Space Grotesk appears only as short uppercase labels and UI chrome. It never sets a sentence of actual prose — the instant it would, that's Fraunces or EB Garamond's job instead.

## Layout

Content sits in a centered column capped around 1180px. Above 1360px, an outer margin opens up on either side for oversized decorative numerals/letters (the `.wm` watermark glyphs) to bleed into — below that width, they simply don't render rather than clipping awkwardly close to the text. Section rhythm is fluid throughout via `clamp()`: hero/header blocks use roughly `clamp(8rem, 16vh, 12rem)` of vertical breathing room, ordinary sections use `clamp(3.5rem, 7vw, 6rem)`. Component-internal gaps step in three rough bands — 8px (tight inline gaps), 16px (component-to-component), 24px (group-to-group) — all expressed as fluid `clamp()` values rather than fixed breakpoints, so density scales continuously with viewport instead of snapping.

Mobile nav collapses to a full-screen drawer under 860px; every tap target in that drawer holds a 44px minimum height. The whole system is verified at 375px width for overflow on every visual change.

## Elevation & Depth

**The Paper Doesn't Float Rule.** Zero box-shadows exist anywhere in the system (confirmed by scanning every stylesheet — the one occurrence is `box-shadow: none !important` in the print reset). Real paper doesn't cast a shadow on itself, and neither does this UI: depth is conveyed entirely through tonal layering (Paper vs. Paper Soft) and 1px hairline dividers (Paper Line). A design that reaches for a shadow to separate two surfaces has reached for the wrong tool here — reach for a hairline or a background shift instead.

## Shapes

**The Sharp-Except-Pills Rule.** Rectangular elements — cards, panels, containers, images, embeds, inputs — carry zero corner radius by default; edges are exact and drafting-table precise. Two deliberate, narrow exceptions: CTA buttons (pill-shaped, `40px` radius, used only for standalone calls-to-action like "See all Ulysses →") and small circular dots/nodes (`50%`, used for status indicators and active markers). Nothing else rounds. Rounded corners are punctuation, not a default.

The recurring **diamond** — a small square rotated 45° — is the system's one decorative geometry: list bullets, section-header ticks, active nav-state markers, command-palette result dots, and the reading-meter's completion flash all use the exact same rotated square rather than a bespoke icon set.

## Components

### Buttons
- **Shape:** pill (`border-radius: 40px`), 1px solid Paper Line border, transparent background.
- **Primary CTA:** Label typography, uppercase, colored Oxblood (or Coffee on Ulysses-strand pages), `padding: 14px 26px`.
- **Hover:** border-color deepens toward the accent color and letter-spacing widens slightly — no fill, no shadow, the button never becomes a solid block.
- **Icon-only utility buttons** (theme toggle, search trigger in the nav bar): square, `1px solid Paper Line`, no radius, `36px` min-height; hover shifts text/border to Ink.

### Cards / Containers
- **Corner Style:** none — always sharp (`{rounded.none}`).
- **Background:** Paper by default; Paper Soft on hover or as a secondary surface (e.g. the command-palette panel).
- **Border:** 1px solid Paper Line, often only top+bottom (row-style list cards) rather than a full box.
- **Shadow Strategy:** none — see Elevation & Depth.

### Inputs / Fields
- **Style:** borderless, transparent background, sits inside a bordered parent container instead of carrying its own border (the command-palette search input is the canonical example) — set in Display typography at a larger-than-body size so search feels like writing, not filling out a form.
- **Focus:** a 2px Oxblood outline with 3px offset, sitewide, on every focusable element (`:focus-visible`) — never a glow or shadow.

### Navigation
- **Style:** Label typography (mono, uppercase, wide-tracked), Umber at rest, Ink when active, with a 1.5px accent-colored underline (Oxblood, or Coffee on Ulysses pages) marking the current page. Mobile collapses into a full-height drawer with Display-typography page names and 44px tap targets.

### List Items (search results, topic rows, shelf items)
- **Style:** flex row, 1px bottom border in Paper Line, no radius.
- **Active/hover state:** background shifts to Paper Line (never a shadow or scale transform).
- **Signature detail:** a small diamond marker, colored per-strand (Coffee/Oxblood/Umber), sits at the start of each row as the row's only icon.

### Theme Toggle (signature component)
A single icon button (`◐`) that triggers "ink dropped in water": a full-viewport circular `clip-path` wipe, expanding from the clicked button in the *incoming* theme's flat background color, fully covering the screen before the real theme attribute flips underneath (invisibly, since the disc already matches) and then dissolves to reveal the new theme's actual texture and text. Respects `prefers-reduced-motion` by skipping straight to the instant swap.

## Do's and Don'ts

### Do:
- **Do** treat the rotated-square diamond as the system's only decorative marker shape — reuse it rather than introducing a second icon/bullet motif.
- **Do** keep Signal Red rare: headline punctuation, drop caps, pull-quote borders only.
- **Do** set every label/eyebrow/nav/meta string in Label typography (mono, uppercase, wide-tracked) — never in Body or Display.
- **Do** convey separation with a Paper Line hairline or a Paper→Paper Soft tone shift, never a shadow.
- **Do** reserve the 40px pill radius for standalone CTA buttons only.
- **Do** honor `prefers-reduced-motion` on every animated component (scroll-reveals, the diamond flash, the ink-pour toggle) by rendering the end state instantly instead.

### Don't:
- **Don't** add a box-shadow anywhere; the system has none and depends on having none.
- **Don't** introduce a second general-purpose accent color — Coffee is strand-scoped, not a spare accent.
- **Don't** round a card, panel, image, or embed's corners — 0 radius is the default, not an oversight.
- **Don't** set body prose in Space Grotesk, or a UI label in EB Garamond — the pairing's whole effect depends on that boundary staying crisp.
- **Don't** embed a real third-party logo or brand mark, even as a placeholder (a standing product constraint, not a visual-taste call).
