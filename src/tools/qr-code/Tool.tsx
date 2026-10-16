"use client";

import { useEffect, useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { LEVELS, makeQrPng, makeQrSvg, type Level } from "./logic";

const IDLE = waiting("Type a link or any text. The code updates as you type.");

function download(href: string, name: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  link.click();
}

export default function QrCode() {
  const [text, setText] = useState("https://devtools.nuwan.dev/");
  const [level, setLevel] = useState<Level>("M");
  const [svg, setSvg] = useState("");
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  useEffect(() => {
    let stale = false;
    makeQrSvg(text, level).then((result) => {
      if (stale) return;
      setSvg(result.ok ? result.output : "");
      setStatus(result.ok || !text ? IDLE : failed(result.error));
    });
    return () => {
      stale = true;
    };
  }, [text, level]);

  function saveSvg() {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    download(url, "qr-code.svg");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setParty((count) => count + 1);
    setStatus(ok("Saved the SVG."));
  }

  async function savePng() {
    const result = await makeQrPng(text, level);
    if (!result.ok) return setStatus(failed(result.error));
    download(result.output, "qr-code.png");
    setParty((count) => count + 1);
    setStatus(ok("Saved a 1024 pixel PNG."));
  }

  return (
    <div>
      <div className="qr">
        <div>
          <div className="pane" data-color="lilac">
            <label htmlFor="qr-in">Text or link</label>
            <textarea id="qr-in" className="short" spellCheck={false} value={text} onChange={(event) => setText(event.target.value)} />
          </div>
          <div className="actions actions-below">
            <button className="btn btn-primary" onClick={savePng} disabled={!svg}>Download PNG</button>
            <button className="btn" onClick={saveSvg} disabled={!svg}>Download SVG</button>
            <div className="options">
              <label>
                Error correction{" "}
                <select value={level} onChange={(event) => setLevel(event.target.value as Level)}>
                  {LEVELS.map((option) => <option key={option.level} value={option.level}>{option.label}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
        {/* The SVG comes from the qrcode library, which draws only paths, so it is safe to insert. */}
        <div className="qr-code" role="img" aria-label={svg ? "QR code for the text" : "No QR code yet"} dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <Status status={status} party={party} />
    </div>
  );
}
