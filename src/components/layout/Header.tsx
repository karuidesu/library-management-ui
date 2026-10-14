"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LogOut, Search, Settings, User, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME, navItemFor } from "@/lib/nav";
import { currentUser, notifications } from "@/lib/data";
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
            className="-my-1.5 rounded px-0.5 py-1.5 font-medium text-slate-500 outline-none transition-colors hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-brand-600/20"
          >
            {APP_NAME}
          </Link>
        </li>
        {current ? (
          <>
            <li aria-hidden="true" className="hidden shrink-0 sm:block">
              <ChevronRight className="size-4 text-slate-300" />
            </li>
            <li className="min-w-0">
              <span
                aria-current="page"
                className="block truncate font-semibold text-slate-900"
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
  "h-10 w-full rounded-full border border-transparent bg-slate-100 pl-10 pr-4 text-sm " +
  "text-slate-900 outline-none transition-colors placeholder:text-slate-500 " +
  "hover:bg-slate-200/70 focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10";

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
        className="grid size-11 place-items-center rounded-xl text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-brand-600/20 md:hidden"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-0 z-20 flex min-h-[var(--spacing-header)] items-center gap-2 bg-white px-4 animate-in fade-in slide-in-from-top-2 duration-200 md:hidden">
          <div className="relative flex min-w-0 flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3.5 size-[1.125rem] text-slate-400"
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
            className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-brand-600/20"
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
          className="relative grid size-11 place-items-center rounded-xl text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-brand-600/20"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unread > 0 ? (
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white"
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
                  item.read ? "bg-slate-300" : "bg-brand-600",
                )}
              />
              <span className="truncate font-semibold text-slate-900">
                {item.title}
              </span>
            </span>
            <span className="line-clamp-2 whitespace-normal text-xs font-normal text-slate-500">
              {item.body}
            </span>
            <span className="text-xs font-normal text-slate-400">
              {item.time}
            </span>
          </span>
        </DropdownItem>
      ))}
      <DropdownSeparator />
      <DropdownItem className="justify-center text-brand-600 hover:text-brand-700">
        Voir toutes les notifications
      </DropdownItem>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu
      label="Compte"
      align="end"
      trigger={
        <button
          type="button"
          aria-label="Ouvrir le menu du compte"
          className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-1 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-brand-600/20 sm:pr-2.5"
        >
          <Avatar
            name={currentUser.name}
            initials={currentUser.avatar}
            size="lg"
          />
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block truncate text-sm font-semibold leading-tight text-slate-900">
              {currentUser.name}
            </span>
            <span className="block truncate text-xs text-slate-500">
              {currentUser.role}
            </span>
          </span>
        </button>
      }
    >
      <DropdownLabel>{currentUser.email}</DropdownLabel>
      <DropdownItem icon={User}>Votre profil</DropdownItem>
      <DropdownItem icon={Settings}>Préférences</DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={LogOut} tone="danger">
        Se déconnecter
      </DropdownItem>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-h-[var(--spacing-header)] items-center gap-3",
        "border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md sm:gap-4 sm:px-6 lg:px-8",
      )}
    >
      <SidebarTrigger />

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="relative hidden min-w-0 max-w-sm flex-1 items-center md:flex">
        <Search
          className="pointer-events-none absolute left-3.5 size-[1.125rem] text-slate-400"
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
        <div
          aria-hidden="true"
          className="mx-1 hidden h-8 w-px bg-slate-200 sm:block"
        />
        <ProfileMenu />
      </div>
    </header>
  );
}
