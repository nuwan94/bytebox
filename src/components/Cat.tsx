export type CatState = "idle" | "disco" | "alarmed" | "sleepy";

// The mascot is an 8-bit sprite drawn from a character grid: one character per
// pixel, "." for transparent. Each state only overrides the rows that change.
const BASE = [
  "..d..........d..",
  ".dod........dod.",
  ".dood......dood.",
  ".doooddddddoood.",
  ".dooooooooooood.",
  ".dooooooooooood.",
  ".dowkoooooowkod.",
  ".dowkoooooowkod.",
  ".doooooppoooood.",
  ".dpooodoodooopd.",
  ".doooooddoooood.",
  ".dooooooooooood.",
  "..dddddddddddd..",
];

const FACES: Record<CatState, Record<number, string>> = {
  idle: {},
  disco: { 6: ".dkkkkkkkkkkkkd.", 7: ".dokckkookckkod." },
  alarmed: { 5: ".dowwwoooowwwod.", 6: ".dowkwoooowkwod.", 7: ".dowwwoooowwwod.", 9: ".dpooooddoooopd." },
  sleepy: { 6: ".dooooooooooood.", 7: ".dokkkooookkkod." },
};

const INKS: Record<string, string> = {
  o: "var(--tang)",
  d: "var(--ink)",
  w: "var(--paper)",
  k: "var(--ink)",
  p: "var(--gum)",
  c: "var(--mint)",
};

export function Cat({ state = "idle", px = 8 }: { state?: CatState; px?: number }) {
  const rows = BASE.map((row, index) => FACES[state][index] ?? row);
  return (
    <svg
      className="cat"
      width={16 * px}
      height={13 * px}
      viewBox="0 0 16 13"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Pixel cat, ${state}`}
    >
      {rows.flatMap((row, y) =>
        [...row].map((char, x) =>
          char === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={INKS[char]} />,
        ),
      )}
    </svg>
  );
}
