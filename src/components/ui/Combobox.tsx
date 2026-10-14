"use client";

import * as React from "react";
import { Check, ChevronDown, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  id: string;
  label: string;
  meta?: string;
  keywords?: string;
  disabled?: boolean;
  adornment?: React.ReactNode;
}

interface ComboboxProps {
  id: string;
  options: ComboboxOption[];
  value: ComboboxOption | null;
  onChange: (option: ComboboxOption | null) => void;
  placeholder?: string;
  leadingIcon?: LucideIcon;
  emptyMessage?: string;
  disabledHint?: string;
}

export function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  leadingIcon: Icon,
  emptyMessage = "Aucun résultat trouvé",
  disabledHint,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listId = `${id}-listbox`;

  const results = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return options;
    return options.filter((option) =>
      `${option.label} ${option.meta ?? ""} ${option.keywords ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [options, query]);

  const safeIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    onChange(option);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (results.length === 0) return;
      setActiveIndex(
        event.key === "ArrowDown"
          ? (safeIndex + 1) % results.length
          : (safeIndex - 1 + results.length) % results.length,
      );
      return;
    }
    if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
      return;
    }
    if (event.key === "Enter" && open) {
      const option = results[safeIndex];
      if (option) {
        event.preventDefault();
        select(option);
      }
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const activeOption = results[safeIndex];

  return (
    <div ref={rootRef} className="relative">
      <div className="relative flex items-center">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 size-[1.125rem] text-slate-400"
            aria-hidden="true"
          />
        ) : null}

        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            open && activeOption ? `${id}-option-${activeOption.id}` : undefined
          }
          autoComplete="off"
          value={open ? query : (value?.label ?? "")}
          placeholder={value ? undefined : placeholder}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white text-sm text-slate-900",
            "transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400",
            "outline-none hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10",
            Icon ? "pl-11" : "pl-4",
            "pr-20",
          )}
        />

        <div className="absolute right-2 flex items-center gap-0.5">
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setQuery("");
              }}
              aria-label="Effacer la sélection"
              className="grid size-9 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-4 focus-visible:ring-brand-600/20"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setOpen((state) => !state)}
            aria-label={open ? "Fermer les suggestions" : "Afficher les suggestions"}
            className="grid size-9 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-popover animate-in fade-in zoom-in-95 duration-150"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-slate-500">
              {emptyMessage}
            </li>
          ) : (
            results.map((option, index) => {
              const selected = value?.id === option.id;
              return (
                <li key={option.id} role="none">
                  <div
                    id={`${id}-option-${option.id}`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => select(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                      option.disabled && "cursor-not-allowed opacity-55",
                      index === safeIndex && !option.disabled && "bg-slate-50",
                    )}
                  >
                    {option.adornment}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900">
                        {option.label}
                      </span>
                      {option.meta ? (
                        <span className="block truncate text-xs text-slate-500">
                          {option.meta}
                        </span>
                      ) : null}
                      {option.disabled && disabledHint ? (
                        <span className="block truncate text-xs font-medium text-rose-600">
                          {disabledHint}
                        </span>
                      ) : null}
                    </span>
                    {selected ? (
                      <Check
                        className="size-4 shrink-0 text-brand-600"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
