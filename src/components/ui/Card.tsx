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
        interactive &&
          "transition-shadow duration-300 hover:shadow-card-hover",
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
        "flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8 sm:py-6",
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
        "text-base font-semibold tracking-tight text-slate-900 sm:text-lg",
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
    <p className={cn("mt-1 text-sm text-slate-500", className)} {...props} />
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
        className,
      )}
      {...props}
    />
  );
}
