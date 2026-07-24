import type { APIRoute } from 'astro';
import { getPublishedCollection, readTimeOf } from '../lib/essays';

export const GET: APIRoute = async () => {
  const ulysses = await getPublishedCollection('ulysses');
  const ilias = await getPublishedCollection('ilias');

  const toEntry = (entries: Awaited<ReturnType<typeof getPublishedCollection>>, strandLabel: string, href: string) =>
    entries.map((e) => ({
      title: e.data.title,
      tag: e.data.tag,
      standfirst: e.data.standfirst,
      strand: strandLabel,
      read: readTimeOf(e),
      href: `/essays/${e.data.id}/`,
    }));

  const index = [
    ...toEntry(ulysses, 'Ulysses', '/ulysses/'),
    ...toEntry(ilias, 'Ilias', '/ilias/'),
    { title: 'About', tag: 'Page', standfirst: 'The person behind the essays.', strand: 'Site', read: '', href: '/about/' },
    { title: 'The Shelf', tag: 'Page', standfirst: 'Books, sound, and tools shaping the work.', strand: 'Site', read: '', href: '/shelf/' },
    { title: 'Topics', tag: 'Page', standfirst: 'Every essay, browsable by theme instead of strand.', strand: 'Site', read: '', href: '/topics/' },
    { title: 'Start Here', tag: 'Page', standfirst: 'New here? A few essays in a deliberate order.', strand: 'Site', read: '', href: '/start/' },
    { title: 'Saved', tag: 'Page', standfirst: 'Essays you set aside to read later.', strand: 'Site', read: '', href: '/saved/' },
    { title: 'Colophon', tag: 'Page', standfirst: 'What this site is made of, and a running tally of what’s in it.', strand: 'Site', read: '', href: '/colophon/' },
    { title: 'Ulysses — Why people act', tag: 'Strand', standfirst: 'Psychology, behavior, philosophy.', strand: 'Site', read: '', href: '/ulysses/' },
    { title: 'Ilias — Who profits', tag: 'Strand', standfirst: 'Marketing, strategy, incentives.', strand: 'Site', read: '', href: '/ilias/' },
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
};
