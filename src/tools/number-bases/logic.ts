export type Base = 2 | 8 | 10 | 16;
export type IntegerResult = { ok: true; value: bigint } | { ok: false; error: string };

const DIGITS: Record<Base, RegExp> = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ };
const PREFIX: Record<Base, string> = { 2: "0b", 8: "0o", 10: "", 16: "0x" };
export const BASE_NAMES: Record<Base, string> = { 2: "binary", 8: "octal", 10: "decimal", 16: "hex" };

/** Reads a whole number of any size. Spaces, underscores and a 0x/0b/0o prefix are allowed. */
export function parseInteger(input: string, base: Base): IntegerResult {
  let text = input.toLowerCase().replace(/[\s_]/g, "");
  const negative = text.startsWith("-");
  if (negative) text = text.slice(1);
  if (PREFIX[base] && text.startsWith(PREFIX[base])) text = text.slice(2);
  if (!text) return { ok: false, error: "There's no number to convert." };
  if (!DIGITS[base].test(text)) return { ok: false, error: `It has characters that aren't ${BASE_NAMES[base]} digits.` };

  let value = 0n;
  for (const char of text) value = value * BigInt(base) + BigInt(parseInt(char, 16));
  return { ok: true, value: negative ? -value : value };
}

export function describeInteger(value: bigint) {
  return { binary: value.toString(2), octal: value.toString(8), decimal: value.toString(10), hex: value.toString(16) };
}
