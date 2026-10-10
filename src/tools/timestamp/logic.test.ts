import { describe, expect, it } from "vitest";
import { describeMoment, parseMoment } from "./logic";

describe("parseMoment", () => {
  it("reads ten-digit numbers as seconds", () => {
    expect(parseMoment("1700000000")).toEqual({ ok: true, ms: 1700000000000, readAs: "seconds" });
  });

  it("reads thirteen-digit numbers as milliseconds", () => {
    expect(parseMoment(" 1700000000000 ")).toEqual({ ok: true, ms: 1700000000000, readAs: "milliseconds" });
  });

  it("reads ISO dates", () => {
    expect(parseMoment("2023-11-14T22:13:20Z")).toEqual({ ok: true, ms: 1700000000000, readAs: "date" });
  });

  it("reads negative seconds as dates before 1970", () => {
    expect(parseMoment("-86400")).toEqual({ ok: true, ms: -86400000, readAs: "seconds" });
  });

  it("rejects empty, unreadable and out-of-range input", () => {
    expect(parseMoment("  ").ok).toBe(false);
    expect(parseMoment("next tuesday-ish").ok).toBe(false);
    expect(parseMoment("99999999999999999999").ok).toBe(false);
  });
});

describe("describeMoment", () => {
  it("formats one instant three ways", () => {
    expect(describeMoment(1700000000123)).toEqual({
      iso: "2023-11-14T22:13:20.123Z",
      seconds: "1700000000",
      milliseconds: "1700000000123",
    });
  });
});
