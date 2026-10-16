import { describe, expect, it } from "vitest";
import { jsonToYaml, yamlToJson } from "./logic";

describe("json and yaml", () => {
  it("turns JSON into YAML", () => {
    expect(jsonToYaml('{"name":"bytebox","tools":["json","yaml"],"port":8080}')).toEqual({
      ok: true,
      output: "name: bytebox\ntools:\n  - json\n  - yaml\nport: 8080\n",
    });
  });

  it("turns YAML into JSON", () => {
    expect(yamlToJson("name: bytebox\ntools:\n  - json\nport: 8080\n")).toEqual({
      ok: true,
      output: '{\n  "name": "bytebox",\n  "tools": [\n    "json"\n  ],\n  "port": 8080\n}',
    });
  });

  it("expands anchors and aliases", () => {
    const result = yamlToJson("base: &b\n  retries: 3\nprod:\n  <<: *b\n  host: x\n");
    expect(result.ok && JSON.parse(result.output)).toMatchObject({ prod: { host: "x" } });
  });

  it("round-trips", () => {
    const json = '{\n  "a": [\n    1,\n    "two",\n    null,\n    true\n  ]\n}';
    const yaml = jsonToYaml(json);
    expect(yaml.ok && yamlToJson(yaml.output)).toEqual({ ok: true, output: json });
  });

  it("reports invalid input on either side", () => {
    expect(jsonToYaml("{bad}").ok).toBe(false);
    expect(yamlToJson("a: [1, 2").ok).toBe(false);
  });
});
