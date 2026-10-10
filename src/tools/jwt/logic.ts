import { decodeBase64, encodeBase64 } from "../base64/logic";

export type JwtResult =
  | { ok: true; header: string; payload: string; expiresAt: number | null }
  | { ok: false; error: string };

function readPart(part: string, name: string): { ok: true; value: unknown } | { ok: false; error: string } {
  const decoded = decodeBase64(part);
  if (!decoded.ok) return { ok: false, error: `The ${name} isn't valid Base64.` };
  try {
    return { ok: true, value: JSON.parse(decoded.output) };
  } catch {
    return { ok: false, error: `The ${name} isn't JSON once decoded.` };
  }
}

/** Reads a JWT's header and payload. It does not check the signature. */
export function readJwt(token: string): JwtResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { ok: false, error: `A token has three parts separated by dots, and this has ${parts.length}.` };
  }
  const header = readPart(parts[0], "header");
  if (!header.ok) return header;
  const payload = readPart(parts[1], "payload");
  if (!payload.ok) return payload;

  const exp = (payload.value as { exp?: unknown } | null)?.exp;
  return {
    ok: true,
    header: JSON.stringify(header.value, null, 2),
    payload: JSON.stringify(payload.value, null, 2),
    expiresAt: typeof exp === "number" ? exp * 1000 : null,
  };
}

/** Builds an unsigned example token, for the sample input and for tests. */
export function makeSampleJwt(header: object, payload: object): string {
  return [header, payload].map((part) => encodeBase64(JSON.stringify(part), true)).join(".") + ".signature-not-checked";
}
