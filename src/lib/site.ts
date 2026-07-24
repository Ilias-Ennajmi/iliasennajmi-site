/**
 * Single source of truth for identity and hand-maintained dates.
 *
 * Social URLs are deliberately nullable: components render only the ones
 * that are set, so an unconfigured account shows nothing rather than
 * linking to a bare corporate homepage.
 */
export const SITE = {
  email: 'hello@iliasennajmi.com',
  social: {
    linkedin: null as string | null,
    substack: null as string | null,
    x: null as string | null,
  },
  /** Last hand-review of the /about "Now" block and the Shelf. Bump when you actually update them. */
  nowUpdated: 'July 2026',
} as const;

/** Share intent URLs for a given essay. */
export function shareLinks(url: string, title: string) {
  return {
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };
}
