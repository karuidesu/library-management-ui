"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/hooks/useClientState";
import { useEscapeKey } from "@/hooks/useFocusTrap";

interface MenuContextValue {
  close: () => void;
}
const MenuContext = React.createContext<MenuContextValue>({ close: () => {} });

type Align = "start" | "end";

interface DropdownMenuProps {
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  align?: Align;
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function DropdownMenu({
  trigger,
  align = "end",
  label,
  className,
  children,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const mounted = useIsClient();
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  const close = React.useCallback(() => setOpen(false), []);
  useEscapeKey(open, close);

  const reposition = React.useCallback(() => {
    const el = triggerRef.current?.firstElementChild ?? triggerRef.current;
    const panel = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = panel?.offsetWidth ?? 224;
    const height = panel?.offsetHeight ?? 0;
    const gap = 8;
    const margin = 12;

    let left = align === "end" ? rect.right - width : rect.left;
    left = Math.min(
      Math.max(margin, left),
      window.innerWidth - width - margin,
    );

    const below = rect.bottom + gap;
    const top =
      height > 0 && below + height > window.innerHeight - margin
        ? Math.max(margin, rect.top - gap - height)
        : below;

    setCoords({ top, left });
  }, [align]);

  React.useLayoutEffect(() => {
    if (!open) return;
    reposition();
  }, [open, reposition]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, reposition]);

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <MenuContext.Provider value={{ close }}>
      <span ref={triggerRef} className="contents">
        {React.cloneElement(trigger, {
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            trigger.props.onClick?.(event);
            setOpen((value) => !value);
          },
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-controls": open ? menuId : undefined,
        } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      </span>

      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              id={menuId}
              role="menu"
              aria-label={label}
              onKeyDown={onPanelKeyDown}
              style={{ top: coords.top, left: coords.left }}
              className={cn(
                "fixed z-50 min-w-56 overflow-hidden rounded-xl border border-slate-100 dark:border-[#212B44]",
                "bg-white dark:bg-[#171E31] p-1.5 shadow-popover dark:shadow-[0_10px_25px_rgba(0,0,0,0.6)]",
                "animate-in fade-in zoom-in-95 duration-150",
                className,
              )}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </MenuContext.Provider>
  );
}

export function DropdownItem({
  icon: Icon,
  tone = "default",
  onSelect,
  className,
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> & {
  icon?: LucideIcon;
  tone?: "default" | "danger";
  onSelect?: () => void;
}) {
  const { close } = React.useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onSelect?.();
        close();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
        "outline-none transition-colors",
        tone === "danger"
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 focus-visible:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-[#E2E8F0] dark:hover:bg-[#2E3E5A] dark:hover:text-white focus-visible:bg-slate-50 dark:focus-visible:bg-[#2E3E5A]",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <Icon
          className={cn(
            "size-4 shrink-0",
            tone === "danger" ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-[#94A3B8]",
          )}
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
      {children}
    </p>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-slate-100 dark:bg-[#212B44]" />;
}
