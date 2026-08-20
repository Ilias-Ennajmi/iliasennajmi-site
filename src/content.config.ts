import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essaySchema = z.object({
  id: z.string(),
  title: z.string(),
  tag: z.string(),
  date: z.string(),
  order: z.coerce.number().default(999),
  standfirst: z.string(),
  draft: z.boolean().default(false),
  pairsWith: z.string().optional(),
  startHereOrder: z.coerce.number().optional(),
  interactive: z.enum(['anchor']).optional(),
  // Optional, author-set only -- an editorial confidence claim about your
  // own writing isn't something to infer or default. Absent means no tag
  // renders, same nullable-field convention as SITE.social.
  epistemicStatus: z.enum(['confident', 'exploratory', 'revised']).optional(),
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
