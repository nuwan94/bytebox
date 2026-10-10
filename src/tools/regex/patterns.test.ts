import { describe, expect, it } from "vitest";
import { findMatches } from "./logic";
import { COMMON_PATTERNS, PIECES, SAMPLE_TEXT } from "./patterns";

function matchesOf(name: string, text = SAMPLE_TEXT): string[] {
  const entry = COMMON_PATTERNS.find((item) => item.name === name);
  if (!entry) throw new Error(`No pattern named ${name}`);
  const result = findMatches(entry.pattern, "", text);
  if (!result.ok) throw new Error(result.error);
  return result.matches.map((match) => match.text);
}

describe("common patterns", () => {
  it("each finds its example in the sample text", () => {
    expect(matchesOf("Email")).toEqual(["ada@example.com"]);
    expect(matchesOf("Web address")).toEqual(["https://example.com/docs/getting-started?lang=en"]);
    expect(matchesOf("IPv4 address")).toEqual(["192.168.1.20"]);
    expect(matchesOf("Date (YYYY-MM-DD)")).toEqual(["2026-03-14"]);
    expect(matchesOf("Time (24-hour)")).toEqual(["09:30:15"]);
    expect(matchesOf("Hex colour")).toEqual(["#ff6fb0", "#fd0"]);
    expect(matchesOf("UUID")).toEqual(["3f2b8c1e-9a4d-4e7b-8c21-5d6f7a8b9c0d"]);
    expect(matchesOf("Phone (international)")).toEqual(["+44 20 7946 0958"]);
  });

  it("number handles signs and decimals", () => {
    expect(matchesOf("Number", "a -3 b 12.5 c 7")).toEqual(["-3", "12.5", "7"]);
  });

  it("reject near misses", () => {
    expect(matchesOf("IPv4 address", "999.1.1.1 and 1.2.3")).toEqual([]);
    expect(matchesOf("Date (YYYY-MM-DD)", "2026-13-01 2026-00-10 2026-02-32")).toEqual([]);
    expect(matchesOf("Time (24-hour)", "24:00 12:60")).toEqual([]);
    expect(matchesOf("Email", "not-an-email@ @nope")).toEqual([]);
  });

  it("every pattern and piece has a unique name", () => {
    expect(new Set(COMMON_PATTERNS.map((item) => item.name)).size).toBe(COMMON_PATTERNS.length);
    expect(new Set(PIECES.map((item) => item.name)).size).toBe(PIECES.length);
  });
});
