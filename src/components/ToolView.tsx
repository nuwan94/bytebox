"use client";

import { toolComponents } from "@/tools/components";

export function ToolView({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  if (!Tool) return <p className="soon">This tool isn't built yet. The JSON formatter is the first one ready.</p>;
  return <Tool />;
}
