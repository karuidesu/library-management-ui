"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Moon, Search, Sun, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME, navItemFor } from "@/lib/nav";
import { currentUser, notifications } from "@/lib/data";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/DropdownMenu";
import { SidebarTrigger } from "./Sidebar";

function Breadcrumbs() {
  const pathname = usePathname();
  const current = navItemFor(pathname);

  return (
    <nav aria-label="Fil d'Ariane" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        <li className="hidden shrink-0 sm:block">
          <Link
            href="/dashboard"
            className="-my-1.5 rounded px-0.5 py-1.5 font-medium text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:text-slate-900 dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
          >
            {APP_NAME}
          </Link>
        </li>
        {current ? (
          <>
            <li aria-hidden="true" className="hidden shrink-0 sm:block">
              <ChevronRight className="size-4 text-slate-300 dark:text-[#2D3B55]" />
            </li>
            <li className="min-w-0">
              <span
                aria-current="page"
                className="block truncate font-semibold text-slate-900 dark:text-[#F3F4F6]"
              >
                {current.title}
              </span>
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

const searchFieldClass =
  "h-10 w-full rounded-full border border-transparent dark:border-[#1F2A3C] bg-slate-100 dark:bg-[#111827] pl-10 pr-4 text-sm " +
  "text-slate-900 dark:text-[#F3F4F6] outline-none transition-colors placeholder:text-slate-500 dark:placeholder:text-[#64748B] " +
  "hover:bg-slate-200/70 dark:hover:bg-[#171E31] focus:border-brand-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#111827] focus:ring-4 focus:ring-brand-600/10 dark:focus:ring-blue-500/20";

function MobileSearch() {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        aria-expanded={open}
        className="grid size-11 place-items-center rounded-xl text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20 md:hidden"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-0 z-20 flex min-h-[var(--spacing-header)] items-center gap-2 bg-white dark:bg-[#0B0F19] px-4 animate-in fade-in slide-in-from-top-2 duration-200 md:hidden">
          <div className="relative flex min-w-0 flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3.5 size-[1.125rem] text-slate-400 dark:text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              placeholder="Rechercher des livres, des membres, des emprunts..."
              aria-label="Rechercher des livres, des membres et des emprunts"
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
              }}
              className={searchFieldClass}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer la recherche"
            className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </>
  );
}

function NotificationsMenu() {
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <DropdownMenu
      label="Notifications"
      align="end"
      className="w-[min(22rem,calc(100vw-1.5rem))]"
      trigger={
        <button
          type="button"
          aria-label={
            unread > 0
              ? `Notifications, ${unread} non lue(s)`
              : "Notifications, aucune non lue"
          }
          className="relative grid size-11 place-items-center rounded-xl text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unread > 0 ? (
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0B0F19]"
            />
          ) : null}
        </button>
      }
    >
      <DropdownLabel>Notifications</DropdownLabel>
      {notifications.map((item) => (
        <DropdownItem key={item.id} className="items-start gap-3 py-2.5">
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  item.read ? "bg-slate-300 dark:bg-slate-600" : "bg-brand-600 dark:bg-blue-400",
                )}
              />
              <span className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                {item.title}
              </span>
            </span>
            <span className="line-clamp-2 whitespace-normal text-xs font-normal text-slate-500 dark:text-[#94A3B8]">
              {item.body}
            </span>
            <span className="text-xs font-normal text-slate-400 dark:text-[#64748B]">
              {item.time}
            </span>
          </span>
        </DropdownItem>
      ))}
      <DropdownSeparator />
      <DropdownItem className="justify-center text-brand-600 dark:text-blue-400 hover:text-brand-700 dark:hover:text-blue-300">
        Voir toutes les notifications
      </DropdownItem>
    </DropdownMenu>
  );
}

function ThemeToggleShortcut() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="grid size-11 place-items-center rounded-xl text-slate-500 dark:text-[#94A3B8] outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
    >
      {isDark ? (
        <Sun className="size-5 text-amber-400 transition-transform duration-300 hover:rotate-45" aria-hidden="true" />
      ) : (
        <Moon className="size-5 text-slate-600 dark:text-slate-300 transition-transform duration-300 hover:-rotate-12" aria-hidden="true" />
      )}
    </button>
  );
}

function StaticUserProfile() {
  return (
    <div
      aria-label={`Session active : ${currentUser.name}, ${currentUser.role}`}
      className="flex select-none items-center gap-3 py-1 pl-1 pr-1 sm:pr-2.5"
    >
      <Avatar
        name={currentUser.name}
        gender={currentUser.gender}
        size="lg"
      />
      <div className="hidden min-w-0 text-left sm:block">
        <span className="block truncate text-sm font-semibold leading-tight text-slate-900 dark:text-[#F3F4F6]">
          {currentUser.name}
        </span>
        <span className="block truncate text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
          {currentUser.role}
        </span>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-h-[var(--spacing-header)] items-center gap-3",
        "border-b border-slate-200/70 dark:border-[#212B44] bg-white/85 dark:bg-[#0B0F19]/90 px-4 backdrop-blur-md sm:gap-4 sm:px-6 lg:px-8",
      )}
    >
      <SidebarTrigger />

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="relative hidden min-w-0 max-w-sm flex-1 items-center md:flex">
        <Search
          className="pointer-events-none absolute left-3.5 size-[1.125rem] text-slate-400 dark:text-[#94A3B8]"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Rechercher des livres, des membres, des emprunts..."
          aria-label="Rechercher des livres, des membres et des emprunts"
          className={searchFieldClass}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <MobileSearch />
        <NotificationsMenu />
        <ThemeToggleShortcut />
        <div
          aria-hidden="true"
          className="mx-1 hidden h-8 w-px bg-slate-200 dark:bg-[#212B44] sm:block"
        />
        <StaticUserProfile />
      </div>
    </header>
  );
}

