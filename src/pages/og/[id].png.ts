import type { APIRoute } from 'astro';
import { renderCard, pngResponse } from '../../lib/og';
import { getPublishedCollection } from '../../lib/essays';

export async function getStaticPaths() {
  const ulysses = (await getPublishedCollection('ulysses')).map((entry) => ({ entry, accent: '#755938', strandLabel: 'Ulysses' }));
  const ilias = (await getPublishedCollection('ilias')).map((entry) => ({ entry, accent: '#a52716', strandLabel: 'Ilias' }));
  return [...ulysses, ...ilias].map(({ entry, accent, strandLabel }) => ({
    params: { id: entry.data.id },
    props: { title: entry.data.title, tag: entry.data.tag, accent, strandLabel },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, tag, accent, strandLabel } = props as { title: string; tag: string; accent: string; strandLabel: string };

  return pngResponse(await renderCard({ kicker: `${strandLabel} · ${tag}`, title, accent }));
};
