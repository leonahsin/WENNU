import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Canonical draft-form state.
 *
 * A saved draft is restored exactly once, before the form is treated as
 * interactive, and restoration never clobbers a field the visitor has already
 * edited during this session.
 */

/** Merge a stored draft into current state without overwriting edited fields. */
export function mergeRestoredDraft<T extends object>(
  empty: T,
  saved: Partial<T> | null | undefined,
  current: T,
  dirtyKeys: Iterable<keyof T>,
): T {
  const merged = { ...empty, ...(saved ?? {}) } as T;
  for (const key of dirtyKeys) {
    merged[key] = current[key];
  }
  return merged;
}

export interface DraftFormApi<T extends object> {
  data: T;
  /** Patch one or more fields; patched keys become the canonical source of truth. */
  update: (patch: Partial<T>) => void;
  /** Replace the whole form (used for reset after a successful submission). */
  replace: (next: T) => void;
  /** True once the one-time restore attempt has finished. */
  restored: boolean;
}

export function useDraftForm<T extends object>(
  storageKey: string,
  empty: T,
  parse: (raw: string) => Partial<T> | null,
  onRestore?: (raw: string) => void,
): DraftFormApi<T> {
  const [data, setData] = useState<T>(empty);
  const [restored, setRestored] = useState(false);
  const dirtyKeys = useRef(new Set<keyof T>());
  const didRestore = useRef(false);
  const parseRef = useRef(parse);
  const onRestoreRef = useRef(onRestore);
  parseRef.current = parse;
  onRestoreRef.current = onRestore;

  useEffect(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = parseRef.current(raw);
        if (saved) {
          setData((current) => mergeRestoredDraft(empty, saved, current, dirtyKeys.current));
        }
        onRestoreRef.current?.(raw);
      }
    } catch {
      /* unreadable draft is ignored */
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const update = useCallback((patch: Partial<T>) => {
    setData((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof T)[]) {
        dirtyKeys.current.add(key);
        next[key] = patch[key] as T[keyof T];
      }
      return next;
    });
  }, []);

  const replace = useCallback((next: T) => {
    dirtyKeys.current = new Set();
    setData(next);
  }, []);

  return { data, update, replace, restored };
}
