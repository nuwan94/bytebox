import { describe, expect, it } from "vitest";
import { decodeEntities, encodeEntities } from "./logic";

describe("html entities", () => {
  it("escapes the five special characters", () => {
    expect(encodeEntities(`<a href="x">Tom & 'Jerry'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;");
  });

  it("can escape everything above ASCII, including emoji", () => {
    expect(encodeEntities("café 🪩", true)).toBe("caf&#xE9; &#x1FAA9;");
    expect(encodeEntities("café")).toBe("café");
  });

  it("decodes numeric and named references once", () => {
    expect(decodeEntities("&lt;b&gt; &amp;amp; &#169; &#xA9; &copy; &#x1FAA9;")).toBe("<b> &amp; © © © 🪩");
  });

  it("leaves unknown or invalid references alone", () => {
    expect(decodeEntities("&bogus; &#xD800; &#0; & plain")).toBe("&bogus; &#xD800; &#0; & plain");
  });

  it("treats names as case-sensitive", () => {
    expect(decodeEntities("&Eacute;&eacute;&AMP;")).toBe("Éé&AMP;");
  });

  it("round-trips", () => {
    const text = `<p class="x">Fish & chips — £5 'today' 🐟</p>`;
    expect(decodeEntities(encodeEntities(text, true))).toBe(text);
  });
});
