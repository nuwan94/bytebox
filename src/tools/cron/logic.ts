import cronstrue from "cronstrue";

export type Schedule = {
  expression: string;
  minutes: Set<number>;
  hours: Set<number>;
  days: Set<number>;
  months: Set<number>;
  weekdays: Set<number>;
  /** When both day fields are restricted, a day matches if either one does (standard cron). */
  eitherDay: boolean;
};

export type CronResult = { ok: true; schedule: Schedule } | { ok: false; error: string };

const MACROS: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type FieldSpec = { name: string; min: number; max: number; names?: string[]; offset?: number };
const FIELDS: FieldSpec[] = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "day of the month", min: 1, max: 31 },
  { name: "month", min: 1, max: 12, names: MONTHS, offset: 1 },
  { name: "day of the week", min: 0, max: 7, names: DAYS, offset: 0 },
];

function parseField(text: string, spec: FieldSpec): Set<number> | string {
  const values = new Set<number>();
  const read = (token: string): number | string => {
    const named = spec.names?.indexOf(token.toUpperCase()) ?? -1;
    const value = named >= 0 ? named + (spec.offset ?? 0) : /^\d+$/.test(token) ? Number(token) : NaN;
    if (Number.isNaN(value)) return `"${token}" isn't a valid ${spec.name}.`;
    if (value < spec.min || value > spec.max) return `${value} is outside ${spec.min} to ${spec.max} for the ${spec.name}.`;
    return value;
  };

  for (const part of text.split(",")) {
    const pieces = part.split("/");
    if (pieces.length > 2 || pieces.some((piece) => piece === "")) return `"${part}" isn't a valid ${spec.name}.`;
    const [range, stepText] = pieces;
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) return `The step "${stepText}" in the ${spec.name} must be a whole number above 0.`;

    let low: number;
    let high: number;
    if (range === "*") [low, high] = [spec.min, spec.max];
    else if (range.includes("-")) {
      const [from, to] = range.split("-").map(read);
      if (typeof from === "string") return from;
      if (typeof to === "string") return to;
      [low, high] = [from, to];
    } else {
      const single = read(range);
      if (typeof single === "string") return single;
      [low, high] = [single, stepText === undefined ? single : spec.max];
    }
    if (low > high) return `The range ${range} in the ${spec.name} runs backwards.`;
    for (let value = low; value <= high; value += step) values.add(value);
  }
  return values;
}

/** Reads a five-field cron expression or a macro such as @daily. */
export function parseCron(input: string): CronResult {
  const trimmed = input.trim();
  const expression = MACROS[trimmed.toLowerCase()] ?? trimmed;
  const fields = expression.split(/\s+/).filter(Boolean);
  if (fields.length !== 5) {
    return {
      ok: false,
      error: `A cron expression needs five fields: minute, hour, day of the month, month and day of the week. This one has ${fields.length}.`,
    };
  }
  const sets: Set<number>[] = [];
  for (const [index, field] of fields.entries()) {
    const parsed = parseField(field, FIELDS[index]);
    if (typeof parsed === "string") return { ok: false, error: parsed };
    sets.push(parsed);
  }
  const [minutes, hours, days, months, weekdays] = sets;
  if (weekdays.delete(7)) weekdays.add(0); // 7 is another way to write Sunday
  return {
    ok: true,
    schedule: { expression: fields.join(" "), minutes, hours, days, months, weekdays, eitherDay: !fields[2].startsWith("*") && !fields[4].startsWith("*") },
  };
}

/** Plain-English description, from the cronstrue library. */
export function describeCron(schedule: Schedule): string {
  return cronstrue.toString(schedule.expression, { use24HourTimeFormat: true, verbose: true });
}

const HORIZON_YEARS = 8;

/** The next times the schedule fires after `from`, in local time or UTC. */
export function nextRuns(schedule: Schedule, from: Date, count: number, utc = false): Date[] {
  const make = (y: number, mo: number, d: number, h: number, mi: number) => (utc ? new Date(Date.UTC(y, mo, d, h, mi)) : new Date(y, mo, d, h, mi));
  const parts = (t: Date) =>
    utc
      ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCDay()]
      : [t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getDay()];

  const start = parts(from);
  let t = make(start[0], start[1], start[2], start[3], start[4] + 1);
  const end = make(start[0] + HORIZON_YEARS, start[1], start[2], 0, 0).getTime();
  const runs: Date[] = [];

  while (runs.length < count && t.getTime() < end) {
    const [y, mo, d, h, mi, wd] = parts(t);
    const dayOk = schedule.eitherDay
      ? schedule.days.has(d) || schedule.weekdays.has(wd)
      : schedule.days.has(d) && schedule.weekdays.has(wd);
    if (!schedule.months.has(mo + 1)) t = make(y, mo + 1, 1, 0, 0);
    else if (!dayOk) t = make(y, mo, d + 1, 0, 0);
    else if (!schedule.hours.has(h)) t = make(y, mo, d, h + 1, 0);
    else if (!schedule.minutes.has(mi)) t = make(y, mo, d, h, mi + 1);
    else {
      runs.push(t);
      t = make(y, mo, d, h, mi + 1);
    }
  }
  return runs;
}
