export type TextCounts = { characters: number; words: number; lines: number; bytes: number };

/** Counts characters as code points, so an emoji is one character. Bytes are UTF-8. */
export function countText(text: string): TextCounts {
  return {
    characters: [...text].length,
    words: text.match(/\S+/g)?.length ?? 0,
    lines: text === "" ? 0 : text.split(/\r?\n/).length,
    bytes: new TextEncoder().encode(text).length,
  };
}
