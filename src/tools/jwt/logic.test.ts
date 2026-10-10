import { describe, expect, it } from "vitest";
import { makeSampleJwt, readJwt } from "./logic";

describe("readJwt", () => {
  it("reads the header and payload", () => {
    const token = makeSampleJwt({ alg: "HS256", typ: "JWT" }, { sub: "42", name: "Ada" });
    expect(readJwt(token)).toEqual({
      ok: true,
      header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
      payload: '{\n  "sub": "42",\n  "name": "Ada"\n}',
      expiresAt: null,
    });
  });

  it("converts exp to milliseconds", () => {
    const result = readJwt(makeSampleJwt({ alg: "none" }, { exp: 1700000000 }));
    expect(result.ok && result.expiresAt).toBe(1700000000000);
  });

  it("explains a wrong number of parts", () => {
    expect(readJwt("only.two")).toEqual({ ok: false, error: "A token has three parts separated by dots, and this has 2." });
  });

  it("explains a part that isn't JSON", () => {
    const result = readJwt("aGVsbG8.aGVsbG8.x");
    expect(result).toEqual({ ok: false, error: "The header isn't JSON once decoded." });
  });
});
