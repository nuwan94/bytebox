import { describe, expect, it } from "vitest";
import { CHARACTER_SETS, entropyBits, makePassword, MAX_LENGTH, MIN_LENGTH, type PasswordSets } from "./logic";

const all: PasswordSets = { lower: true, upper: true, digits: true, symbols: true };
const none: PasswordSets = { lower: false, upper: false, digits: false, symbols: false };

describe("makePassword", () => {
  it("has the requested length and one character from every chosen set", () => {
    for (let run = 0; run < 50; run++) {
      const password = makePassword(12, all);
      expect(password).toHaveLength(12);
      for (const set of Object.values(CHARACTER_SETS)) expect([...password].some((char) => set.includes(char))).toBe(true);
    }
  });

  it("uses only the chosen sets", () => {
    expect(makePassword(40, { ...none, digits: true })).toMatch(/^\d{40}$/);
  });

  it("clamps the length", () => {
    expect(makePassword(1, all)).toHaveLength(MIN_LENGTH);
    expect(makePassword(9999, all)).toHaveLength(MAX_LENGTH);
  });

  it("returns nothing when no set is chosen", () => {
    expect(makePassword(12, none)).toBe("");
  });

  it("does not repeat itself", () => {
    expect(makePassword(20, all)).not.toBe(makePassword(20, all));
  });
});

describe("entropyBits", () => {
  it("is length times log2 of the pool size", () => {
    expect(entropyBits(10, { ...none, digits: true })).toBe(33);
    expect(entropyBits(16, { ...none, lower: true, upper: true, digits: true })).toBe(95);
    expect(entropyBits(16, none)).toBe(0);
  });
});
