/**
 * Share cards drawn in the browser: the Lab score and essay quotes, as
 * square 1080px PNGs in the site's paper-and-ink style. Nothing is
 * uploaded anywhere; the image is handed to the phone's share sheet, or
 * downloaded where the browser can't share files.
 */

const PAPER = '#ebe5db';
const PAPER_HI = '#f3f1ec';
const INK = '#291c0f';
const ASH = '#574738';
const LINE = 'rgba(41, 28, 15, 0.16)';
export const EMBER = '#a52716';
export const TIDE = '#755938';

const DISPLAY = '"Fraunces Variable", "Fraunces", Georgia, serif';
const BODY = '"EB Garamond Variable", "EB Garamond", Georgia, serif';
const MONO = '"Space Grotesk Variable", "Space Grotesk", Arial, sans-serif';
const S = 1080;

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`500 80px ${DISPLAY}`),
      document.fonts.load(`italic 500 80px ${DISPLAY}`),
      document.fonts.load(`italic 400 40px ${BODY}`),
      document.fonts.load(`600 24px ${MONO}`),
    ]);
  } catch { /* fall back to Georgia / Arial */ }
}

function canvas() {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d')!;
  const bg = g.createLinearGradient(0, 0, 0, S);
  bg.addColorStop(0, PAPER_HI);
  bg.addColorStop(1, PAPER);
  g.fillStyle = bg;
  g.fillRect(0, 0, S, S);
  g.textBaseline = 'alphabetic';
  return { c, g };
}

function diamond(g: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, filled = true) {
  g.save();
  g.translate(x, y);
  g.rotate(Math.PI / 4);
  if (filled) { g.fillStyle = color; g.fillRect(-r, -r, r * 2, r * 2); }
  else { g.strokeStyle = color; g.lineWidth = 3; g.strokeRect(-r, -r, r * 2, r * 2); }
  g.restore();
}

function tracked(g: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  // canvas letterSpacing isn't everywhere yet; draw letter by letter
  let cx = x;
  for (const ch of text) { g.fillText(ch, cx, y); cx += g.measureText(ch).width + spacing; }
  return cx;
}

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function kicker(g: CanvasRenderingContext2D, text: string, color: string) {
  diamond(g, 104, 112, 11, color);
  g.fillStyle = color;
  g.font = `600 26px ${MONO}`;
  tracked(g, text.toUpperCase(), 134, 122, 5);
}

function footer(g: CanvasRenderingContext2D, left: string, right: string) {
  g.fillStyle = LINE;
  g.fillRect(90, S - 150, S - 180, 2);
  g.fillStyle = INK;
  g.font = `italic 500 34px ${DISPLAY}`;
  g.fillText(left, 90, S - 92);
  g.fillStyle = ASH;
  g.font = `600 22px ${MONO}`;
  const w = [...right.toUpperCase()].reduce((a, ch) => a + g.measureText(ch).width + 4, 0);
  tracked(g, right.toUpperCase(), S - 90 - w, S - 94, 4);
}

const toBlob = (c: HTMLCanvasElement) => new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('no blob'))), 'image/png'));

export async function scoreCard(opts: { got: number; scored: number; rows: Array<{ name: string; state: string }>; host: string }) {
  await fontsReady();
  const { c, g } = canvas();
  kicker(g, 'The Lab · Six experiments', EMBER);

  g.fillStyle = INK;
  g.font = `500 112px ${DISPLAY}`;
  const head = opts.got === 0 ? 'Nothing got me.' : `It got me ${opts.got}`;
  g.fillText(head, 86, 300);
  g.font = `italic 500 112px ${DISPLAY}`;
  g.fillStyle = EMBER;
  g.fillText(opts.got === 0 ? `0 out of ${opts.scored}.` : `out of ${opts.scored}.`, 86, 420);

  let y = 520;
  g.font = `400 40px ${BODY}`;
  for (const r of opts.rows) {
    g.fillStyle = LINE;
    g.fillRect(90, y - 46, S - 180, 2);
    const mark = r.state === 'got' ? EMBER : r.state === 'held' ? INK : r.state === 'control' ? TIDE : ASH;
    diamond(g, 110, y - 13, 9, mark, r.state === 'got' || r.state === 'held');
    g.fillStyle = r.state ? INK : ASH;
    g.font = `400 40px ${BODY}`;
    g.fillText(r.name, 140, y);
    const label = r.state === 'got' ? 'It got me' : r.state === 'held' ? 'Held out' : r.state === 'control' ? 'No trick' : 'Not run';
    g.font = `600 22px ${MONO}`;
    g.fillStyle = r.state === 'got' ? EMBER : ASH;
    const w = [...label.toUpperCase()].reduce((a, ch) => a + g.measureText(ch).width + 3, 0);
    tracked(g, label.toUpperCase(), S - 90 - w, y - 4, 3);
    y += 62;
  }
  footer(g, 'Try it on yourself', `${opts.host}/lab`);
  return toBlob(c);
}

export async function quoteCard(opts: { quote: string; title: string; strand: string; accent: string; host: string }) {
  await fontsReady();
  const { c, g } = canvas();
  kicker(g, `${opts.strand} · Ilias Ennajmi`, opts.accent);

  // big opening mark, then the quote sized to fit the space
  g.fillStyle = opts.accent;
  g.font = `italic 500 200px ${DISPLAY}`;
  g.fillText('“', 76, 330);

  const maxW = S - 180;
  let size = 76;
  let lines: string[] = [];
  for (; size >= 38; size -= 4) {
    g.font = `italic 500 ${size}px ${DISPLAY}`;
    lines = wrap(g, opts.quote, maxW);
    if (lines.length * size * 1.2 <= 520) break;
  }
  g.fillStyle = INK;
  let y = 350 + size;
  for (const l of lines) { g.fillText(l, 90, y); y += size * 1.2; }

  footer(g, opts.title.length > 44 ? `${opts.title.slice(0, 42)}…` : opts.title, opts.host);
  return toBlob(c);
}

/** Share sheet with the image where supported, else download it. Returns what happened. */
export async function shareImage(blob: Blob, filename: string, text: string, url: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try { await nav.share({ files: [file], text: `${text} ${url}` }); return 'shared'; }
    catch (e) { if ((e as Error).name === 'AbortError') return 'cancelled'; }
  }
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
  return 'downloaded';
}
