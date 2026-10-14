"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

function pageItems(current: number, total: number, siblings = 1) {
  const slots = siblings * 2 + 5;
  if (total <= slots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftGap = left > 2;
  const showRightGap = right < total - 1;

  const items: (number | "gap-start" | "gap-end")[] = [1];
  if (showLeftGap) items.push("gap-start");
  for (let page = Math.max(2, left); page <= Math.min(total - 1, right); page += 1) {
    items.push(page);
  }
  if (showRightGap) items.push("gap-end");
  items.push(total);
  return items;
}

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  summary?: React.ReactNode;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
  className,
}: PaginationProps) {
  const items = pageItems(page, pageCount);
  const go = (next: number) =>
    onPageChange(Math.min(Math.max(next, 1), pageCount));

  const numberClass = (active: boolean) =>
    cn(
      "grid size-10 place-items-center rounded-lg text-sm font-semibold transition-colors",
      "outline-none focus-visible:ring-4 focus-visible:ring-brand-600/20",
      active
        ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    );

  const arrowClass =
    "grid size-10 place-items-center rounded-lg border border-slate-200 bg-white " +
    "text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 " +
    "disabled:pointer-events-none disabled:opacity-40 outline-none " +
    "focus-visible:ring-4 focus-visible:ring-brand-600/20";

  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between",
        className,
      )}
    >
      {summary ? (
        <p className="text-sm text-slate-500">{summary}</p>
      ) : (
        <span />
      )}

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
          className={arrowClass}
        >
          <ChevronLeft className="size-[1.125rem]" aria-hidden="true" />
        </button>

        <ul className="hidden items-center gap-1.5 sm:flex">
          {items.map((item) =>
            typeof item === "number" ? (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => go(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  className={numberClass(item === page)}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li
                key={item}
                aria-hidden="true"
                className="grid size-10 place-items-center text-slate-400"
              >
                &hellip;
              </li>
            ),
          )}
        </ul>

        <span className="text-sm font-medium text-slate-600 sm:hidden">
          {page} / {pageCount}
        </span>

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= pageCount}
          aria-label="Page suivante"
          className={arrowClass}
        >
          <ChevronRight className="size-[1.125rem]" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
