import rss from '@astrojs/rss';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { APIContext } from 'astro';
import { getPublishedCollection } from '../lib/essays';

function toDate(d: string): Date {
  const t = Date.parse(d);
  return isNaN(t) ? new Date() : new Date(t);
}

export async function GET(context: APIContext) {
  const ulysses = await getPublishedCollection('ulysses');
  const ilias = await getPublishedCollection('ilias');
  const all = [...ulysses, ...ilias].sort((a, b) => +toDate(b.data.date) - +toDate(a.data.date));

  const container = await AstroContainer.create();
  const items = await Promise.all(
    all.map(async (e) => {
      const { Content } = await render(e);
      const content = await container.renderToString(Content);
      return {
        title: e.data.title,
        description: e.data.standfirst,
        content,
        pubDate: toDate(e.data.date),
        link: `/essays/${e.data.id}/`,
        categories: [e.data.tag],
      };
    })
  );

  return rss({
    title: 'Ilias Ennajmi — Why people act, who profits',
    description: 'Essays on the hidden mechanics of choice: what makes people act, and who profits when they do.',
    site: context.site!,
    items,
  });
}
