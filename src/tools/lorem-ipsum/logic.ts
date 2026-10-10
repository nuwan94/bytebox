const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna " +
  "aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute " +
  "irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident " +
  "sunt culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

export const MAX_PARAGRAPHS = 20;

// Small seeded generator (mulberry32) so the same seed gives the same text.
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Makes placeholder paragraphs. The first always opens with "Lorem ipsum dolor sit amet". */
export function makeLorem(paragraphs: number, seed: number): string {
  const random = seeded(seed);
  const between = (low: number, high: number) => low + Math.floor(random() * (high - low + 1));
  const count = Math.min(MAX_PARAGRAPHS, Math.max(1, Math.floor(paragraphs) || 1));

  return Array.from({ length: count }, (_, paragraph) =>
    Array.from({ length: between(3, 6) }, (_, sentence) => {
      const words = Array.from({ length: between(6, 14) }, () => WORDS[between(0, WORDS.length - 1)]);
      if (paragraph === 0 && sentence === 0) words.splice(0, 5, "lorem", "ipsum", "dolor", "sit", "amet");
      return words[0].charAt(0).toUpperCase() + words.join(" ").slice(1) + ".";
    }).join(" "),
  ).join("\n\n");
}
