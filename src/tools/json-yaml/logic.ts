import YAML from "yaml";
import type { TextResult } from "../types";

// The yaml library adds a multi-line excerpt of the source; the first line says enough.
const message = (error: unknown) =>
  (error instanceof Error ? error.message : String(error)).split("\n")[0].replace(/; please use YAML\.parseAllDocuments\(\)/, "");

export function jsonToYaml(text: string): TextResult {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    return { ok: false, error: message(error) };
  }
  return { ok: true, output: YAML.stringify(value) };
}

/** Reads one YAML document. Anchors and aliases are expanded in the JSON. */
export function yamlToJson(text: string, indent = 2): TextResult {
  try {
    const value = YAML.parse(text);
    return { ok: true, output: JSON.stringify(value ?? null, null, indent) };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}
