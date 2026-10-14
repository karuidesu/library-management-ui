import * as React from "react";
import { cn } from "@/lib/cn";

const palettes = [
  "bg-brand-50 text-brand-700 ring-brand-100",
  "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "bg-purple-50 text-purple-700 ring-purple-100",
  "bg-amber-50 text-amber-700 ring-amber-100",
  "bg-sky-50 text-sky-700 ring-sky-100",
  "bg-rose-50 text-rose-700 ring-rose-100",
  "bg-teal-50 text-teal-700 ring-teal-100",
  "bg-indigo-50 text-indigo-700 ring-indigo-100",
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

export function Avatar({
  name,
  initials,
  size = "md",
  className,
}: {
  name: string;
  initials?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full",
        "font-semibold uppercase ring-1 ring-inset",
        sizes[size],
        paletteFor(name),
        className,
      )}
    >
      {initials ?? initialsOf(name)}
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
        "rounded-md bg-gradient-to-br shadow-sm ring-1 ring-slate-900/5",
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
