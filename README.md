# Agbale - Library Management System

## Installation

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`.

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

## Contribution

1. Fork the repository
2. Create a branch for your modifications 
3. Commit your changes
4. Open a Pull Request

## MIT License
Built for NGOs for educational purposes ღ

### *_ARIGATO_*