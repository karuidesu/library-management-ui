"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { activityTone, Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  PageContainer,
  PageHeader,
  TableScroll,
  Td,
  Th,
} from "@/components/ui/Page";
import { SystemReportModal } from "@/components/reports/SystemReportModal";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { dashboardActivities, initialMembers, kpis } from "@/lib/data";

const kpiVisuals: Record<string, { icon: LucideIcon; className: string }> = {
  "total-books": {
    icon: BookOpen,
    className: "bg-brand-50 text-brand-600 dark:bg-blue-950/60 dark:text-blue-400",
  },
  "active-members": {
    icon: Users,
    className: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  },
  "books-borrowed": {
    icon: Clock,
    className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  "overdue-returns": {
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
  },
};

const kpiSubtitles: Record<string, string> = {
  "total-books": "Dans le catalogue de la bibliothèque",
  "active-members": "Adhérents inscrits au service",
  "books-borrowed": "Actuellement en circulation",
  "overdue-returns": "Prêts en dépassement d'échéance",
};

function KpiCard({
  id,
  label,
  value,
}: (typeof kpis)[number]) {
  const visual = kpiVisuals[id];
  const Icon = visual.icon;

  return (
    <Card interactive className="p-6">
      <div className="flex items-center justify-between">
        <span
          className={cn("grid size-12 shrink-0 place-items-center rounded-xl", visual.className)}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-5 text-sm font-medium text-slate-500 dark:text-[#94A3B8]">{label}</h3>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-[#F3F4F6] tabular-nums">
        {value.toLocaleString("fr-FR")}
      </p>
      <p className="mt-2 text-xs text-slate-400 dark:text-[#64748B]">
        {kpiSubtitles[id] || "Données enregistrées"}
      </p>
    </Card>
  );
}

export function DashboardView() {
  const { establishmentName } = useLibrarySettings();
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Aperçu"
        description={`Voici les statistiques sur les 30 derniers jours de la bibliothèque ${establishmentName}.`}
        actions={
          <Button variant="secondary" onClick={() => setIsReportOpen(true)}>
            <FileText className="size-4" aria-hidden="true" />
            Générer le rapport système
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>Activités récentes</CardTitle>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
              Les derniers emprunts, retours et inscriptions.
            </p>
          </div>
          <Link
            href="/borrow"
            className="-my-1.5 flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm font-semibold text-brand-600 dark:text-blue-400 outline-none transition-colors hover:text-brand-700 dark:hover:text-blue-300 focus-visible:ring-4 focus-visible:ring-brand-600/20"
          >
            Tout voir
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardHeader>

        <TableScroll className="hidden md:block">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead className="bg-slate-50/60 dark:bg-[#131929]/80">
              <tr>
                <Th className="px-6 lg:px-8">Membre</Th>
                <Th>Action</Th>
                <Th>Livre</Th>
                <Th>Date</Th>
                <Th className="px-6 text-right lg:px-8">Statut</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#212B44]">
              {dashboardActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-[#1F2A40]/50"
                >
                  <Td className="px-6 lg:px-8">
                    <div className="flex items-center gap-3.5">
                      <Avatar
                        name={activity.member}
                        gender={
                          initialMembers.find((m) => m.name === activity.member)
                            ?.gender ??
                          ([
                            "Marie Curie",
                            "Emily Chen",
                            "Lisa Park",
                            "Kathryn Murphy",
                            "Sarah Connor",
                          ].includes(activity.member)
                            ? "F"
                            : "M")
                        }
                        size="md"
                      />
                      <span className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                        {activity.member}
                      </span>
                    </div>
                  </Td>
                  <Td className="text-slate-600 dark:text-[#94A3B8]">{activity.action}</Td>
                  <Td className="max-w-[16rem]">
                    <span className="block truncate font-medium text-slate-900 dark:text-[#F3F4F6]">
                      {activity.bookTitle}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-sm text-slate-500 dark:text-[#94A3B8]">
                    {activity.time}
                  </Td>
                  <Td className="px-6 text-right lg:px-8">
                    <Badge tone={activityTone[activity.status]} dot>
                      {activity.status}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>

        <ul className="divide-y divide-slate-100 dark:divide-[#212B44] md:hidden">
          {dashboardActivities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3.5 p-5">
              <Avatar
                name={activity.member}
                gender={
                  initialMembers.find((m) => m.name === activity.member)
                    ?.gender ??
                  ([
                    "Marie Curie",
                    "Emily Chen",
                    "Lisa Park",
                    "Kathryn Murphy",
                    "Sarah Connor",
                  ].includes(activity.member)
                    ? "F"
                    : "M")
                }
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                    {activity.member}
                  </p>
                  <Badge
                    tone={activityTone[activity.status]}
                    className="shrink-0"
                    dot
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-[#94A3B8]">
                  {activity.action} &middot; {activity.bookTitle}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-[#64748B]">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <SystemReportModal
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </PageContainer>
  );
}
