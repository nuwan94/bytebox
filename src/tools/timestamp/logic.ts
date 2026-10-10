export type ReadAs = "seconds" | "milliseconds" | "date";

export type MomentResult =
  | { ok: true; ms: number; readAs: ReadAs }
  | { ok: false; error: string };

// Numbers below this are taken as seconds. As seconds it is the year 5138;
// as milliseconds it is March 1973, so real-world values rarely collide.
const SECONDS_CUTOFF = 1e11;
const MAX_DATE_MS = 8.64e15;

/** Reads a Unix time (seconds or milliseconds) or a date string. */
export function parseMoment(input: string): MomentResult {
  const text = input.trim();
  if (!text) return { ok: false, error: "There's nothing to convert." };

  let ms: number;
  let readAs: ReadAs;
  if (/^-?\d+(\.\d+)?$/.test(text)) {
    const value = Number(text);
    readAs = Math.abs(value) < SECONDS_CUTOFF ? "seconds" : "milliseconds";
    ms = readAs === "seconds" ? value * 1000 : value;
  } else {
    ms = Date.parse(text);
    readAs = "date";
    if (Number.isNaN(ms)) return { ok: false, error: "Use a Unix time like 1700000000 or a date like 2026-03-14T09:30:00Z." };
  }
  if (Math.abs(ms) > MAX_DATE_MS) return { ok: false, error: "That is outside the range JavaScript dates can hold." };
  return { ok: true, ms: Math.round(ms), readAs };
}

export function describeMoment(ms: number) {
  return {
    iso: new Date(ms).toISOString(),
    seconds: String(Math.floor(ms / 1000)),
    milliseconds: String(ms),
  };
}
