import type { APIRoute } from 'astro';
import { renderCard, pngResponse } from '../../lib/og';
import { EFFECTS } from '../../lib/effects';

export function getStaticPaths() {
  return EFFECTS.map((e) => ({ params: { slug: e.slug }, props: { name: e.name, short: e.short } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { name } = props as { name: string; short: string };
  return pngResponse(await renderCard({ kicker: 'The effects · Try it on yourself', title: name, accent: '#a52716' }));
};
