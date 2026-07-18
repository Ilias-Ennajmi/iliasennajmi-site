import { getCollection, type CollectionEntry } from 'astro:content';
import { estimateReadTime, estimateReadMinutes } from './readTime';

type Strand = 'ulysses' | 'ilias';
export type EssayEntry = CollectionEntry<'ulysses'> | CollectionEntry<'ilias'>;

/** Published (non-draft) entries for a strand, sorted by order (1 = newest/top). */
export async function getPublishedCollection(strand: Strand) {
  const entries = await getCollection(strand, (entry) => !entry.data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** The essay's read time — the manual frontmatter override if set, else computed from the body. */
export function readTimeOf(entry: EssayEntry): string {
  return entry.data.read ?? estimateReadTime(entry.body ?? '');
}

/** Read time in whole minutes (for the scroll-based reading meter). */
export function readMinutesOf(entry: EssayEntry): number {
  if (entry.data.read) {
    const n = parseInt(entry.data.read, 10);
    if (!isNaN(n)) return n;
  }
  return estimateReadMinutes(entry.body ?? '');
}

/** The essay's manually-curated counterpart in the opposite strand (via pairsWith), if any. */
export function getPairedEssay(entry: EssayEntry, oppositeStrandEntries: EssayEntry[]): EssayEntry | null {
  if (!entry.data.pairsWith) return null;
  return oppositeStrandEntries.find((e) => e.data.id === entry.data.pairsWith) ?? null;
}

/** The curated "Start Here" onboarding path, across both strands, in author-defined order. */
export async function getStartHerePath(): Promise<Array<{ entry: EssayEntry; strand: Strand }>> {
  const ulysses = (await getPublishedCollection('ulysses')).map((entry) => ({ entry, strand: 'ulysses' as Strand }));
  const ilias = (await getPublishedCollection('ilias')).map((entry) => ({ entry, strand: 'ilias' as Strand }));
  return [...ulysses, ...ilias]
    .filter((x) => x.entry.data.startHereOrder !== undefined)
    .sort((a, b) => (a.entry.data.startHereOrder ?? 0) - (b.entry.data.startHereOrder ?? 0));
}
