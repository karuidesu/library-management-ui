"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { currentUser } from "@/lib/data";

export interface SystemReportModalProps {
  open: boolean;
  onClose: () => void;
}

export interface ReportMeta {
  reportId: string;
  generatedAt: string;
  periodLabel: string;
}

// Generates dynamic report metadata matching the day of print/generation: RPT-dd-mm-yyyy-30D
export function getCurrentReportMeta(): ReportMeta {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const reportId = `RPT-${dd}-${mm}-${yyyy}-30D`;

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const generatedAt = `${dateStr} à ${timeStr}`;

  const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDay = pastDate.getDate();
  const startMonth = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(pastDate);
  const startYear = pastDate.getFullYear();
  const endYear = now.getFullYear();

  const periodLabel =
    startYear === endYear
      ? `${startDay} ${startMonth} - ${dateStr}`
      : `${startDay} ${startMonth} ${startYear} - ${dateStr}`;

  return { reportId, generatedAt, periodLabel };
}

const DEFAULT_REPORT_META: ReportMeta = {
  reportId: "RPT-15-10-2026-30D",
  generatedAt: "15 octobre 2026 à 10:45",
  periodLabel: "15 Septembre - 15 Octobre 2026",
};

// Simulated backend data matching GET /api/v1/analytics/reports?days=30
const mockReportData = {
  reportId: "RPT-15-10-2026-30D",
  periodLabel: "15 Septembre - 15 Octobre 2026",
  periodStart: "2026-09-15",
  periodEnd: "2026-10-15",
  generatedAt: "15 octobre 2026 à 10:45",
  summary: {
    activeBorrowers: 3244,
    activeBorrowersTrend: 12.5,
    newBooksAdded: 42,
    totalLoansInitiated: 384,
    overdueAlerts: 84,
    damageReports: 3,
    onTimeReturnRate: 94.2,
  },
  genres: [
    { name: "Fiction", count: 124, percentage: 32 },
    { name: "Technologie", count: 92, percentage: 24 },
    { name: "Histoire", count: 68, percentage: 18 },
    { name: "Science", count: 62, percentage: 16 },
    { name: "Fantasy", count: 38, percentage: 10 },
  ],
  bookStates: [
    { label: "Neuf & Excellent état", count: 248, percentage: 65, color: "bg-emerald-500" },
    { label: "Très bon état", count: 84, percentage: 22, color: "bg-blue-500" },
    { label: "État moyen / usagé", count: 42, percentage: 11, color: "bg-amber-500" },
    { label: "Endommagé (en réparation)", count: 8, percentage: 2, color: "bg-rose-500" },
  ],
  inventory: [
    {
      id: "BK-001",
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      isbn: "978-2266205",
      category: "Fantasy",
      copies: 6,
      status: "Disponible",
      addedDate: "2026-09-18",
    },
    {
      id: "BK-002",
      title: "Le Petit Prince",
      author: "A. de Saint-Exupéry",
      isbn: "978-0156012",
      category: "Fiction",
      copies: 8,
      status: "Emprunté",
      addedDate: "2026-09-20",
    },
    {
      id: "BK-003",
      title: "Dune",
      author: "Frank Herbert",
      isbn: "978-0441172",
      category: "Science-fiction",
      copies: 5,
      status: "Disponible",
      addedDate: "2026-09-22",
    },
    {
      id: "BK-004",
      title: "Marie Curie: A Life",
      author: "Susan Quinn",
      isbn: "978-0201887",
      category: "Biographie",
      copies: 3,
      status: "Disponible",
      addedDate: "2026-09-25",
    },
    {
      id: "BK-005",
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524",
      category: "Fiction",
      copies: 7,
      status: "Emprunté",
      addedDate: "2026-09-28",
    },
    {
      id: "BK-007",
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350",
      category: "Technologie",
      copies: 4,
      status: "Emprunté",
      addedDate: "2026-10-02",
    },
    {
      id: "BK-008",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "978-0547928",
      category: "Fantasy",
      copies: 2,
      status: "Endommagé",
      addedDate: "2026-10-05",
    },
    {
      id: "BK-010",
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      isbn: "978-0374533",
      category: "Science",
      copies: 6,
      status: "Disponible",
      addedDate: "2026-10-08",
    },
  ],
  loans: [
    {
      id: "LN-2041",
      bookTitle: "1984",
      bookAuthor: "George Orwell",
      borrower: "Marc Dubois",
      borrowerGender: "M" as const,
      checkoutDate: "2026-09-28",
      dueDate: "2026-10-12",
      status: "En retard" as const,
      handlingStaff: "Sarah Connor",
    },
    {
      id: "LN-2042",
      bookTitle: "Sapiens: A Brief History",
      bookAuthor: "Yuval Noah Harari",
      borrower: "Lisa Park",
      borrowerGender: "F" as const,
      checkoutDate: "2026-09-30",
      dueDate: "2026-10-14",
      status: "En retard" as const,
      handlingStaff: "Marcus Johnson",
    },
    {
      id: "LN-2043",
      bookTitle: "Le Petit Prince",
      bookAuthor: "A. de Saint-Exupéry",
      borrower: "Emily Chen",
      borrowerGender: "F" as const,
      checkoutDate: "2026-10-01",
      dueDate: "2026-10-15",
      status: "En cours" as const,
      handlingStaff: "Marie Curie",
    },
    {
      id: "LN-2044",
      bookTitle: "Clean Code",
      bookAuthor: "Robert C. Martin",
      borrower: "Jean Dupont",
      borrowerGender: "M" as const,
      checkoutDate: "2026-10-02",
      dueDate: "2026-10-16",
      status: "En cours" as const,
      handlingStaff: "Sarah Connor",
    },
    {
      id: "LN-2045",
      bookTitle: "Dune",
      bookAuthor: "Frank Herbert",
      borrower: "Marie Curie",
      borrowerGender: "F" as const,
      checkoutDate: "2026-10-06",
      dueDate: "2026-10-20",
      status: "En cours" as const,
      handlingStaff: "Marcus Johnson",
    },
    {
      id: "LN-2038",
      bookTitle: "Marie Curie: A Life",
      bookAuthor: "Susan Quinn",
      borrower: "Kathryn Murphy",
      borrowerGender: "F" as const,
      checkoutDate: "2026-09-20",
      dueDate: "2026-10-04",
      returnDate: "2026-10-04",
      status: "Retourné" as const,
      handlingStaff: "Sarah Connor",
    },
    {
      id: "LN-2039",
      bookTitle: "The Art of War",
      bookAuthor: "Sun Tzu",
      borrower: "David Wilson",
      borrowerGender: "M" as const,
      checkoutDate: "2026-09-22",
      dueDate: "2026-10-06",
      returnDate: "2026-10-05",
      status: "Retourné" as const,
      handlingStaff: "Marie Curie",
    },
  ],
  members: [
    {
      id: "MEM-009",
      name: "Kathryn Murphy",
      email: "kathryn.m@email.com",
      phone: "+229 97 11 22 33",
      gender: "F" as const,
      role: "Membre",
      registeredDate: "2026-10-14",
      registeredBy: "Sarah Connor",
    },
    {
      id: "MEM-008",
      name: "David Wilson",
      email: "david.w@email.com",
      phone: "+229 96 44 55 66",
      gender: "M" as const,
      role: "Membre",
      registeredDate: "2026-10-08",
      registeredBy: "Marcus Johnson",
    },
    {
      id: "MEM-007",
      name: "Lisa Park",
      email: "lisa.park@email.com",
      phone: "+229 95 77 88 99",
      gender: "F" as const,
      role: "Membre",
      registeredDate: "2026-09-28",
      registeredBy: "Sarah Connor",
    },
    {
      id: "MEM-006",
      name: "Marcus Johnson",
      email: "marcus.j@agbale.app",
      phone: "+229 90 12 34 56",
      gender: "M" as const,
      role: "Bibliothécaire",
      registeredDate: "2026-09-20",
      registeredBy: "Sarah Connor (Admin)",
    },
  ],
};

