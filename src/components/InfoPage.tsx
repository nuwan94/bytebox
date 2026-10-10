import Link from "next/link";
import type { ReactNode } from "react";
import type { StickerColor } from "@/tools/registry";

/** Layout for the text pages: about, privacy and contact. */
export function InfoPage({ title, color, children }: { title: string; color: StickerColor; children: ReactNode }) {
  return (
    <main className="tool">
      <div className="tool-head">
        <Link className="btn" href="/">Back to the sheet</Link>
        <h1 data-color={color}>{title}</h1>
      </div>
      <div className="page">
        <div className="article">{children}</div>
      </div>
    </main>
  );
}
