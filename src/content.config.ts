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
  // A Lab experiment shown inside the essay, at the ::interactive:: marker.
  interactive: z.enum(['anchor', 'decoy', 'framing', 'loss', 'defaults', 'free']).optional(),
  // Effects the essay leans on; each links to its page under /effects/.
  // A few lines from the essay, word for word, offered as share cards at the end.
  lines: z.array(z.string()).default([]),
  effects: z.array(z.enum(['anchoring', 'decoy-effect', 'framing', 'loss-aversion', 'defaults', 'zero-price'])).default([]),
  // Where the essay first ran, if it was published elsewhere first.
  substackUrl: z.string().url().optional(),
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
