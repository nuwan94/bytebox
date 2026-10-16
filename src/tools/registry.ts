export type ToolKind = "format" | "convert" | "generate" | "inspect";
export type StickerColor = "gum" | "cobalt" | "mint" | "tang" | "lilac" | "sun" | "ink";
export type StickerShape = "squircle" | "circle" | "pill" | "blob" | "leaf" | "arch";

export type Tool = {
  slug: string;
  glyph: string;
  name: string;
  does: string;
  kind: ToolKind;
  color: StickerColor;
  shape: StickerShape;
  /** Resting rotation of the sticker on the sheet, in degrees. */
  tilt: number;
};

// Adding a tool: add an entry here, create src/tools/<slug>/Tool.tsx, and
// register that component in src/tools/components.ts.
export const tools: Tool[] = [
  { slug: "json-formatter", glyph: "{ }", name: "JSON formatter", does: "Format, minify and validate", kind: "format", color: "gum", shape: "circle", tilt: -4 },
  { slug: "base64", glyph: "64", name: "Base64", does: "Encode and decode text", kind: "convert", color: "cobalt", shape: "pill", tilt: 3 },
  { slug: "url-encoder", glyph: "%20", name: "URL encoder", does: "Escape and unescape URLs", kind: "convert", color: "mint", shape: "leaf", tilt: -2 },
  { slug: "uuid", glyph: "#", name: "UUID maker", does: "Make UUIDs in bulk", kind: "generate", color: "tang", shape: "blob", tilt: 5 },
  { slug: "hash", glyph: "##", name: "Hash maker", does: "SHA hashes of any text", kind: "generate", color: "lilac", shape: "arch", tilt: -3 },
  { slug: "jwt", glyph: "a.b.c", name: "JWT reader", does: "Read a token's header and payload", kind: "inspect", color: "sun", shape: "squircle", tilt: 4 },
  { slug: "regex", glyph: ".*", name: "Regex tester", does: "Build a pattern and try it on text", kind: "inspect", color: "ink", shape: "circle", tilt: -5 },
  { slug: "timestamp", glyph: "1e9", name: "Timestamp", does: "Unix time to dates and back", kind: "convert", color: "gum", shape: "pill", tilt: 2 },
  { slug: "case-converter", glyph: "aA", name: "Case converter", does: "Camel, snake, kebab and more", kind: "convert", color: "mint", shape: "squircle", tilt: 3 },
  { slug: "text-diff", glyph: "+ -", name: "Text diff", does: "Compare two texts line by line", kind: "inspect", color: "sun", shape: "leaf", tilt: -4 },
  { slug: "colour-converter", glyph: "#f0f", name: "Colour converter", does: "HEX, RGB and HSL", kind: "convert", color: "lilac", shape: "blob", tilt: 4 },
  { slug: "password", glyph: "***", name: "Password maker", does: "Random passwords, made locally", kind: "generate", color: "ink", shape: "pill", tilt: -2 },
  { slug: "number-bases", glyph: "0x", name: "Number bases", does: "Binary, octal, decimal and hex", kind: "convert", color: "tang", shape: "circle", tilt: 2 },
  { slug: "line-sorter", glyph: "a-z", name: "Line sorter", does: "Sort, trim and dedupe lines", kind: "format", color: "cobalt", shape: "arch", tilt: -3 },
  { slug: "text-counter", glyph: "123", name: "Text counter", does: "Characters, words, lines, bytes", kind: "inspect", color: "gum", shape: "squircle", tilt: 5 },
  { slug: "lorem-ipsum", glyph: "¶", name: "Lorem ipsum", does: "Placeholder paragraphs", kind: "generate", color: "mint", shape: "leaf", tilt: -5 },
  { slug: "json-yaml", glyph: "y:", name: "JSON and YAML", does: "Convert between JSON and YAML", kind: "convert", color: "sun", shape: "blob", tilt: 3 },
  { slug: "json-to-ts", glyph: "TS", name: "JSON to TypeScript", does: "Interfaces from a JSON sample", kind: "convert", color: "cobalt", shape: "squircle", tilt: -4 },
  { slug: "qr-code", glyph: "▚▞", name: "QR code maker", does: "QR codes as PNG or SVG", kind: "generate", color: "lilac", shape: "circle", tilt: 4 },
  { slug: "cron", glyph: "*/5", name: "Cron explainer", does: "Read a schedule and its next runs", kind: "inspect", color: "tang", shape: "pill", tilt: -3 },
  { slug: "sql-formatter", glyph: "SQL", name: "SQL formatter", does: "Tidy queries in eight dialects", kind: "format", color: "mint", shape: "arch", tilt: 2 },
  { slug: "markdown", glyph: "M↓", name: "Markdown preview", does: "Render Markdown and copy the HTML", kind: "format", color: "gum", shape: "leaf", tilt: -2 },
  { slug: "html-entities", glyph: "&lt;", name: "HTML entities", does: "Escape and unescape HTML", kind: "convert", color: "ink", shape: "blob", tilt: 5 },
  { slug: "url-parser", glyph: "://", name: "URL parser", does: "Split a URL and its query", kind: "inspect", color: "sun", shape: "squircle", tilt: -4 },
];

export const kinds: { id: ToolKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "format", label: "Format" },
  { id: "convert", label: "Convert" },
  { id: "generate", label: "Generate" },
  { id: "inspect", label: "Inspect" },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
