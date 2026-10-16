import { marked } from "marked";

/**
 * Renders GitHub-flavoured Markdown to HTML. The result is not sanitised:
 * pass it through DOMPurify before putting it on the page.
 */
export function markdownToHtml(source: string): string {
  return marked.parse(source, { async: false, gfm: true }) as string;
}
