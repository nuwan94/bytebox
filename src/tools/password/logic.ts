export const CHARACTER_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;

export type SetName = keyof typeof CHARACTER_SETS;
export type PasswordSets = Record<SetName, boolean>;

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;

const chosen = (sets: PasswordSets) => (Object.keys(CHARACTER_SETS) as SetName[]).filter((name) => sets[name]);
const clamp = (length: number) => Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.floor(length) || MIN_LENGTH));

// Rejection sampling, so every index is equally likely (a plain modulo is biased).
function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer);
  while (buffer[0] >= limit);
  return buffer[0] % max;
}

/** Makes a random password containing at least one character from each chosen set. */
export function makePassword(length: number, sets: PasswordSets): string {
  const names = chosen(sets);
  if (names.length === 0) return "";
  const pool = names.map((name) => CHARACTER_SETS[name]).join("");
  const size = clamp(length);
  for (;;) {
    let password = "";
    for (let index = 0; index < size; index++) password += pool[randomIndex(pool.length)];
    if (names.every((name) => [...password].some((char) => CHARACTER_SETS[name].includes(char)))) return password;
  }
}

/** Approximate strength in bits: length times log2 of the pool size. */
export function entropyBits(length: number, sets: PasswordSets): number {
  const pool = chosen(sets).reduce((total, name) => total + CHARACTER_SETS[name].length, 0);
  return pool === 0 ? 0 : Math.round(clamp(length) * Math.log2(pool));
}
