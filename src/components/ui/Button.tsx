import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold " +
  "whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-150 outline-none focus-visible:ring-4 disabled:pointer-events-none " +
  "disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 active:bg-brand-800 " +
    "dark:bg-blue-600 dark:hover:bg-blue-500 dark:active:bg-blue-700 dark:shadow-blue-900/40 focus-visible:ring-brand-600/20",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 " +
    "dark:border-[#2D3B55] dark:bg-[#171E31] dark:text-[#F3F4F6] dark:hover:bg-[#2E3E5A] dark:hover:text-white " +
    "focus-visible:ring-slate-900/10 dark:focus-visible:ring-slate-100/10",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 " +
    "dark:text-[#94A3B8] dark:hover:bg-[#2E3E5A]/60 dark:hover:text-[#F3F4F6] " +
    "focus-visible:ring-slate-900/10",
  subtle:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 " +
    "dark:bg-[#1F2A40] dark:text-[#F3F4F6] dark:hover:bg-[#2E3E5A] " +
    "focus-visible:ring-slate-900/10",
  danger:
    "bg-rose-600 text-white shadow-sm shadow-rose-600/25 hover:bg-rose-700 " +
    "dark:bg-rose-600 dark:hover:bg-rose-500 " +
    "focus-visible:ring-rose-600/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
  icon: "size-11",
  "icon-sm": "size-9",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
