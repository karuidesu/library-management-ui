"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { usePersistentFlag } from "@/hooks/useClientState";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface ShellContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ShellContext = React.createContext<ShellContextValue | null>(null);

export function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) throw new Error("useShell must be used inside <AppShell>");
  return context;
}

const COLLAPSE_KEY = "agbale:sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = usePersistentFlag(COLLAPSE_KEY, false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleCollapsed = React.useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  const openDrawer = React.useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = React.useCallback(() => setDrawerOpen(false), []);

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  const value = React.useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [collapsed, toggleCollapsed, drawerOpen, openDrawer, closeDrawer],
  );

  return (
    <ShellContext.Provider value={value}>
      <a
        href="#main-content"
        className="sr-only-focusable focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:h-auto focus:w-auto focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:[clip-path:none]"
      >
        Passer au contenu
      </a>

      <div className="flex min-h-dvh bg-canvas">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
