import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const FONT_DIR = path.join(process.cwd(), 'node_modules');
const fraunces = fs.readFileSync(path.join(FONT_DIR, '@fontsource/fraunces/files/fraunces-latin-500-normal.woff'));
const spaceGrotesk = fs.readFileSync(path.join(FONT_DIR, '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff'));
const mark = `data:image/svg+xml;base64,${fs.readFileSync(path.join(process.cwd(), 'public/logo-mark.svg')).toString('base64')}`;

const COAL = '#ebe5db';
const BONE = '#1a1310';
const ASH = '#4a3d36';
const TIDE = '#755938';
const EMBER = '#a52716';

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async () => {
  const svg = await satori(
    el('div', { width: '1200px', height: '630px', display: 'flex', alignItems: 'center', gap: '64px', background: COAL, padding: '80px 96px' }, [
      { type: 'img', props: { src: mark, width: 300, height: 300, style: { flexShrink: 0 } } },
      el('div', { display: 'flex', flexDirection: 'column', gap: '28px' }, [
        el('div', { fontFamily: 'Fraunces', fontSize: '84px', lineHeight: 1, color: EMBER, letterSpacing: '-0.015em' }, 'Ilias Ennajmi'),
        el('div', { display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Fraunces', fontSize: '44px', lineHeight: 1.1, color: BONE }, [
          el('div', { display: 'flex' }, [el('span', { color: TIDE }, 'Why people act.')]),
          el('div', { display: 'flex' }, [el('span', { color: BONE }, 'Who profits when they do.')]),
        ]),
        el('div', { fontFamily: 'Space Grotesk', fontSize: '22px', letterSpacing: '4px', textTransform: 'uppercase', color: ASH }, 'Essays · ennajmi.space'),
      ]),
    ]),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 500, style: 'normal' },
        { name: 'Space Grotesk', data: spaceGrotesk, weight: 600, style: 'normal' },
      ],
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
