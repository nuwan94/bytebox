"use client";

import { copyText } from "@/lib/copy";

/** One labelled value with its own copy button. */
export function ResultRow({ label, value, onCopy }: { label: string; value: string; onCopy: (copied: boolean, label: string) => void }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <code>{value}</code>
      <button className="btn" onClick={async () => onCopy(await copyText(value), label)}>Copy</button>
    </div>
  );
}
