"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "agbale:theme";
const THEME_EVENT = "agbale:theme-change";
const LEGACY_KEY = "libris:theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    root.setAttribute("dark", "");
    if (body) {
      body.classList.add("dark");
      body.setAttribute("dark", "");
      body.setAttribute("data-theme", "dark");
    }
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.removeAttribute("dark");
    if (body) {
      body.classList.remove("dark");
      body.removeAttribute("dark");
      body.setAttribute("data-theme", "light");
    }
  }
}

export function useTheme() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener(THEME_EVENT, onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
      window.removeEventListener(THEME_EVENT, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback((): Theme => {
    try {
      const stored = (window.localStorage.getItem(THEME_KEY) ||
        window.localStorage.getItem(LEGACY_KEY)) as Theme | null;
      if (stored === "light" || stored === "dark") {
        applyThemeToDocument(stored);
        return stored;
      }
      const system = getSystemTheme();
      applyThemeToDocument(system);
      return system;
    } catch {
      return "light";
    }
  }, []);

  const getServerSnapshot = useCallback((): Theme => "light", []);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_KEY, next);
      window.localStorage.removeItem(LEGACY_KEY);
      applyThemeToDocument(next);
      window.dispatchEvent(new Event(THEME_EVENT));
    } catch {
      applyThemeToDocument(next);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
