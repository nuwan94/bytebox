export type Consent = "granted" | "denied" | "unset";

const KEY = "bytebox-analytics-consent";
const EVENT = "bytebox-consent";

// Used when the browser blocks storage, so the choice still holds for this visit.
let memory: Consent = "unset";

export function readConsent(): Consent {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "granted" || stored === "denied" ? stored : memory;
  } catch {
    return memory;
  }
}

/** Saves the visitor's choice. Pass "unset" to forget it and ask again. */
export function writeConsent(value: Consent) {
  memory = value;
  try {
    if (value === "unset") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, value);
  } catch {
    // Storage is unavailable; the in-memory value covers this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
