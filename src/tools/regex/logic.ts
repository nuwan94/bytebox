export type Match = { index: number; text: string; groups: string[] };

export type RegexResult =
  | { ok: true; matches: Match[]; capped: boolean }
  | { ok: false; error: string };

export const MATCH_LIMIT = 1000;

/** Finds every match of the pattern. `flags` should not include "g". */
export function findMatches(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) return { ok: true, matches: [], capped: false };
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags.replace("g", "") + "g");
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  const matches: Match[] = [];
  for (const match of text.matchAll(regex)) {
    if (matches.length === MATCH_LIMIT) return { ok: true, matches, capped: true };
    matches.push({ index: match.index, text: match[0], groups: match.slice(1).map((group) => group ?? "") });
  }
  return { ok: true, matches, capped: false };
}

export type Segment = { text: string; hit: boolean };

/** Splits the text into matched and unmatched runs, for highlighting. */
export function toSegments(text: string, matches: Match[]): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.text.length === 0) continue;
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), hit: false });
    segments.push({ text: match.text, hit: true });
    cursor = match.index + match.text.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
  return segments;
}
