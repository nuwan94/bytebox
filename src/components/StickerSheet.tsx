"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { kinds, tools, type ToolKind } from "@/tools/registry";

export function StickerSheet() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ToolKind | "all">("all");

  const needle = query.trim().toLowerCase();
  const shown = tools.filter(
    (tool) =>
      (kind === "all" || tool.kind === kind) &&
      `${tool.name} ${tool.does} ${tool.slug}`.toLowerCase().includes(needle),
  );

  return (
    <section className="sheet" aria-labelledby="sheet-title">
      <div className="sheet-head">
        <h2 id="sheet-title">The sticker sheet</h2>
        <input
          className="search"
          type="search"
          placeholder="Find a tool"
          aria-label="Find a tool"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="kinds" role="group" aria-label="Show a kind of tool">
          {kinds.map((item) => (
            <button key={item.id} aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {shown.length > 0 ? (
        <ul className="stickers">
          {shown.map((tool) => (
            <li key={tool.slug}>
              <Link
                className="sticker"
                href={`/tools/${tool.slug}/`}
                data-color={tool.color}
                data-shape={tool.shape}
                style={{ "--r": `${tool.tilt}deg` } as CSSProperties}
              >
                <span className="glyph" aria-hidden="true">{tool.glyph}</span>
                <span className="name">{tool.name}</span>
                <span className="does">{tool.does}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="none">No sticker by that name. Try "json" or "uuid".</p>
      )}
    </section>
  );
}
