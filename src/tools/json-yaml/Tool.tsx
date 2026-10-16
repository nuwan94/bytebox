"use client";

import { TransformTool } from "@/components/TransformTool";
import { jsonToYaml, yamlToJson } from "./logic";

const SAMPLE = `{
  "name": "bytebox",
  "port": 8080,
  "debug": false,
  "tools": ["json", "yaml"],
  "owner": { "name": "Nuwan", "site": "https://nuwan.dev" }
}`;

export default function JsonYaml() {
  return (
    <TransformTool
      id="json-yaml"
      inputLabel="JSON or YAML"
      outputLabel="Result"
      sample={SAMPLE}
      idle="Paste JSON or YAML, then press the direction you want."
      actions={[
        { label: "JSON to YAML", done: "Converted to YAML.", problem: "That isn't valid JSON.", run: jsonToYaml },
        { label: "YAML to JSON", done: "Converted to JSON.", problem: "That isn't valid YAML.", run: (input) => yamlToJson(input) },
      ]}
    />
  );
}
