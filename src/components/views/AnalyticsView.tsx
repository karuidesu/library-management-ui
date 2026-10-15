"use client";

import * as React from "react";
import { DownloadCloud } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { PageContainer, PageHeader } from "@/components/ui/Page";
import { SystemReportModal } from "@/components/reports/SystemReportModal";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import {
  bookStatusData,
  borrowingTrendsData,
  categoryData,
} from "@/lib/data";

interface TooltipPayloadItem {
  value?: number | string;
  name?: string | number;
  payload?: { name?: string; color?: string };
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadItem[];
}

function TooltipShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2D3B55] bg-white dark:bg-[#171E31] px-3.5 py-2.5 shadow-popover dark:shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
      {children}
    </div>
  );
}

function TrendTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  return (
    <TooltipShell>
      <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">{label}</p>
      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-blue-500"
        />
        {value.toLocaleString("fr-FR")} emprunts
      </p>
    </TooltipShell>
  );
}

function StatusTooltip({ payload, active }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const slice = payload[0];
  const total = bookStatusData.reduce((sum, item) => sum + item.value, 0);
  const value = Number(slice?.value ?? 0);
  return (
    <TooltipShell>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: slice?.payload?.color }}
        />
        {slice?.payload?.name}
      </p>
      <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
        {value.toLocaleString("fr-FR")} exemplaires &middot;{" "}
        {((value / total) * 100).toFixed(1)}%
      </p>
    </TooltipShell>
  );
}

function BorrowingTrends({ months }: { months: number }) {
  const data = React.useMemo(
    () => borrowingTrendsData.slice(-months),
    [months],
  );
  const total = data.reduce((sum, row) => sum + row.loans, 0);

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>Tendances des emprunts sur l&apos;année</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
            Évolution mensuelle &middot;{" "}
            <span className="font-semibold text-slate-800 dark:text-[#F3F4F6]">
              {total.toLocaleString("fr-FR")} prêts enregistrés
            </span>{" "}
            sur les {months} derniers mois
          </p>
        </div>
      </CardHeader>

      <figure className="p-6 pt-2 sm:p-8 sm:pt-4">
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="loansFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-[#212B44]"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-slate-400 dark:text-[#94A3B8]"
                dy={10}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-slate-400 dark:text-[#94A3B8]"
                width={44}
                tickFormatter={(value: number) =>
                  value >= 1000 ? `${value / 1000}k` : String(value)
                }
              />
              <Tooltip
                content={<TrendTooltip />}
                cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="loans"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#loansFill)"
                fillOpacity={1}
                activeDot={{
                  r: 5,
                  fill: "#3B82F6",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <figcaption className="sr-only">
          <table>
            <caption>Emprunts par mois au cours des {months} derniers mois</caption>
            <thead>
              <tr>
                <th scope="col">Mois</th>
                <th scope="col">Emprunts</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.month}>
                  <th scope="row">{row.month}</th>
                  <td>{row.loans.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figcaption>
      </figure>
    </Card>
  );
}

function BookStates() {
  const total = bookStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>État des livres</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
            Répartition globale sur l&apos;ensemble du catalogue
          </p>
        </div>
      </CardHeader>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[15rem]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="64%"
                outerRadius="94%"
                paddingAngle={2}
                stroke="currentColor"
                strokeWidth={2}
                className="text-white dark:text-[#171E31]"
              >
                {bookStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-[#F3F4F6] tabular-nums">
              {total >= 1000
                ? `${(total / 1000).toFixed(1)}k`
                : total.toLocaleString("fr-FR")}
            </span>
            <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Total exemplaires
            </span>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5">
          {bookStatusData.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="truncate text-slate-600 dark:text-[#94A3B8]">
                  {entry.name}
                </span>
              </span>
              <span className="shrink-0 font-semibold text-slate-900 dark:text-[#F3F4F6] tabular-nums">
                {entry.value.toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function PopularCategories() {
  const max = Math.max(...categoryData.map((item) => item.count));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Catégories les plus populaires</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
            Volumes catalogués parmi les catégories phares
          </p>
        </div>
      </CardHeader>

      <ul className="flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8">
        {categoryData.map((category) => {
          const share = (category.count / max) * 100;
          return (
            <li key={category.name}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-700 dark:text-[#E2E8F0]">
                  {category.name}
                </span>
                <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-[#F3F4F6] tabular-nums">
                  {category.count.toLocaleString("fr-FR")}
                </span>
              </div>
              <div
                role="meter"
                aria-valuenow={category.count}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`${category.name} : ${category.count.toLocaleString("fr-FR")} titres`}
                className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1F2A40]"
              >
                <div
                  className="h-full rounded-full bg-brand-600 dark:bg-blue-500 transition-[width] duration-700 ease-out"
                  style={{ width: `${share}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function AnalyticsView() {
  const [range, setRange] = React.useState("12");
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const { establishmentName } = useLibrarySettings();

  const [reportDate, setReportDate] = React.useState<string>("");

  React.useEffect(() => {
    setReportDate(
      new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date())
    );
  }, []);

  const periodLabel =
    range === "12"
      ? "12 derniers mois"
      : range === "6"
        ? "6 derniers mois"
        : "3 derniers mois";

  return (
    <PageContainer>
      {/* Printable official header shown ONLY on printed document / PDF */}
      <div className="mb-8 hidden border-b-2 border-slate-900 pb-4 print:block">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Rapport d&apos;activité &amp; Statistiques
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {establishmentName} &middot; Agbale
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p>
              <strong>Période analysée :</strong> {periodLabel}
            </p>
            {reportDate ? (
              <p className="mt-0.5">
                <strong>Date d&apos;émission :</strong> {reportDate}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <PageHeader
        className="print:hidden"
        title="Statistiques"
        description="Vue consolidée des performances, de l'état des collections et des volumes de prêt."
        actions={
          <>
            <Select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Période du rapport"
              className={cn("w-auto min-w-[11rem]")}
            >
              <option value="3">3 derniers mois</option>
              <option value="6">6 derniers mois</option>
              <option value="12">12 derniers mois</option>
            </Select>
            <Button variant="secondary" onClick={() => setIsReportOpen(true)}>
              <DownloadCloud className="size-[1.125rem]" aria-hidden="true" />
              Générer le rapport système
            </Button>
          </>
        }
      />

      {/* 1. Category Breakdowns & Book States on top */}
      <section aria-labelledby="breakdowns-heading" className="mb-8">
        <h2 id="breakdowns-heading" className="sr-only">
          Répartitions par catégorie et état des livres
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <BookStates />
          <PopularCategories />
        </div>
      </section>

      {/* 2. Stacked Borrowing Trends over the Year underneath */}
      <section aria-labelledby="trends-heading">
        <h2 id="trends-heading" className="sr-only">
          Tendances des emprunts sur l&apos;année
        </h2>
        <BorrowingTrends months={Number(range)} />
      </section>

      <SystemReportModal
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </PageContainer>
  );
}
