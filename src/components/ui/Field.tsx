"use client";

import * as React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  action,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full min-w-0 rounded-xl border bg-white text-sm text-slate-900 " +
  "transition-[border-color,box-shadow,background-color] duration-150 " +
  "placeholder:text-slate-400 outline-none " +
  "focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const controlBorder = "border-slate-200 hover:border-slate-300";
const controlError =
  "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leadingIcon?: LucideIcon;
  trailing?: React.ReactNode;
  invalid?: boolean;
  inputSize?: "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      leadingIcon: Icon,
      trailing,
      invalid = false,
      inputSize = "md",
      ...props
    },
    ref,
  ) {
    const height = inputSize === "lg" ? "h-12" : "h-11";
    return (
      <div className="relative flex items-center">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 size-[1.125rem] text-slate-400"
            aria-hidden="true"
          />
        ) : null}
        <input
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            controlBase,
            height,
            invalid ? controlError : controlBorder,
            Icon ? "pl-11" : "pl-4",
            trailing ? "pr-11" : "pr-4",
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute right-1.5 flex items-center">{trailing}</div>
        ) : null}
      </div>
    );
  },
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  leadingIcon?: LucideIcon;
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className, leadingIcon: Icon, invalid = false, children, ...props },
    ref,
  ) {
    return (
      <div className="relative flex items-center">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 size-[1.125rem] text-slate-400"
            aria-hidden="true"
          />
        ) : null}
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            controlBase,
            "h-11 appearance-none pr-10",
            invalid ? controlError : controlBorder,
            Icon ? "pl-11" : "pl-4",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 size-4 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  },
);

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-[1.125rem] cursor-pointer rounded-[0.3rem] border-slate-300 text-brand-600",
        "accent-brand-600 transition-shadow",
        "focus-visible:ring-4 focus-visible:ring-brand-600/20",
        className,
      )}
      {...props}
    />
  );
});
