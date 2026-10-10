export type CommonPattern = { name: string; pattern: string };

// Practical patterns for finding things in text. They favour readability over
// covering every edge of the relevant standards (email especially).
export const COMMON_PATTERNS: CommonPattern[] = [
  { name: "Email", pattern: "[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+" },
  { name: "Web address", pattern: "https?://[^\\s/$.?#][^\\s]*" },
  { name: "IPv4 address", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])" },
  { name: "Time (24-hour)", pattern: "\\b(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?\\b" },
  { name: "Hex colour", pattern: "#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b" },
  { name: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" },
  { name: "Number", pattern: "-?\\d+(?:\\.\\d+)?" },
  { name: "Phone (international)", pattern: "\\+\\d{1,3}[\\s-]?\\d[\\d\\s-]{6,12}\\d" },
];

export type Piece = { name: string; insert: string };

/** Building blocks that get appended to the pattern. */
export const PIECES: Piece[] = [
  { name: "Digit", insert: "\\d" },
  { name: "Letter", insert: "[A-Za-z]" },
  { name: "Word character", insert: "\\w" },
  { name: "Space", insert: "\\s" },
  { name: "Any character", insert: "." },
  { name: "Start of line", insert: "^" },
  { name: "End of line", insert: "$" },
  { name: "One or more", insert: "+" },
  { name: "Zero or more", insert: "*" },
  { name: "Optional", insert: "?" },
  { name: "Or", insert: "|" },
  { name: "Group", insert: "()" },
];

/** Contains at least one example of every common pattern. */
export const SAMPLE_TEXT = [
  "Ada Lovelace <ada@example.com> signed up on 2026-03-14 at 09:30:15.",
  "Docs: https://example.com/docs/getting-started?lang=en",
  "Server 192.168.1.20 returned 404 in 12.5 ms.",
  "Theme colours are #ff6fb0 and #fd0.",
  "Request id 3f2b8c1e-9a4d-4e7b-8c21-5d6f7a8b9c0d",
  "Call +44 20 7946 0958 for help.",
].join("\n");
