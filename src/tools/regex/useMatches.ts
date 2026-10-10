"use client";

import { useEffect, useRef, useState } from "react";
import { findMatches, type RegexResult } from "./logic";

export const TIME_LIMIT_MS = 2000;
const TYPING_PAUSE_MS = 120;
const NOTHING: RegexResult = { ok: true, matches: [], capped: false };

export type MatchState = { result: RegexResult; timedOut: boolean };

/**
 * Finds matches in a background worker and gives up after TIME_LIMIT_MS, because
 * some patterns take effectively forever on certain text.
 */
export function useMatches(pattern: string, flags: string, text: string): MatchState {
  // The starting values are safe, so the first result is worked out directly.
  const [state, setState] = useState<MatchState>(() => ({ result: findMatches(pattern, flags, text), timedOut: false }));
  const worker = useRef<Worker | null>(null);
  const busy = useRef(false);
  const latest = useRef(0);

  useEffect(() => {
    const id = ++latest.current;
    let limit: ReturnType<typeof setTimeout> | undefined;

    const pause = setTimeout(() => {
      // A worker still chewing on an older pattern would make this one wait behind it.
      if (busy.current) {
        worker.current?.terminate();
        worker.current = null;
      }
      if (!worker.current) {
        try {
          worker.current = new Worker(new URL("./worker.ts", import.meta.url));
        } catch {
          // No worker support: match on the main thread, without the time limit.
          return setState({ result: findMatches(pattern, flags, text), timedOut: false });
        }
      }
      const current = worker.current;
      current.onmessage = (event: MessageEvent<{ id: number; result: RegexResult }>) => {
        busy.current = false;
        if (event.data.id !== latest.current) return;
        clearTimeout(limit);
        setState({ result: event.data.result, timedOut: false });
      };
      busy.current = true;
      current.postMessage({ id, pattern, flags, text });

      limit = setTimeout(() => {
        if (id !== latest.current) return;
        current.terminate();
        worker.current = null;
        busy.current = false;
        setState({ result: NOTHING, timedOut: true });
      }, TIME_LIMIT_MS);
    }, TYPING_PAUSE_MS);

    return () => {
      clearTimeout(pause);
      clearTimeout(limit);
    };
  }, [pattern, flags, text]);

  useEffect(() => () => worker.current?.terminate(), []);

  return state;
}
