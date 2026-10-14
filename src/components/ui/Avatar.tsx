import * as React from "react";
import { cn } from "@/lib/cn";

const palettes = [
  "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/40",
  "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/40",
  "bg-purple-50 text-purple-700 ring-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:ring-purple-800/40",
  "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800/40",
  "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/40",
  "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/40",
  "bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-800/40",
  "bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800/40",
] as const;

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return palettes[Math.abs(hash) % palettes.length];
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizes = {
  xs: "size-7 text-[0.625rem]",
  sm: "size-9 text-xs",
  md: "size-10 text-xs",
  lg: "size-11 text-sm",
  xl: "size-12 text-sm",
} as const;

const iconSizes = {
  xs: "size-3.5",
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-[1.375rem]",
  xl: "size-6",
} as const;

export function FemaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 11.5c1.4 0 2.5-1.2 2.5-3.5a7.5 7.5 0 0 0-15 0c0 2.3 1.1 3.5 2.5 3.5" />
      <circle cx="12" cy="9.5" r="3.25" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

export function MaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

export function Avatar({
  name,
  initials,
  gender,
  size = "md",
  className,
}: {
  name: string;
  initials?: string;
  gender?: "F" | "M" | "Femme" | "Homme" | "Féminin" | "Masculin";
  size?: keyof typeof sizes;
  className?: string;
}) {
  const isFemale =
    gender === "F" || gender === "Femme" || gender === "Féminin";

  return (
    <span
      role="img"
      aria-label={gender ? `${name} (${isFemale ? "Femme" : "Homme"})` : name}
      title={name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full",
        "font-semibold uppercase ring-1 ring-inset",
        sizes[size],
        paletteFor(name),
        className,
      )}
    >
      {gender !== undefined ? (
        isFemale ? (
          <FemaleIcon className={iconSizes[size]} />
        ) : (
          <MaleIcon className={iconSizes[size]} />
        )
      ) : initials ? (
        initials
      ) : (
        <MaleIcon className={iconSizes[size]} />
      )}
    </span>
  );
}

export function BookCover({
  title,
  gradient,
  emoji,
  className,
}: {
  title: string;
  gradient: string;
  emoji: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Couverture de ${title}`}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-md bg-gradient-to-br shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
        "h-14 w-10 text-base",
        gradient,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] bg-white/20"
      />
      <span aria-hidden="true">{emoji}</span>
    </span>
  );
}
