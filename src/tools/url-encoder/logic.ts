import type { TextResult } from "../types";

/**
 * Percent-encodes text. With `keepStructure`, characters that give a URL its
 * shape (: / ? & = #) are left alone, which suits a whole address.
 */
export function encodeUrl(text: string, keepStructure = false): TextResult {
  try {
    return { ok: true, output: keepStructure ? encodeURI(text) : encodeURIComponent(text) };
  } catch {
    return { ok: false, error: "It contains half of a surrogate pair, which can't be encoded." };
  }
}

export function decodeUrl(text: string, keepStructure = false): TextResult {
  try {
    return { ok: true, output: keepStructure ? decodeURI(text) : decodeURIComponent(text) };
  } catch {
    return { ok: false, error: "A % sign isn't followed by two valid hex digits." };
  }
}
