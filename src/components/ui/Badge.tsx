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
  neutral: "bg-slate-100 text-slate-700 ring-slate-200/60",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  danger: "bg-rose-50 text-rose-700 ring-rose-100",
  info: "bg-sky-50 text-sky-700 ring-sky-100",
  purple: "bg-purple-50 text-purple-700 ring-purple-100",
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
