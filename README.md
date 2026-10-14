# Agbale — Library Management System

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Production build. Works offline; no fonts are fetched at build time. |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run fonts:sync` | Re-copies the Inter subsets from `@fontsource-variable/inter` into `public/fonts`. Run after bumping that package. |

## Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout & global AppShell wrapper
│   ├── page.tsx                # Redirects to /login
│   ├── globals.css             # Design tokens (@theme), base layer, utilities
│   ├── login/                  # Sign-in view (rendered clean without sidebar/header)
│   ├── dashboard/              # Main overview & recent activity feed
│   ├── catalog/                # Book catalog management with category emojis
│   ├── members/                # Member directory with direct row actions
│   ├── borrow/                 # Borrowing & return circulation workflows
│   ├── analytics/              # Real-time KPIs & stacked annual trend charts
│   └── settings/               # Theme cards (Light/Dark) & circulation rules
├── components/
│   ├── layout/                 # AppShell, Sidebar (w-80), Header (static user, theme toggle)
│   ├── ui/                     # Button, Card, Badge, Field, Modal, Combobox, etc.
│   └── views/                  # One component per route
├── hooks/                      # useTheme, focus trap, scroll lock, escape key, client state
└── lib/
    ├── data.ts                 # Single source of mock data for every view
    ├── nav.ts                  # Centralized route definitions (mainNavItems, settingsNavItem)
    └── cn.ts                   # Tailwind-aware class merge
```


## Conventions worth knowing

**Routes live in `lib/nav.ts`.** The sidebar, the breadcrumbs and the page
titles all read from that array. Adding a section means editing one file.

**Data lives in `lib/data.ts`.** No view carries its own inline mock array, and
the headline figures are reconciled: `bookStatusData` sums to
`libraryStats.totalBooks`, and its "Borrowed" slice equals the Books Borrowed
KPI. Replacing the exports in that file is how you swap in a real API.

**Loan dates are relative to `REFERENCE_DATE`, not `new Date()`.** That keeps
the Borrow view showing a realistic mix of overdue, due-today and upcoming
loans, and keeps the server render and the client hydration identical.

**The document scrolls, not a nested element.** The shell is a sticky sidebar
and sticky header over normal document flow. Do not add `h-screen` plus
`overflow-y-auto` inside a view; that is what produced double scrollbars
before.

**`min-w-0` on flex children that contain text.** Without it a flex child will
not shrink below its content width, which is the usual cause of text running
out of bounds and a horizontally scrolling page.

**Wide tables go in `<TableScroll>`.** It is `position: relative` on purpose:
Tailwind's `sr-only` is absolutely positioned, and without a positioned
containing block an `sr-only` label inside a wide table escapes the scroll
container and gives the whole page a horizontal scrollbar.

**Tables below `md` render as card lists**, not as a sideways scroll. Each view
with a table ships both.

**Theming.** Brand colour is the `--color-brand-*` ramp in `globals.css`;
change it there rather than touching `blue-600` across components. Elevation
is `shadow-card`, `shadow-card-hover`, `shadow-popover` and `shadow-overlay`.

## Accessibility

Dialogs and the mobile drawer trap focus, close on Escape, lock body scroll and
return focus to their trigger. The combobox follows the ARIA combobox pattern.
Icon-only controls carry labels, tap targets clear 24px, and charts ship a
legend plus a visually hidden data table.

## Contribution

1. Fork the repository
2. Create a branch for your modifications 
3. Commit your changes
4. Open a Pull Request

## MIT License

### *_ARIGATO_*