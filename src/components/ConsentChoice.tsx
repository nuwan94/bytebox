"use client";

import { useSyncExternalStore } from "react";
import { readConsent, subscribeConsent, writeConsent } from "@/lib/consent";

const CHOICES = {
  pending: "Checking your choice.",
  unset: "You haven't chosen yet. The question is at the bottom of the page.",
  granted: "You allowed page-view statistics.",
  denied: "You declined page-view statistics.",
};

/** Shows the visitor's analytics choice on the privacy page and lets them change it. */
export function ConsentChoice() {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "pending" as const);
  return (
    <p className="consent-choice">
      <span>{CHOICES[consent]}</span>
      {(consent === "granted" || consent === "denied") && (
        <button className="btn" onClick={() => writeConsent("unset")}>Change my choice</button>
      )}
    </p>
  );
}
