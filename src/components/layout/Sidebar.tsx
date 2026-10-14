"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, Library, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME, mainNavItems, settingsNavItem, type NavItem } from "@/lib/nav";
import { useFocusTrap, useEscapeKey, useScrollLock } from "@/hooks/useFocusTrap";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { useShell } from "./AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { currentUser } from "@/lib/data";

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex min-h-11 items-center gap-3 rounded-xl text-sm font-medium",
        "outline-none transition-colors duration-150",
        "focus-visible:ring-4 focus-visible:ring-brand-600/20",
        collapsed ? "justify-center px-0" : "px-3.5",
        active
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25 dark:bg-blue-600 dark:shadow-blue-900/40"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6]",
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0 transition-colors",
          active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:text-[#94A3B8] dark:group-hover:text-[#F3F4F6]",
        )}
        aria-hidden="true"
      />
      {collapsed ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  );
}

function NavList({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="flex-1 overflow-y-auto px-3 py-2">
      <ul className="space-y-1">
        {mainNavItems.map((item) => (
          <li key={item.href}>
            <NavLink
              item={item}
              collapsed={collapsed}
              active={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  const { establishmentName } = useLibrarySettings();

  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl outline-none",
        "focus-visible:ring-4 focus-visible:ring-brand-600/20",
        collapsed && "justify-center",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600 dark:bg-blue-600 shadow-sm shadow-brand-600/25">
        <Library className="size-[1.375rem] text-white" aria-hidden="true" />
      </span>
      {collapsed ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <div className="min-w-0">
          <span className="block truncate text-base font-semibold leading-tight tracking-tight text-slate-900 dark:text-[#F3F4F6]">
            {APP_NAME}
          </span>
          <span className="block truncate text-xs font-normal text-slate-500 dark:text-[#94A3B8]">
            {establishmentName}
          </span>
        </div>
      )}
    </Link>
  );
}

function SignOut({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/login"
      title={collapsed ? "Se déconnecter" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl text-sm font-medium text-slate-600 dark:text-[#94A3B8]",
        "outline-none transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400",
        "focus-visible:ring-4 focus-visible:ring-rose-600/20",
        collapsed ? "justify-center px-0" : "px-3.5",
      )}
    >
      <LogOut className="size-5 shrink-0 text-slate-400 dark:text-[#94A3B8]" aria-hidden="true" />
      {collapsed ? (
        <span className="sr-only">Se déconnecter</span>
      ) : (
        <span className="truncate">Se déconnecter</span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, drawerOpen, closeDrawer } = useShell();
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useEscapeKey(drawerOpen, closeDrawer);
  useScrollLock(drawerOpen);
  useFocusTrap(drawerRef, drawerOpen);

  return (
    <>
      <aside
        data-collapsed={collapsed}
        style={{
          width: collapsed
            ? "var(--spacing-sidebar-rail)"
            : "var(--spacing-sidebar)",
        }}
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-slate-200/70 dark:border-[#212B44]",
          "bg-white dark:bg-[#0B0F19] transition-[width] duration-300 ease-out lg:flex",
        )}
      >
        <div
          className={cn(
            "flex min-h-[var(--spacing-header)] items-center",
            collapsed ? "justify-center px-3" : "px-5",
          )}
        >
          <Brand collapsed={collapsed} />
        </div>

        <NavList collapsed={collapsed} />

        <div className="space-y-1 border-t border-slate-100 dark:border-[#212B44] px-3 py-3">
          <NavLink
            item={settingsNavItem}
            collapsed={collapsed}
            active={
              pathname === settingsNavItem.href ||
              pathname.startsWith(`${settingsNavItem.href}/`)
            }
          />
          <SignOut collapsed={collapsed} />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
            aria-pressed={collapsed}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl text-sm font-medium text-slate-500 dark:text-[#94A3B8]",
              "outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6]",
              "focus-visible:ring-4 focus-visible:ring-brand-600/20",
              collapsed ? "justify-center px-0" : "px-3.5",
            )}
          >
            <ChevronsLeft
              className={cn(
                "size-5 shrink-0 text-slate-400 dark:text-[#94A3B8] transition-transform duration-300",
                collapsed && "rotate-180",
              )}
              aria-hidden="true"
            />
            {collapsed ? null : <span className="truncate">Réduire</span>}
          </button>
        </div>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div
          onClick={closeDrawer}
          className={cn(
            "absolute inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={drawerRef}
          role="dialog"
          aria-modal={drawerOpen || undefined}
          aria-label="Menu de navigation"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(19rem,85vw)] flex-col bg-white dark:bg-[#0B0F19] dark:border-r dark:border-[#212B44]",
            "shadow-overlay transition-transform duration-300 ease-out",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex min-h-[var(--spacing-header)] items-center justify-between gap-3 px-5">
            <Brand collapsed={false} />
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Fermer le menu de navigation"
              data-autofocus
              className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <NavList collapsed={false} />

          <div className="space-y-1 border-t border-slate-100 dark:border-[#212B44] p-3">
            <NavLink
              item={settingsNavItem}
              collapsed={false}
              active={
                pathname === settingsNavItem.href ||
                pathname.startsWith(`${settingsNavItem.href}/`)
              }
            />
            <div className="my-2 flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#171E31] dark:border dark:border-[#212B44] px-3 py-2.5">
              <Avatar
                name={currentUser.name}
                gender={currentUser.gender}
                size="md"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-900 dark:text-[#F3F4F6]">
                  {currentUser.name}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-[#94A3B8]">
                  {currentUser.role}
                </span>
              </span>
            </div>
            <SignOut collapsed={false} />
          </div>
        </div>
      </div>
    </>
  );
}


export function SidebarTrigger() {
  const { openDrawer } = useShell();
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Ouvrir le menu de navigation"
      className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-600 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20 lg:hidden"
    >
      <Menu className="size-5" aria-hidden="true" />
    </button>
  );
}
