import { useEffect, useRef, useState } from "react";
import {
  patchSupportState,
  readSupportState,
  recallScroll,
  rememberScroll,
  type SupportSessionState,
} from "@/lib/supportSession";

/** Read the support session once after hydration (SSR-safe). */
export function useSupportSession(): SupportSessionState | null {
  const [state, setState] = useState<SupportSessionState | null>(null);
  useEffect(() => {
    setState(readSupportState());
  }, []);
  return state;
}

/** Persist a patch once on mount. */
export function useRecordSupportState(patch: Partial<SupportSessionState>): void {
  const serialized = JSON.stringify(patch);
  useEffect(() => {
    patchSupportState(JSON.parse(serialized) as Partial<SupportSessionState>);
  }, [serialized]);
}

/**
 * Restore the previous scroll offset for a page key, then keep it up to date.
 * A hash in the URL always wins so deep links still land on their anchor.
 */
export function useScrollRestore(key: string): void {
  const restored = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!restored.current) {
      restored.current = true;
      if (!window.location.hash) {
        const offset = recallScroll(key);
        if (offset > 0) {
          window.requestAnimationFrame(() => window.scrollTo({ top: offset, behavior: "auto" }));
        }
      }
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        rememberScroll(key, window.scrollY);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      rememberScroll(key, window.scrollY);
    };
  }, [key]);
}
