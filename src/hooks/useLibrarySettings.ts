"use client";

import * as React from "react";

const STORAGE_KEY_NAME = "agbale:establishment-name";
const STORAGE_KEY_MAX_BOOKS = "agbale:max-borrowed-books";
export const DEFAULT_ESTABLISHMENT_NAME = "Bibliothèque Centrale";
export const DEFAULT_MAX_BOOKS = 5;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener("agbale:settings-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("agbale:settings-changed", callback);
  };
}

function getEstablishmentSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_NAME) || DEFAULT_ESTABLISHMENT_NAME;
  } catch {
    return DEFAULT_ESTABLISHMENT_NAME;
  }
}

function getServerEstablishmentSnapshot(): string {
  return DEFAULT_ESTABLISHMENT_NAME;
}

function getMaxBooksSnapshot(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_MAX_BOOKS);
    if (val) {
      const num = Number.parseInt(val, 10);
      if (!Number.isNaN(num) && num > 0) return num;
    }
  } catch {
    // ignore
  }
  return DEFAULT_MAX_BOOKS;
}

function getServerMaxBooksSnapshot(): number {
  return DEFAULT_MAX_BOOKS;
}

export function useLibrarySettings() {
  const establishmentName = React.useSyncExternalStore(
    subscribe,
    getEstablishmentSnapshot,
    getServerEstablishmentSnapshot,
  );

  const maxBooks = React.useSyncExternalStore(
    subscribe,
    getMaxBooksSnapshot,
    getServerMaxBooksSnapshot,
  );

  const setEstablishmentName = React.useCallback((name: string) => {
    try {
      localStorage.setItem(STORAGE_KEY_NAME, name);
      window.dispatchEvent(new CustomEvent("agbale:settings-changed"));
    } catch {
      // ignore
    }
  }, []);

  const setMaxBooks = React.useCallback((count: number) => {
    try {
      localStorage.setItem(STORAGE_KEY_MAX_BOOKS, String(count));
      window.dispatchEvent(new CustomEvent("agbale:settings-changed"));
    } catch {
      // ignore
    }
  }, []);

  return {
    establishmentName,
    setEstablishmentName,
    maxBooks,
    setMaxBooks,
  };
}
