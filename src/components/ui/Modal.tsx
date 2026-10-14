"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/hooks/useClientState";
import { Button } from "./Button";
import {
  useEscapeKey,
  useFocusTrap,
  useScrollLock,
} from "@/hooks/useFocusTrap";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  size?: "md" | "lg" | "xl";
  children: React.ReactNode;
}

const widths = {
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "lg",
  children,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mounted = useIsClient();
  const titleId = React.useId();
  const descriptionId = React.useId();

  useEscapeKey(open, onClose);
  useScrollLock(open);
  useFocusTrap(panelRef, open);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-white",
          "rounded-t-3xl shadow-overlay outline-none sm:rounded-2xl",
          "animate-in duration-200 slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0",
          widths[size],
        )}
      >
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
            >
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            className="-mr-1.5 shrink-0 rounded-full"
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {children}
        </div>

        {footer ? (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
