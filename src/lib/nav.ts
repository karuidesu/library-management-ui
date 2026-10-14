import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Repeat,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Agbale";

export interface NavItem {
  href: string;
  label: string;
  title: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    title: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/catalog",
    label: "Livres",
    title: "Catalogue de livres",
    icon: BookOpen,
  },
  {
    href: "/members",
    label: "Membres",
    title: "Répertoire des membres",
    icon: Users,
  },
  {
    href: "/borrow",
    label: "Prêts & Retours",
    title: "Prêts & Retours",
    icon: Repeat,
  },
  {
    href: "/analytics",
    label: "Statistiques",
    title: "Analyses & Statistiques",
    icon: BarChart3,
  },
];

export const settingsNavItem: NavItem = {
  href: "/settings",
  label: "Paramètres",
  title: "Paramètres",
  icon: Settings,
};

export const navItems: NavItem[] = [...mainNavItems, settingsNavItem];

export function navItemFor(pathname: string): NavItem | undefined {
  return navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

