import type { TextResult } from "../types";

/** Encodes text as Base64 by way of UTF-8, so any character survives. */
export function encodeBase64(text: string, urlSafe = false): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  return urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
}

/** Decodes standard or URL-safe Base64, with or without padding. */
export function decodeBase64(input: string): TextResult {
  const clean = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
    return { ok: false, error: "It contains characters that are not part of Base64." };
  }
  const body = clean.replace(/=+$/, "");
  if (body.length % 4 === 1) {
    return { ok: false, error: "The length is wrong for Base64, so a character may be missing." };
  }
  try {
    const binary = atob(body + "=".repeat((4 - (body.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return { ok: true, output: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
  } catch {
    return { ok: false, error: "It decodes to bytes that are not UTF-8 text." };
  }
}