function generateCsvReport(establishment: string, meta: ReportMeta): string {
  const d = mockReportData;
  const lines: string[] = [];

  lines.push(`"RAPPORT MENSUEL D'ACTIVITE ET D'AUDIT - RAPPORT ${meta.reportId} - AGBALE ${establishment.toUpperCase()}"`);
  lines.push(`"Identifiant du rapport","Rapport ${meta.reportId} . Agbale ${establishment}"`);
  lines.push(`"Etablissement","${establishment}"`);
  lines.push(`"Periode","${meta.periodLabel}"`);
  lines.push(`"Date de generation","${meta.generatedAt}"`);
  lines.push(`"Genere par","${currentUser.name} (${currentUser.role})"`);
  lines.push(`"Operateur responsable","${currentUser.name} (${currentUser.role})"`);
  lines.push("");

  lines.push('"--- SYNTHESE EXECUTIVE (30 DERNIERS JOURS) ---"');
  lines.push('"Indicateur","Valeur","Contexte"');
  lines.push(`"Emprunteurs actifs",${d.summary.activeBorrowers},"+${d.summary.activeBorrowersTrend}% ce mois-ci"`);
  lines.push(`"Nouveaux livres ajoutes",${d.summary.newBooksAdded},"Catalogues ce mois"`);
  lines.push(`"Total prets inities",${d.summary.totalLoansInitiated},"Volume mensuel"`);
  lines.push(`"Alertes de retard",${d.summary.overdueAlerts},"Prêts à relancer"`);
  lines.push(`"Declarations d'avaries",${d.summary.damageReports},"Signalements traites"`);
  lines.push(`"Taux de retour a temps",${d.summary.onTimeReturnRate}%,"Conformite des restitutions"`);
  lines.push("");

  lines.push('"--- AUDIT DES EMPRUNTS ET RETOURS (30 JOURS) ---"');
  lines.push('"ID Pret","Titre du Livre","Auteur","Emprunteur","Date Sortie","Echeance","Statut","Bibliothecaire"');
  d.loans.forEach((loan) => {
    lines.push(
      `"${loan.id}","${loan.bookTitle}","${loan.bookAuthor}","${loan.borrower}","${loan.checkoutDate}","${loan.dueDate}","${loan.status}","${loan.handlingStaff}"`,
    );
  });
  lines.push("");

  lines.push('"--- INVENTAIRE DU CATALOGUE REGISTRE CE MOIS ---"');
  lines.push('"ID Livre","Titre","Auteur","ISBN","Categorie","Exemplaires","Statut"');
  d.inventory.forEach((item) => {
    lines.push(
      `"${item.id}","${item.title}","${item.author}","${item.isbn}","${item.category}",${item.copies},"${item.status}"`,
    );
  });
  lines.push("");

  lines.push('"--- AUDIT DES MEMBRES ET ROLES ASSIGNES ---"');
  lines.push('"ID Membre","Nom complet","Email","Telephone","Role","Date Adhesion","Valide par"');
  d.members.forEach((m) => {
    lines.push(
      `"${m.id}","${m.name}","${m.email || 'N/A'}","${m.phone}","${m.role}","${m.registeredDate}","${m.registeredBy}"`,
    );
  });

  return lines.join("\n");
}

