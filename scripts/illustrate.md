# The engraved objects

One object per essay, drawn in the style of the portrait (19th-century
engraving, black ink, one red accent), kept as two-colour vectors so they
recolour with the theme.

## Pipeline

1. **Generate** a 1024px PNG. The prompt that works, with the object swapped in:

   > Vintage 19th-century engraving / woodcut etching of [OBJECT], shown alone.
   > Pure black ink on a plain flat cream background (#ebe5db): bold outlines,
   > fine crosshatching for shading, no grey tones, no gradients. One accent
   > only: [THE ACCENT] is in bright red ink. Nothing else in the frame, no
   > text, no border, centered, high contrast, clean enough to vectorize.

   Gemini 3.1 Flash Image (via Figma) matched the portrait's style on the first
   try for 10 of 10 objects. Gamma's model ignored the style entirely; don't use it.

2. **Trace** to SVG (needs `py -3 -m pip install potracer pillow numpy`):

       py -3 scripts/vectorize.py in.png src/assets/illus/<essay-id>.svg --size 720 --turd 10

   Output is two paths: `.ink` (#1e1d19) and `.red` (#d92e1c), cropped to
   content, 15–80 KB. Drop the same file in `public/illus/` for the list
   thumbnails (`<img>`), which ink mode inverts with a CSS filter.

3. **Use**: `<Illustration id="essay-id" />` renders it as an image (essay header, eager);
   `thumb` for lists. Missing file renders nothing, so an essay
   without an object is fine.

## The objects

| essay | object | accent |
|---|---|---|
| open-tab | jam jar | spill under the lid |
| defaults | clipboard form, one box pre-ticked | the tick |
| rational | tailor's dummy in a waistcoat | the tie |
| belief | barrister's wig on a stand | splash on the base |
| past | photograph with a torn corner | the tear |
| willpower | coin purse, nearly empty | the falling coin |
| first-number | souk lantern with a price tag | the tag |
| attention-rent | TO LET sign on a bracket | the letters |
| nobody-wants | brace-and-bit hand drill | the bit's tip |
| friction | set mousetrap with cheese | the cheese |
| named-everything | label maker | the tape strip |
| retention | bucket with a hole | the drops |
| say-no | plate of chicken salad, crossed out | the strike |

## The portrait

`Face.astro` + `public/face.js`. The logo stays an `<img>`; a small SVG laid
over it carries the parts that move (pupils, splat, lens glint, drop). Hub
duotones are static files from `scripts/face-duo.mjs`; the favicon is the
eyes band cut from the same paths.

## The Lab's instruments (`public/illus/lab-<id>.svg`)

| experiment | instrument | accent |
|---|---|---|
| anchor | tailor's tape measure | the first inches |
| decoy | three magazines in a rack, one thick | the thick spine |
| framing | balance scale, tipped | the weight |
| loss | coin mid-flip | the rim |
| defaults | panel of toggle switches, one down | the down switch |
| free | truffle and a plain chocolate on a dish | the wrapper |

## Still to make

Specimen plates for `/specimens/` (hourglass with a crack is done as
`public/illus/sp-countdown.svg`): phantom crowd (a row of identical top hats,
one red), confirmshaming (a fishing hook with a red paper tag), the
pre-ticked box (a ballot box with a red padlock), drip pricing (a dripping
tap over a stack of coins), the roach motel (a small motel, big entrance,
tiny red exit). Marginalia: a manicule (printer's pointing hand, red cuff)
for "next" links; an envelope with a red wax seal (newsletter box); a brass
cash register showing 0.00 in red (the receipt).
