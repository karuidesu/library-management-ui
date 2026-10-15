# Agbale - Library Management System

## Installation

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Production build. Works offline |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run fonts:sync` | Re-copies the Inter subsets from `@fontsource-variable/inter` into `public/fonts`. Run after bumping that package. |

## Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, global AppShell
│   ├── page.tsx                # Redirects to login
│   ├── globals.css             # Design tokens, utilities
│   ├── login/
│   ├── dashboard/              # Main overview, activity feed
│   ├── catalog/                # Book catalog management with category emojis
│   ├── members/                # Member directory with actions
│   ├── borrow/                 # Borrowing, return workflows
│   ├── analytics/
│   └── settings/
├── components/
│   ├── layout/                 # AppShell, Sidebar, Header
│   ├── ui/                     # Button, Card, Badge, Field,etc.
│   └── views/                  # One component per route
├── hooks/                      # useTheme, scroll lock, client state, etc.
└── lib/
    ├── data.ts                 # Mock data for every view
    ├── nav.ts                  # Centralized route
    └── cn.ts                   # Tailwind-aware class merge
```


## Conventions worth knowing

**Routes live in `lib/nav.ts`.** The sidebar, the breadcrumbs and the page
titles all read from that array. Adding a section means editing one file.

**Data lives in `lib/data.ts`.** No view carries its own inline mock array, and
the headline figures are reconciled: `bookStatusData` sums to
`libraryStats.totalBooks`.

**Loan dates are relative to `REFERENCE_DATE`, not `new Date()`.** That keeps
the Borrow view showing a realistic mix of overdue, due-today and upcoming
loans, and keeps the server render and the client hydration identical.


**`min-w-0` on flex children that contain text.** Without it a flex child will
not shrink below its content width, which is the usual cause of text running
out of bounds and a horizontally scrolling page.

**Tables below `md` render as card lists**, not as a sideways scroll. Each view
with a table ships both.

**Theming.** Brand colour is the `--color-brand-*` ramp in `globals.css`;
change it there rather than touching `blue-600` across components. Elevation
is `shadow-card`, `shadow-card-hover`, `shadow-popover` and `shadow-overlay`.


## Contribution

1. Fork the repository
2. Create a branch for your modifications 
3. Commit your changes
4. Open a Pull Request

## MIT License
Built for NGOs for educational purposes ღ

### *_ARIGATO_*