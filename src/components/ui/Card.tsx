import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card",
        "dark:border-[#212B44] dark:bg-[#171E31] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
        interactive &&
          "transition-[box-shadow,border-color,background-color] duration-300 hover:shadow-card-hover dark:hover:border-[#2D3B55] dark:hover:bg-[#1A2338]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8 sm:py-6 dark:border-[#212B44]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  as: Comp = "h2",
  ...props
}: React.ComponentPropsWithoutRef<"h2"> & { as?: "h2" | "h3" }) {
  return (
    <Comp
      className={cn(
        "text-base font-semibold tracking-tight text-slate-900 dark:text-[#F3F4F6] sm:text-lg",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("mt-1 text-sm text-slate-500 dark:text-[#94A3B8]", className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-6 sm:p-8", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8",
        "dark:border-[#212B44] dark:bg-[#131929]",
        className,
      )}
      {...props}
    />
  );
}
