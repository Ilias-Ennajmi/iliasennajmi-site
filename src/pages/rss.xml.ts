import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function toDate(d: string): Date {
  const t = Date.parse(d);
  return isNaN(t) ? new Date() : new Date(t);
}

export async function GET(context: APIContext) {
  const ulysses = await getCollection('ulysses');
  const ilias = await getCollection('ilias');
  const all = [...ulysses, ...ilias].sort((a, b) => +toDate(b.data.date) - +toDate(a.data.date));

  return rss({
    title: 'Ilias Ennajmi — Why people act, who profits',
    description: 'Essays on the hidden mechanics of choice: what makes people act, and who profits when they do.',
    site: context.site!,
    items: all.map((e) => ({
      title: e.data.title,
      description: e.data.standfirst,
      pubDate: toDate(e.data.date),
      link: `/essays/${e.data.id}/`,
    })),
  });
}
