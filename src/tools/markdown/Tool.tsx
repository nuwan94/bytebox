"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { copyText } from "@/lib/copy";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { markdownToHtml } from "./logic";

const FENCE = "```";
const SAMPLE = `# Release notes

Bytebox now has **24 tools**, and everything still runs in your browser.

## New

- [x] Markdown preview
- [x] Cron explainer
- [ ] Something else next

| Tool | Kind |
| ---- | ---- |
| QR code | generate |
| SQL formatter | format |

${FENCE}js
const greeting = "hello";
${FENCE}

> Paste your own Markdown to replace this.
`;

const IDLE = waiting("Type Markdown on the left. The preview updates as you type.");

export default function MarkdownPreview() {
  const [source, setSource] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState<StatusInfo>(IDLE);

  // Sanitising needs the browser's DOM, so it runs after the first render.
  useEffect(() => setHtml(DOMPurify.sanitize(markdownToHtml(source))), [source]);

  async function copy() {
    if (!html) return setStatus({ tone: "idle", text: "Nothing to copy yet.", cat: "idle" });
    setStatus((await copyText(html)) ? ok("Copied the HTML.") : failed("The browser blocked copying. Select the text and copy it by hand."));
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={copy}>Copy HTML</button>
        <button className="btn" onClick={() => { setSource(""); setStatus(IDLE); }}>Clear</button>
      </div>
      <div className="panes">
        <div className="pane" data-color="cobalt">
          <label htmlFor="md-in">Markdown</label>
          <textarea id="md-in" spellCheck={false} value={source} onChange={(event) => { setSource(event.target.value); setStatus(IDLE); }} />
        </div>
        <div className="pane" data-color="mint">
          <span className="pane-label">Preview</span>
          <div className="preview markdown" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <Status status={status} />
    </div>
  );
}
