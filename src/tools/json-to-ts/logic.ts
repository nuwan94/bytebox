import { splitWords } from "../case-converter/logic";
import type { TextResult } from "../types";

// A value's type is a list of options, so [1, "a"] becomes number | string.
type Field = { type: Option[]; optional: boolean };
type Option =
  | { kind: "string" | "number" | "boolean" | "null" }
  | { kind: "object"; fields: Map<string, Field> }
  | { kind: "array"; item: Option[] };

function infer(value: unknown): Option {
  if (value === null) return { kind: "null" };
  if (Array.isArray(value)) return { kind: "array", item: value.reduce<Option[]>((list, element) => add(list, infer(element)), []) };
  if (typeof value === "object") {
    const fields = new Map<string, Field>();
    for (const [key, child] of Object.entries(value)) fields.set(key, { type: [infer(child)], optional: false });
    return { kind: "object", fields };
  }
  return { kind: typeof value as "string" | "number" | "boolean" };
}

function mergeObjects(a: Map<string, Field>, b: Map<string, Field>): Map<string, Field> {
  const fields = new Map<string, Field>();
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    const left = a.get(key);
    const right = b.get(key);
    if (left && right) fields.set(key, { type: right.type.reduce(add, left.type), optional: left.optional || right.optional });
    else fields.set(key, { ...(left ?? right)!, optional: true });
  }
  return fields;
}

/** Adds one option to a list, merging it with an option of the same kind. */
function add(list: Option[], next: Option): Option[] {
  const index = list.findIndex((option) => option.kind === next.kind);
  if (index === -1) return [...list, next];
  const existing = list[index];
  let merged: Option = existing;
  if (existing.kind === "object" && next.kind === "object") merged = { kind: "object", fields: mergeObjects(existing.fields, next.fields) };
  if (existing.kind === "array" && next.kind === "array") merged = { kind: "array", item: next.item.reduce(add, existing.item) };
  return list.map((option, position) => (position === index ? merged : option));
}

const pascal = (hint: string) => {
  const name = splitWords(hint).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
  if (!name) return "Item";
  return /^\d/.test(name) ? `T${name}` : name;
};

const singular = (word: string) => (/ies$/i.test(word) ? word.slice(0, -3) + "y" : /[^s]s$/i.test(word) ? word.slice(0, -1) : `${word}Item`);
const safeKey = (key: string) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key));

/** Writes TypeScript interfaces that describe a JSON sample. */
export function jsonToTypeScript(text: string, rootName = "Root"): TextResult {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }

  const declarations: string[] = [];
  const used = new Set<string>();
  const uniqueName = (hint: string) => {
    const base = pascal(hint);
    let name = base;
    for (let count = 2; used.has(name); count++) name = `${base}${count}`;
    used.add(name);
    return name;
  };

  const typeOf = (options: Option[], hint: string): string =>
    options.length === 0 ? "unknown" : options.map((option) => optionType(option, hint)).join(" | ");

  function optionType(option: Option, hint: string): string {
    if (option.kind === "array") {
      const item = typeOf(option.item, singular(hint));
      return option.item.length > 1 ? `(${item})[]` : `${item}[]`;
    }
    if (option.kind === "object") return declare(option.fields, hint);
    return option.kind;
  }

  function declare(fields: Map<string, Field>, hint: string): string {
    const name = uniqueName(hint);
    const slot = declarations.push("") - 1; // reserve the place so parents come before children
    const lines = [...fields].map(([key, field]) => `  ${safeKey(key)}${field.optional ? "?" : ""}: ${typeOf(field.type, key)};`);
    declarations[slot] = `export interface ${name} {\n${lines.join("\n")}\n}`;
    return name;
  }

  const root = infer(value);
  if (root.kind === "object") declare(root.fields, rootName);
  else {
    const slot = declarations.push("") - 1;
    declarations[slot] = `export type ${uniqueName(rootName)} = ${optionType(root, rootName === "Root" ? "Items" : rootName)};`;
  }
  return { ok: true, output: declarations.join("\n\n") + "\n" };
}
