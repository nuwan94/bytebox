import { describe, expect, it } from "vitest";
import { decodeUrl, encodeUrl } from "./logic";

describe("url encoder", () => {
  it("escapes everything in a component", () => {
    expect(encodeUrl("a b&c=d/é")).toEqual({ ok: true, output: "a%20b%26c%3Dd%2F%C3%A9" });
  });

  it("keeps URL structure when asked", () => {
    expect(encodeUrl("https://example.com/a b?q=é", true)).toEqual({ ok: true, output: "https://example.com/a%20b?q=%C3%A9" });
  });

  it("decodes what it encodes", () => {
    expect(decodeUrl("a%20b%26c%3Dd%2F%C3%A9")).toEqual({ ok: true, output: "a b&c=d/é" });
  });

  it("reports a broken escape", () => {
    expect(decodeUrl("100%").ok).toBe(false);
  });

  it("reports a lone surrogate", () => {
    expect(encodeUrl("\uD800").ok).toBe(false);
  });
});
