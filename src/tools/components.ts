"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each tool is loaded on its own page only, so a heavy dependency in one tool
// never weighs on the others.
export const toolComponents: Record<string, ComponentType> = {
  "json-formatter": dynamic(() => import("./json-formatter/Tool")),
  base64: dynamic(() => import("./base64/Tool")),
  "url-encoder": dynamic(() => import("./url-encoder/Tool")),
  uuid: dynamic(() => import("./uuid/Tool")),
  hash: dynamic(() => import("./hash/Tool")),
  jwt: dynamic(() => import("./jwt/Tool")),
  regex: dynamic(() => import("./regex/Tool")),
  timestamp: dynamic(() => import("./timestamp/Tool")),
  "case-converter": dynamic(() => import("./case-converter/Tool")),
  "text-diff": dynamic(() => import("./text-diff/Tool")),
  "colour-converter": dynamic(() => import("./colour-converter/Tool")),
  password: dynamic(() => import("./password/Tool")),
  "number-bases": dynamic(() => import("./number-bases/Tool")),
  "line-sorter": dynamic(() => import("./line-sorter/Tool")),
  "text-counter": dynamic(() => import("./text-counter/Tool")),
  "lorem-ipsum": dynamic(() => import("./lorem-ipsum/Tool")),
};
