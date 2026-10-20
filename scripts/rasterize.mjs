// Rasters for every engraving the site shows as an <img>.
//
// Chrome decodes an SVG *image* on the main thread (it parses a whole SVG
// document per image), so a 40 KB engraving in an <img> cost 100-200 ms of
// blocking time on a phone every time it painted. PNGs decode off-thread.
// Each source is rendered at the widths the site actually displays, at 2x.
// Runs before `astro build` (see package.json). Idempotent; skips rasters
// newer than their source.
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const out = (p) => path.join('public', p);
const jobs = [];

// essay objects: thumb rows (46px), start-here (110px), lead figure (170px), essay header (250px), lab instruments (140px)
const sizes = { 92: 'thumb', 220: 'start', 340: 'lead', 500: 'essay', 280: 'lab' };
for (const f of fs.readdirSync('src/assets/illus').filter((f) => f.endsWith('.svg'))) {
  const id = f.replace(/\.svg$/, '');
  const widths = id.startsWith('lab-') ? [280] : id.startsWith('sp-') ? [500] : [92, 220, 340, 500];
  for (const w of widths) jobs.push({ src: path.join('src/assets/illus', f), dest: out(`illus/${id}-${w}.png`), width: w });
}
// the portrait: nav stamp (26px), byline (34px), lab observer (96px), hero (168px)
for (const w of [52, 68, 192, 336]) jobs.push({ src: 'public/logo-mark.svg', dest: out(`face/${w}.png`), width: w });

fs.mkdirSync(out('illus'), { recursive: true });
fs.mkdirSync(out('face'), { recursive: true });
let made = 0;
for (const j of jobs) {
  try {
    if (fs.existsSync(j.dest) && fs.statSync(j.dest).mtimeMs >= fs.statSync(j.src).mtimeMs) continue;
  } catch { /* render */ }
  const svg = fs.readFileSync(j.src, 'utf8').replace(/ width="\d+" height="\d+" preserveAspectRatio="none"/, '');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: j.width }, background: 'rgba(0,0,0,0)' }).render().asPng();
  fs.writeFileSync(j.dest, png);
  made++;
}
console.log(`[rasterize] ${jobs.length} rasters, ${made} rendered`);
