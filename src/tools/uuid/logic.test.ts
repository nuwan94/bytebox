import { describe, expect, it } from "vitest";
import { makeUuids, MAX_UUIDS } from "./logic";

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("makeUuids", () => {
  it("makes the requested number of distinct v4 UUIDs", () => {
    const ids = makeUuids(20, { uppercase: false, hyphens: true });
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    for (const id of ids) expect(id).toMatch(V4);
  });

  it("applies uppercase and removes hyphens", () => {
    const [id] = makeUuids(1, { uppercase: true, hyphens: false });
    expect(id).toMatch(/^[0-9A-F]{32}$/);
  });

  it("clamps the count", () => {
    expect(makeUuids(0, { uppercase: false, hyphens: true })).toHaveLength(1);
    expect(makeUuids(5000, { uppercase: false, hyphens: true })).toHaveLength(MAX_UUIDS);
    expect(makeUuids(Number.NaN, { uppercase: false, hyphens: true })).toHaveLength(1);
  });
});
