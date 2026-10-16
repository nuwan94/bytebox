import { describe, expect, it } from "vitest";
import { parseUrl } from "./logic";

describe("parseUrl", () => {
  it("splits every part and decodes parameters", () => {
    const result = parseUrl("https://user:pw@example.com:8080/a%20b/c?q=caf%C3%A9&tag=1&tag=2#top");
    expect(result).toEqual({
      ok: true,
      parts: [
        { label: "Scheme", value: "https" },
        { label: "Username", value: "user" },
        { label: "Password", value: "pw" },
        { label: "Host", value: "example.com" },
        { label: "Port", value: "8080" },
        { label: "Path", value: "/a b/c" },
        { label: "Query", value: "?q=caf%C3%A9&tag=1&tag=2" },
        { label: "Fragment", value: "top" },
        { label: "Origin", value: "https://example.com:8080" },
      ],
      params: [
        { key: "q", value: "café" },
        { key: "tag", value: "1" },
        { key: "tag", value: "2" },
      ],
    });
  });

  it("leaves out empty parts and default ports", () => {
    const result = parseUrl("https://example.com:443/");
    expect(result.ok && result.parts.map((part) => part.label)).toEqual(["Scheme", "Host", "Path", "Origin"]);
  });

  it("turns + into a space in query values", () => {
    const result = parseUrl("https://x.dev/?q=a+b");
    expect(result.ok && result.params).toEqual([{ key: "q", value: "a b" }]);
  });

  it("explains a missing scheme", () => {
    expect(parseUrl("example.com/path")).toEqual({ ok: false, error: "That isn't a full URL. Include the scheme at the start, such as https://." });
  });
});
