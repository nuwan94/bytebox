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
};
