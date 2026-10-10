import { findMatches } from "./logic";

// Runs matching off the main thread, so a slow pattern can be stopped without
// freezing the page.
self.onmessage = (event: MessageEvent<{ id: number; pattern: string; flags: string; text: string }>) => {
  const { id, pattern, flags, text } = event.data;
  self.postMessage({ id, result: findMatches(pattern, flags, text) });
};
