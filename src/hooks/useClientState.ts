"use client";

import { useCallback, useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

const STORAGE_EVENT = "agbale:storage";

function emitStorageChange() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function usePersistentFlag(key: string, fallback = false) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener(STORAGE_EVENT, onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
      window.removeEventListener(STORAGE_EVENT, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? fallback : stored === "true";
    } catch {
      return fallback;
    }
  }, [key, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // Ignored if storage is blocked
      }
      emitStorageChange();
    },
    [key],
  );

  return [value, setValue] as const;
}
