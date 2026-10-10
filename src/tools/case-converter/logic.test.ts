import { describe, expect, it } from "vitest";
import { splitWords, toCases } from "./logic";

describe("case converter", () => {
  it("splits on separators, case changes and acronyms", () => {
    expect(splitWords("parseHTTPResponse_code-v2")).toEqual(["parse", "HTTP", "Response", "code", "v2"]);
  });

  it("converts to every case", () => {
    expect(toCases("parseHTTPResponse_code-v2")).toEqual({
      camel: "parseHttpResponseCodeV2",
      pascal: "ParseHttpResponseCodeV2",
      snake: "parse_http_response_code_v2",
      kebab: "parse-http-response-code-v2",
      constant: "PARSE_HTTP_RESPONSE_CODE_V2",
      title: "Parse Http Response Code V2",
    });
  });

  it("keeps accented letters together", () => {
    expect(toCases("café au lait").snake).toBe("café_au_lait");
  });

  it("returns empty strings for empty input", () => {
    expect(toCases("  ")).toEqual({ camel: "", pascal: "", snake: "", kebab: "", constant: "", title: "" });
  });
});
