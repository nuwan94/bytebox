"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each tool is loaded on its own page only, so a heavy dependency in one tool
// never weighs on the others.
export const toolComponents: Record<string, ComponentType> = {
  "json-formatter": dynamic(() => import("./json-formatter/Tool")),
};
