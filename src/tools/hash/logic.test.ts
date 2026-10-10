import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ALGORITHMS, hashText } from "./logic";

describe("hashText", () => {
  it("matches the published SHA-256 test vector for abc", async () => {
    expect(await hashText("abc", "SHA-256")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("agrees with Node's implementation for every algorithm", async () => {
    const text = "naïve café 猫";
    for (const algorithm of ALGORITHMS) {
      const expected = createHash(algorithm.replace("-", "").toLowerCase()).update(text, "utf8").digest("hex");
      expect(await hashText(text, algorithm)).toBe(expected);
    }
  });
});
