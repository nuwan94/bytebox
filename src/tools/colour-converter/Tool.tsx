"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { formatColour, parseColour } from "./logic";

export default function ColourConverter() {
  const [input, setInput] = useState("#ff6fb0");
  const [copied, setCopied] = useState<StatusInfo | null>(null);

  const result = input.trim() ? parseColour(input) : null;
  const formats = result?.ok ? formatColour(result.rgb) : null;

  let status: StatusInfo;
  if (!result) status = waiting("Type a colour as HEX, RGB or HSL.");
  else if (!result.ok) status = failed(`That colour can't be read. ${result.error}`);
  else status = copied ?? { tone: "ok", text: "Colour read. All three formats are below.", cat: "idle" };

  const onCopy = (done: boolean, label: string) =>
    setCopied(done ? ok(`Copied the ${label} value.`) : failed("The browser blocked copying. Select the value and copy it by hand."));

  return (
    <div>
      <div className="pane" data-color="lilac">
        <label htmlFor="colour-in">Colour</label>
        <div className="with-swatch">
          <input id="colour-in" className="input" spellCheck={false} value={input} onChange={(event) => { setInput(event.target.value); setCopied(null); }} />
          <div className="swatch" style={formats ? { background: formats.hex } : undefined} role="img" aria-label={formats ? `Swatch of ${formats.hex}` : "No colour yet"} />
        </div>
      </div>
      {formats && (
        <div className="rows">
          <ResultRow label="HEX" value={formats.hex} onCopy={onCopy} />
          <ResultRow label="RGB" value={formats.rgb} onCopy={onCopy} />
          <ResultRow label="HSL" value={formats.hsl} onCopy={onCopy} />
        </div>
      )}
      <Status status={status} />
    </div>
  );
}
