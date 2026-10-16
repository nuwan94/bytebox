import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./logic";

describe("markdownToHtml", () => {
  it("renders headings and emphasis", () => {
    expect(markdownToHtml("# Hi\n\nSome **bold** and `code`.")).toBe("<h1>Hi</h1>\n<p>Some <strong>bold</strong> and <code>code</code>.</p>\n");
  });

  it("renders GitHub-style tables and task lists", () => {
    const html = markdownToHtml("| a | b |\n| - | - |\n| 1 | 2 |\n\n- [x] done\n- [ ] todo");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
    expect(html).toContain('type="checkbox"');
  });

  it("renders fenced code blocks with the language as a class", () => {
    expect(markdownToHtml("```js\nlet a = 1;\n```")).toContain('<code class="language-js">');
  });
});
