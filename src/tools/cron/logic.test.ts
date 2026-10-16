import { describe, expect, it } from "vitest";
import { describeCron, nextRuns, parseCron } from "./logic";

const runs = (expression: string, from: string, count = 3) => {
  const result = parseCron(expression);
  if (!result.ok) throw new Error(result.error);
  return nextRuns(result.schedule, new Date(from), count, true).map((date) => date.toISOString().slice(0, 16));
};

describe("cron", () => {
  it("steps through minutes", () => {
    expect(runs("*/15 * * * *", "2026-01-01T00:07:00Z")).toEqual(["2026-01-01T00:15", "2026-01-01T00:30", "2026-01-01T00:45"]);
  });

  it("skips weekends for a weekday schedule", () => {
    // 2 January 2026 is a Friday.
    expect(runs("0 9 * * 1-5", "2026-01-02T10:00:00Z", 2)).toEqual(["2026-01-05T09:00", "2026-01-06T09:00"]);
  });

  it("matches either day field when both are set", () => {
    // Fridays in February 2026 and the 13th, which is also a Friday.
    expect(runs("0 0 13 * 5", "2026-02-01T00:00:00Z")).toEqual(["2026-02-06T00:00", "2026-02-13T00:00", "2026-02-20T00:00"]);
  });

  it("finds 29 February in the next leap year", () => {
    expect(runs("0 0 29 2 *", "2026-03-01T00:00:00Z", 1)).toEqual(["2028-02-29T00:00"]);
  });

  it("accepts macros, names and 7 for Sunday", () => {
    expect(runs("@daily", "2026-01-01T12:00:00Z", 1)).toEqual(["2026-01-02T00:00"]);
    expect(runs("30 6 * JAN sun", "2026-01-01T00:00:00Z", 1)).toEqual(["2026-01-04T06:30"]);
    expect(runs("0 0 * * 7", "2026-01-01T00:00:00Z", 1)).toEqual(["2026-01-04T00:00"]);
  });

  it("returns nothing for a date that never comes", () => {
    expect(runs("0 0 30 2 *", "2026-01-01T00:00:00Z")).toEqual([]);
  });

  it("explains problems", () => {
    expect(parseCron("* * *")).toEqual({ ok: false, error: expect.stringContaining("This one has 3.") });
    expect(parseCron("61 * * * *")).toEqual({ ok: false, error: "61 is outside 0 to 59 for the minute." });
    expect(parseCron("* * * * MOX")).toEqual({ ok: false, error: '"MOX" isn\'t a valid day of the week.' });
    expect(parseCron("*/0 * * * *").ok).toBe(false);
    expect(parseCron("5-1 * * * *").ok).toBe(false);
  });

  it("describes a schedule in words", () => {
    const result = parseCron("*/15 * * * *");
    expect(result.ok && describeCron(result.schedule)).toMatch(/15 minutes/i);
  });
});
