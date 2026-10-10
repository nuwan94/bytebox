export const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512"] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

/** Hashes the UTF-8 bytes of the text and returns lowercase hex. */
export async function hashText(text: string, algorithm: Algorithm): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
