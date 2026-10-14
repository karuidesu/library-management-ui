import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

const tones: Record<BadgeTone, string> = {
  neutral:
    "bg-slate-100 text-slate-700 ring-slate-200/60 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700/60",
  brand:
    "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-blue-950/45 dark:text-blue-400 dark:ring-blue-800/40",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/45 dark:text-emerald-400 dark:ring-emerald-800/40",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/45 dark:text-amber-400 dark:ring-amber-800/40",
  danger:
    "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/45 dark:text-rose-400 dark:ring-rose-800/40",
  info:
    "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/45 dark:text-sky-400 dark:ring-sky-800/40",
  purple:
    "bg-purple-50 text-purple-700 ring-purple-100 dark:bg-purple-950/45 dark:text-purple-400 dark:ring-purple-800/40",
};

export function Badge({
  tone = "neutral",
  className,
  dot = false,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          className="size-1.5 shrink-0 rounded-full bg-current opacity-70"
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

export const bookStatusTone: Record<string, BadgeTone> = {
  Disponible: "success",
  Emprunté: "brand",
  Endommagé: "warning",
  Perdu: "danger",
  Available: "success",
  Borrowed: "brand",
  Damaged: "warning",
  Lost: "danger",
};

export const loanStatusTone: Record<string, BadgeTone> = {
  Actif: "brand",
  "En cours": "brand",
  Retourné: "success",
  "En retard": "danger",
  Active: "brand",
  Returned: "success",
  Overdue: "danger",
};

export const roleTone: Record<string, BadgeTone> = {
  Admin: "purple",
  Administrateur: "purple",
  Bibliothécaire: "info",
  Librarian: "info",
  Membre: "neutral",
  Member: "neutral",
};

export const activityTone: Record<string, BadgeTone> = {
  "En cours": "brand",
  Actif: "brand",
  Retourné: "success",
  "En retard": "danger",
  "Nouveau membre": "purple",
  Active: "brand",
  Returned: "success",
  Overdue: "danger",
  "New Member": "purple",
};
