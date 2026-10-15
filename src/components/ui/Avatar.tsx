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
      <circle cx="11" cy="7.5" r="3.75" />
      <path d="M14.2 5.8C16.4 4.8 19 6 19.5 8.2c.5 2-.5 4-2.5 4.8" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
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

import { getCoverByCategory } from "@/lib/covers";

export function Avatar({
  name,
  initials,
  gender,
  size = "md",
  status,
  className,
}: {
  name: string;
  initials?: string;
  gender?: "F" | "M" | "Femme" | "Homme" | "Féminin" | "Masculin";
  size?: keyof typeof sizes;
  status?: "online" | "offline";
  className?: string;
}) {
  const isFemale =
    gender === "F" || gender === "Femme" || gender === "Féminin";

  const resolvedInitials = initials ?? initialsOf(name);

  return (
    <span className="relative inline-flex shrink-0">
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
        ) : (
          resolvedInitials
        )}
      </span>

      {status === "online" ? (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B0F19]"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </span>
      ) : null}
    </span>
  );
}

export function BookCover({
  title,
  category,
  gradient,
  emoji,
  className,
}: {
  title: string;
  category?: string;
  gradient?: string;
  emoji?: string;
  className?: string;
}) {
  const catStyle = getCoverByCategory(category);
  const activeGradient = gradient || catStyle.gradient;
  const activeEmoji = emoji || catStyle.emoji;
  const glow = catStyle.glow;

  return (
    <span
      role="img"
      aria-label={`Couverture de ${title}${category ? ` (${category})` : ""}`}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-md bg-gradient-to-br shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10 select-none",
        "h-14 w-10 text-base transition-transform duration-200 hover:scale-105",
        activeGradient,
        glow,
        className,
      )}
    >
      {/* Book spine highlight effect */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] bg-white/25 shadow-[1px_0_2px_rgba(0,0,0,0.3)]"
      />
      {/* Subtle diagonal sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-full top-0 block -rotate-45 bg-gradient-to-b from-white/10 to-transparent"
      />
      {/* Thematic Category Emoji Artwork */}
      <span aria-hidden="true" className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        {activeEmoji}
      </span>
    </span>
  );
}
