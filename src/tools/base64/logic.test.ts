import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "./logic";

describe("base64", () => {
  it("encodes ASCII", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=");
  });

  it("round-trips non-ASCII text", () => {
    const text = "naïve café 猫 🪩";
    expect(decodeBase64(encodeBase64(text))).toEqual({ ok: true, output: text });
  });

  it("makes URL-safe output without padding and reads it back", () => {
    const encoded = encodeBase64("??>>~~", true);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeBase64(encoded)).toEqual({ ok: true, output: "??>>~~" });
  });

  it("ignores whitespace and missing padding", () => {
    expect(decodeBase64("aGVs\nbG8")).toEqual({ ok: true, output: "hello" });
  });

  it("rejects characters outside the alphabet", () => {
    expect(decodeBase64("not base64!").ok).toBe(false);
  });

  it("rejects bytes that are not text", () => {
    expect(decodeBase64("/w==").ok).toBe(false);
  });
});
