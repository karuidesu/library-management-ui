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
import { bookStatusData, borrowingTrendsData, categoryData } from "@/lib/data";

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
    <div className="rounded-xl border border-slate-700/40 bg-slate-900 px-3 py-2 shadow-popover">
      {children}
    </div>
  );
}

function TrendTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  return (
    <TooltipShell>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-white">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-brand-400"
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
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: slice?.payload?.color }}
        />
        {slice?.payload?.name}
      </p>
      <p className="mt-0.5 text-xs font-medium text-slate-400">
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
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>Tendances des emprunts</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Emprunts par mois &middot;{" "}
            <span className="font-medium text-slate-700">
              {total.toLocaleString("fr-FR")}
            </span>{" "}
            au cours des {months} derniers mois
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
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                width={44}
                tickFormatter={(value: number) =>
                  value >= 1000 ? `${value / 1000}k` : String(value)
                }
              />
              <Tooltip
                content={<TrendTooltip />}
                cursor={{ stroke: "#94A3B8", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="loans"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#loansFill)"
                fillOpacity={1}
                activeDot={{
                  r: 5,
                  fill: "#2563EB",
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
    <Card className="flex flex-col lg:col-span-1">
      <CardHeader>
        <div>
          <CardTitle>État des livres</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Sur l&apos;ensemble du catalogue</p>
        </div>
      </CardHeader>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
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
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {bookStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {total >= 1000
                ? `${(total / 1000).toFixed(1)}k`
                : total.toLocaleString("fr-FR")}
            </span>
            <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">
              Total des exemplaires
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
                <span className="truncate text-slate-600">{entry.name}</span>
              </span>
              <span className="shrink-0 font-semibold text-slate-900 tabular-nums">
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
    <Card className="flex flex-col lg:col-span-2">
      <CardHeader>
        <div>
          <CardTitle>Catégories les plus populaires</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Titres répertoriés, top 6 des catégories
          </p>
        </div>
      </CardHeader>

      <ul className="flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8">
        {categoryData.map((category) => {
          const share = (category.count / max) * 100;
          return (
            <li key={category.name}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-700">
                  {category.name}
                </span>
                <span className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                  {category.count.toLocaleString("fr-FR")}
                </span>
              </div>
              <div
                role="meter"
                aria-valuenow={category.count}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`${category.name} : ${category.count.toLocaleString("fr-FR")} titres`}
                className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-700 ease-out"
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

  return (
    <PageContainer>
      <PageHeader
        title="Analyses & Statistiques"
        description="Statistiques et indicateurs de performance de votre bibliothèque."
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
            <Button variant="secondary">
              <DownloadCloud className="size-[1.125rem]" aria-hidden="true" />
              Générer un rapport
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <BorrowingTrends months={Number(range)} />
        <BookStates />
        <PopularCategories />
      </div>
    </PageContainer>
  );
}
