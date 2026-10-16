"use client";

import { useEffect, useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { describeCron, nextRuns, parseCron } from "./logic";

const PRESETS = [
  ["Every 5 minutes", "*/5 * * * *"],
  ["Hourly", "0 * * * *"],
  ["Daily at midnight", "@daily"],
  ["Weekdays at 9", "0 9 * * 1-5"],
  ["Sundays at 3:30", "30 3 * * 0"],
  ["First of the month", "0 0 1 * *"],
] as const;

const FIELDS = ["minute", "hour", "day", "month", "weekday"];

export default function Cron() {
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [utc, setUtc] = useState(false);
  // The next runs depend on the clock, so they are worked out only in the browser.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), [expression, utc]);

  const parsed = parseCron(expression);
  let status: StatusInfo;
  let runs: Date[] = [];
  if (!expression.trim()) status = waiting("Type a cron expression or pick one below.");
  else if (!parsed.ok) status = failed(parsed.error);
  else {
    runs = now ? nextRuns(parsed.schedule, now, 10, utc) : [];
    let words: string;
    try {
      words = describeCron(parsed.schedule);
    } catch {
      words = "A valid schedule";
    }
    status = now && runs.length === 0 ? failed(`${words}, but that date never comes in the next eight years.`) : ok(`${words}.`);
  }

  const format = (date: Date) =>
    date.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: utc ? "UTC" : undefined,
    });

  return (
    <div>
      <div className="pane" data-color="tang">
        <label htmlFor="cron-in">Cron expression</label>
        <input id="cron-in" className="input input-cron" spellCheck={false} value={expression} onChange={(event) => setExpression(event.target.value)} />
      </div>
      <p className="cron-fields" aria-hidden="true">{FIELDS.map((field) => <span key={field}>{field}</span>)}</p>
      <div className="chips">
        {PRESETS.map(([label, value]) => (
          <button key={value} aria-pressed={expression === value} onClick={() => setExpression(value)}>
            {label} <code>{value}</code>
          </button>
        ))}
      </div>
      <Status status={status} />
      {runs.length > 0 && (
        <>
          <div className="actions actions-below">
            <h2 className="subhead">Next {runs.length} runs</h2>
            <div className="options">
              <label className="check">
                <input type="checkbox" checked={utc} onChange={(event) => setUtc(event.target.checked)} />
                Show in UTC
              </label>
            </div>
          </div>
          <ol className="runs">
            {runs.map((run) => (
              <li key={run.getTime()}>
                <time dateTime={run.toISOString()}>{format(run)}</time>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
