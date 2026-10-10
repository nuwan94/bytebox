export const MAX_UUIDS = 100;

export type UuidStyle = { uppercase: boolean; hyphens: boolean };

/** Makes random (version 4) UUIDs. The count is clamped to 1..MAX_UUIDS. */
export function makeUuids(count: number, style: UuidStyle): string[] {
  const total = Math.min(MAX_UUIDS, Math.max(1, Math.floor(count) || 1));
  return Array.from({ length: total }, () => {
    let id: string = crypto.randomUUID();
    if (!style.hyphens) id = id.replaceAll("-", "");
    return style.uppercase ? id.toUpperCase() : id;
  });
}
