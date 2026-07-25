import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getPublishedCollection } from '../../lib/essays';

const FONT_DIR = path.join(process.cwd(), 'node_modules');

const fraunces = fs.readFileSync(path.join(FONT_DIR, '@fontsource/fraunces/files/fraunces-latin-500-normal.woff'));
const spaceGrotesk = fs.readFileSync(path.join(FONT_DIR, '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff'));

const COAL = '#fcf0ec';
const BONE = '#1a1310';
const ASH = '#4a3d36';

export async function getStaticPaths() {
  const ulysses = (await getPublishedCollection('ulysses')).map((entry) => ({ entry, accent: '#7a5a4c', strandLabel: 'Ulysses' }));
  const ilias = (await getPublishedCollection('ilias')).map((entry) => ({ entry, accent: '#c13824', strandLabel: 'Ilias' }));
  return [...ulysses, ...ilias].map(({ entry, accent, strandLabel }) => ({
    params: { id: entry.data.id },
    props: { title: entry.data.title, tag: entry.data.tag, accent, strandLabel },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, tag, accent, strandLabel } = props as { title: string; tag: string; accent: string; strandLabel: string };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: COAL,
          padding: '80px',
          fontFamily: 'Fraunces',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { width: '14px', height: '14px', background: accent, transform: 'rotate(45deg)' },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Space Grotesk',
                      fontSize: '26px',
                      fontWeight: 600,
                      letterSpacing: '4px',
                      textTransform: 'uppercase',
                      color: accent,
                    },
                    children: `${strandLabel} — ${tag}`,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontFamily: 'Fraunces',
                fontWeight: 500,
                fontSize: '64px',
                lineHeight: 1.08,
                letterSpacing: '-0.01em',
                color: BONE,
                maxWidth: '1000px',
                display: 'flex',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'Space Grotesk',
                fontSize: '22px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: ASH,
              },
              children: [
                { type: 'div', props: { children: 'Ilias Ennajmi' } },
                { type: 'div', props: { children: 'Why people act · Who profits' } },
              ],
            },
          },
        ],
      },
    },
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
