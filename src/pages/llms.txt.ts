import type { APIRoute } from 'astro';
import { getPublishedCollection, readTimeOf } from '../lib/essays';

export const GET: APIRoute = async ({ site }) => {
  const ulysses = await getPublishedCollection('ulysses');
  const ilias = await getPublishedCollection('ilias');
  const base = (site?.toString() ?? '').replace(/\/$/, '');

  const listEssays = (entries: typeof ulysses) =>
    entries.map((e) => `- [${e.data.title}](${base}/essays/${e.data.id}/): ${e.data.standfirst} (${readTimeOf(e)})`).join('\n');

  const body = `# Ilias Ennajmi

> A personal essay site by Ilias Ennajmi, a marketing strategist writing about the psychology of choice and the business of exploiting it. Essays split into two strands: Ulysses asks why people act; Ilias asks who profits when they do.

## Ulysses — Why people act
Psychology, behavior, and philosophy — the slow questions about why we do the things we do.

${listEssays(ulysses)}

## Ilias — Who profits
Marketing and strategy — how attention gets bought, priced, and resold.

${listEssays(ilias)}

## Other pages
- [About](${base}/about/): The person behind the essays.
- [Start Here](${base}/start/): A curated four-essay path for first-time readers.
- [Topics](${base}/topics/): All essays browsable by theme, across both strands.
- [The Shelf](${base}/shelf/): Books, sound, and tools shaping the work.
- [Colophon](${base}/colophon/): What the site is built with, and a running tally of its contents.

## Notes
- Full-text RSS feed: ${base}/rss.xml
- Sitemap: ${base}/sitemap-index.xml
- Essays may be quoted with attribution to Ilias Ennajmi and a link back to the source URL.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