export function SystemReportModal({ open, onClose }: SystemReportModalProps) {
  const { establishmentName } = useLibrarySettings();
  const [downloadingCsv, setDownloadingCsv] = React.useState(false);
  const [reportMeta, setReportMeta] = React.useState<ReportMeta>(DEFAULT_REPORT_META);
  const data = mockReportData;

  // Recalculate dynamic reportId and timestamp for the day of print/open
  React.useEffect(() => {
    if (open) {
      setReportMeta(getCurrentReportMeta());
    }
  }, [open]);

  const handlePrint = () => {
    const meta = getCurrentReportMeta();
    setReportMeta(meta);
    const originalTitle = document.title;
    document.title = `Rapport ${meta.reportId} . Agbale ${establishmentName}`;
    document.body.classList.add("printing-report");
    const cleanup = () => {
      document.body.classList.remove("printing-report");
      document.title = originalTitle;
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    // Safety fallback cleanup in case afterprint doesn't trigger
    setTimeout(() => {
      document.body.classList.remove("printing-report");
      document.title = originalTitle;
    }, 2000);
  };

  const handleDownloadCsv = () => {
    try {
      setDownloadingCsv(true);
      const meta = getCurrentReportMeta();
      setReportMeta(meta);
      const csv = generateCsvReport(establishmentName, meta);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Rapport-${meta.reportId}-Agbale-${establishmentName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloadingCsv(false), 500);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rapport d'activité et d'audit système au cours des 30 derniers jours"
      description="Prévisualisez et exportez le rapport consolidé de l'établissement avant impression ou diffusion."
      size="2xl"
      footer={
        <div className="flex w-full flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#94A3B8]">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
            <span>
              Données d&apos;audit consolidées &middot; ID :{" "}
              <strong className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                Rapport {reportMeta.reportId} &middot; Agbale {establishmentName}
              </strong>{" "}
              &middot; Généré par{" "}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                {currentUser.name}
              </strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadCsv}
              disabled={downloadingCsv}
            >
              <FileSpreadsheet className="size-4" aria-hidden="true" />
              {downloadingCsv ? "Génération CSV..." : "Télécharger CSV"}
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="size-4" aria-hidden="true" />
              Exporter en PDF / Imprimer
            </Button>
          </div>
        </div>
      }
    >
      <div id="system-report-sheet" className="space-y-8">
        {/* Top Control Bar with quick actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#131929]/70">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-600/10 text-brand-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
                Format d&apos;export officiel
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-[#F3F4F6]">
                Audit mensuel certifié &middot; 30 derniers jours
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadCsv}
              title="Télécharger l'intégralité des tables au format CSV compatible Excel"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Télécharger CSV
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              title="Générer un PDF vectoriel prêt pour archivage ou impression"
            >
              <Printer className="size-3.5" aria-hidden="true" />
              Exporter PDF
            </Button>
          </div>
        </div>

        {/* Printable Report Document Sheet */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#212B44] dark:bg-[#0E1321] sm:p-8">
          {/* Document Header */}
          <header className="report-header border-b border-slate-200 pb-6 dark:border-[#212B44]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-blue-950/70 dark:text-blue-300">
                  <Shield className="size-3.5" aria-hidden="true" />
                  Rapport {reportMeta.reportId} &middot; Agbale {establishmentName}
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6] sm:text-3xl">
                  Rapport mensuel d&apos;activité et d&apos;audit
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-[#94A3B8]">
                  Établissement : <strong className="font-semibold text-slate-700 dark:text-slate-300">{establishmentName}</strong> &middot; Période d&apos;audit : {reportMeta.periodLabel}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600 dark:border-[#212B44] dark:bg-[#171E31] dark:text-[#94A3B8] sm:min-w-[14rem]">
                <div className="space-y-1.5">
                  <p className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Réf. Rapport :</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-[#F3F4F6]">
                      {reportMeta.reportId}
                    </span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Établissement :</span>
                    <span className="font-medium text-slate-900 dark:text-[#F3F4F6]">{establishmentName}</span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Généré le :</span>
                    <span>{reportMeta.generatedAt}</span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Généré par :</span>
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">{currentUser.name}</span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Rôle :</span>
                    <span>{currentUser.role}</span>
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Section 1: Executive Summary (The 30-Day Stats) */}
          <section aria-labelledby="section-summary-title" className="pt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#212B44]">
              <h2
                id="section-summary-title"
                className="text-base font-semibold text-slate-900 dark:text-[#F3F4F6]"
              >
                1. Synthèse exécutive des 30 derniers jours
              </h2>
              <span className="text-xs text-slate-400">Ce mois-ci</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#171E31]/60">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                  <span>Emprunteurs actifs</span>
                  <Users className="size-4 text-brand-600 dark:text-blue-400" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                  {data.summary.activeBorrowers.toLocaleString("fr-FR")}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="size-3" />
                  +{data.summary.activeBorrowersTrend}% ce mois
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#171E31]/60">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                  <span>Nouveaux livres</span>
                  <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                  {data.summary.newBooksAdded}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                  Catalogués ce mois
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#171E31]/60">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                  <span>Prêts initiés</span>
                  <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                  {data.summary.totalLoansInitiated}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                  Volume mensuel
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#171E31]/60">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                  <span>Alertes de retard</span>
                  <AlertTriangle className="size-4 text-rose-500" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  {data.summary.overdueAlerts}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                  Dépassements signalés
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#171E31]/60 sm:col-span-1">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                  <span>Livres endommagés</span>
                  <AlertTriangle className="size-4 text-amber-500" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                  {data.summary.damageReports}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                  Signalements traités
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Catalog & Inventory Audit (Tous les livres) */}
          <section aria-labelledby="section-catalog-title" className="pt-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#212B44]">
              <h2
                id="section-catalog-title"
                className="text-base font-semibold text-slate-900 dark:text-[#F3F4F6]"
              >
                2. Audit du catalogue et inventaire
              </h2>
              <span className="text-xs text-slate-400">8 titres phares audités</span>
            </div>

            {/* Sub-categories checklist & state statistics */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#212B44] dark:bg-[#131929]/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
                  Répartition des genres les plus sollicités
                </p>
                <div className="mt-3 space-y-2">
                  {data.genres.map((genre) => (
                    <div key={genre.name} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-[#F3F4F6]">
                        {genre.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-[#212B44]">
                          <div
                            className="h-full rounded-full bg-brand-600 dark:bg-blue-500"
                            style={{ width: `${genre.percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-slate-500 dark:text-[#94A3B8]">
                          {genre.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#212B44] dark:bg-[#131929]/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
                  État physique des volumes recensés
                </p>
                <div className="mt-3 space-y-2">
                  {data.bookStates.map((state) => (
                    <div key={state.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", state.color)} />
                        <span className="font-medium text-slate-700 dark:text-[#F3F4F6]">
                          {state.label}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">
                        {state.count} ex. ({state.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-[#212B44]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 dark:border-[#212B44] dark:bg-[#131929] dark:text-[#94A3B8]">
                    <tr>
                      <th className="px-4 py-2.5">Titre de l&apos;ouvrage</th>
                      <th className="px-4 py-2.5">Auteur</th>
                      <th className="px-4 py-2.5">ISBN</th>
                      <th className="px-4 py-2.5">Catégorie</th>
                      <th className="px-4 py-2.5 text-center">Copies</th>
                      <th className="px-4 py-2.5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#212B44]">
                    {data.inventory.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-[#171E31]/50">
                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-[#F3F4F6]">
                          {book.title}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-[#94A3B8]">
                          {book.author}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-500 dark:text-[#64748B]">
                          {book.isbn}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-[#94A3B8]">
                          {book.category}
                        </td>
                        <td className="px-4 py-2.5 text-center font-semibold text-slate-900 dark:text-[#F3F4F6]">
                          {book.copies}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                              book.status === "Disponible"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : book.status === "Emprunté"
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
                            )}
                          >
                            {book.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: All 30-Day Borrowing & Returns (Les Emprunts & Retours) */}
          <section aria-labelledby="section-loans-title" className="pt-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#212B44]">
              <h2
                id="section-loans-title"
                className="text-base font-semibold text-slate-900 dark:text-[#F3F4F6]"
              >
                3. Registre des emprunts et retours du mois
              </h2>
              <span className="text-xs text-slate-400">Transactions enregistrées</span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-[#212B44]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 dark:border-[#212B44] dark:bg-[#131929] dark:text-[#94A3B8]">
                    <tr>
                      <th className="px-4 py-2.5">Réf.</th>
                      <th className="px-4 py-2.5">Ouvrage</th>
                      <th className="px-4 py-2.5">Emprunteur</th>
                      <th className="px-4 py-2.5">Date Sortie</th>
                      <th className="px-4 py-2.5">Échéance / Retour</th>
                      <th className="px-4 py-2.5">Statut</th>
                      <th className="px-4 py-2.5 text-right">Responsable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#212B44]">
                    {data.loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-[#171E31]/50">
                        <td className="px-4 py-2.5 font-mono font-medium text-slate-500">
                          {loan.id}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-[#F3F4F6]">
                          {loan.bookTitle}
                          <span className="block text-[0.6875rem] font-normal text-slate-500">
                            {loan.bookAuthor}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={loan.borrower}
                              gender={loan.borrowerGender}
                              size="xs"
                            />
                            <span className="font-medium text-slate-800 dark:text-[#F3F4F6]">
                              {loan.borrower}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-[#94A3B8]">
                          {loan.checkoutDate}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-[#F3F4F6]">
                          {loan.returnDate ? `Retourné le ${loan.returnDate}` : loan.dueDate}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            tone={
                              loan.status === "Retourné"
                                ? "success"
                                : loan.status === "En retard"
                                  ? "danger"
                                  : "info"
                            }
                            dot
                          >
                            {loan.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-slate-600 dark:text-[#94A3B8]">
                          {loan.handlingStaff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Member Registration Audit */}
          <section aria-labelledby="section-members-title" className="pt-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#212B44]">
              <h2
                id="section-members-title"
                className="text-base font-semibold text-slate-900 dark:text-[#F3F4F6]"
              >
                4. Audit des nouvelles adhésions
              </h2>
              <span className="text-xs text-slate-400">Adhésions validées ce mois</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-[#212B44] dark:bg-[#131929]/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={member.name}
                      gender={member.gender}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-[#F3F4F6]">
                        {member.name}
                      </p>
                      <p className="truncate text-[0.6875rem] text-slate-500 dark:text-[#94A3B8]">
                        {member.email || member.phone}
                      </p>
                      <p className="text-[0.6875rem] text-slate-400">
                        Inscrit le {member.registeredDate}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                        member.role === "Admin"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400"
                          : member.role === "Bibliothécaire"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                      )}
                    >
                      {member.role}
                    </span>
                    <p className="mt-1 text-[0.6875rem] text-slate-400">
                      par {member.registeredBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Document Footer */}
          <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-[#212B44] dark:text-[#94A3B8]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-slate-700 dark:text-[#F3F4F6]">
                  Agbale &middot; {establishmentName} &middot; Certificat d&apos;intégrité des données
                </p>
                <p className="mt-0.5 text-[0.6875rem] text-slate-400">
                  Rapport édité sous le contrôle de {currentUser.name} ({currentUser.role}) pour {establishmentName}.
                </p>
              </div>
              <div className="text-right text-[0.6875rem] text-slate-400">
                Document certifié &middot; Page 1/1 &middot; Rapport {reportMeta.reportId} &middot; {establishmentName} &middot; Généré par {currentUser.name}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </Modal>
  );
}
