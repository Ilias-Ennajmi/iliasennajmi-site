const WORDS_PER_MINUTE = 220;

export function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadMinutes(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / WORDS_PER_MINUTE));
}

/** Estimate reading time from raw markdown body text, e.g. "8 min". */
export function estimateReadTime(body: string): string {
  return `${estimateReadMinutes(body)} min`;
}
