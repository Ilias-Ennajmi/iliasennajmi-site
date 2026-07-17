import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essaySchema = z.object({
  id: z.string(),
  title: z.string(),
  tag: z.string(),
  read: z.string(),
  date: z.string(),
  order: z.coerce.number().default(999),
  standfirst: z.string(),
});

const ulysses = defineCollection({
  loader: glob({ base: './src/content/ulysses', pattern: '**/*.md' }),
  schema: essaySchema,
});

const ilias = defineCollection({
  loader: glob({ base: './src/content/ilias', pattern: '**/*.md' }),
  schema: essaySchema,
});

export const collections = { ulysses, ilias };
