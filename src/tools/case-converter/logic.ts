/** Splits a phrase or identifier into words: "parseHTTPResponse_v2" gives parse, HTTP, Response, v2. */
export function splitWords(text: string): string[] {
  return text
    .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export function toCases(text: string) {
  const words = splitWords(text);
  const lower = words.map((word) => word.toLowerCase());
  const pascal = words.map(capitalise).join("");
  return {
    camel: pascal.charAt(0).toLowerCase() + pascal.slice(1),
    pascal,
    snake: lower.join("_"),
    kebab: lower.join("-"),
    constant: lower.join("_").toUpperCase(),
    title: words.map(capitalise).join(" "),
  };
}
