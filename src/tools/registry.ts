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
  { slug: "regex", glyph: ".*", name: "Regex tester", does: "Try a pattern on sample text", kind: "inspect", color: "ink", shape: "circle", tilt: -5 },
  { slug: "timestamp", glyph: "1e9", name: "Timestamp", does: "Unix time to dates and back", kind: "convert", color: "gum", shape: "pill", tilt: 2 },
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
