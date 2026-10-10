import { describe, expect, it } from "vitest";
import { guides } from "./guides";
import { tools } from "./registry";

describe("tool guides", () => {
  it("exist for every tool and for nothing else", () => {
    expect(Object.keys(guides).sort()).toEqual(tools.map((tool) => tool.slug).sort());
  });

  it("each have enough substance", () => {
    for (const [slug, guide] of Object.entries(guides)) {
      expect(guide.about.length, slug).toBeGreaterThanOrEqual(2);
      expect(guide.steps.length, slug).toBeGreaterThanOrEqual(2);
      expect(guide.faqs.length, slug).toBeGreaterThanOrEqual(3);
      const words = [...guide.about, ...guide.steps, ...guide.faqs.flatMap((faq) => [faq.q, faq.a])].join(" ").split(/\s+/).length;
      expect(words, slug).toBeGreaterThanOrEqual(200);
    }
  });

  it("have no empty or duplicated questions", () => {
    for (const [slug, guide] of Object.entries(guides)) {
      const questions = guide.faqs.map((faq) => faq.q);
      expect(new Set(questions).size, slug).toBe(questions.length);
      for (const faq of guide.faqs) expect(faq.a.trim().length, `${slug}: ${faq.q}`).toBeGreaterThan(20);
    }
  });
});
