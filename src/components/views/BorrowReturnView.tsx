"use client";

import * as React from "react";
import {
  ArrowRight,
  BookPlus,
  CalendarDays,
  CheckCircle2,
  Inbox,
  Search,
  User,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Avatar, BookCover } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { Field, Input, Select } from "@/components/ui/Field";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/Page";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import {
  activeLoans as seedLoans,
  daysUntilDue,
  describeDueDate,
  formatDate,
  initialBooks,
  initialMembers,
  loanDurations,
  REFERENCE_DATE,
  type ActiveLoan,
  type Member,
} from "@/lib/data";
import { getCoverByCategory } from "@/lib/covers";

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function RegisterLoanPanel({
  loans,
  onRegister,
  members,
}: {
  loans: ActiveLoan[];
  onRegister: (loan: ActiveLoan) => void;
  members: Member[];
}) {
  const { maxBooks } = useLibrarySettings();
  const [member, setMember] = React.useState<ComboboxOption | null>(null);
  const [book, setBook] = React.useState<ComboboxOption | null>(null);
  const [duration, setDuration] = React.useState("14");
  const [dueDate, setDueDate] = React.useState(() =>
    addDays(REFERENCE_DATE, 14),
  );
  const [confirmation, setConfirmation] = React.useState<string | null>(null);

  const applyDuration = (value: string) => {
    setDuration(value);
    setDueDate(addDays(REFERENCE_DATE, Number(value)));
  };

  const memberOptions: ComboboxOption[] = React.useMemo(() => {
    return members.map((m) => {
      const loansCount = m.active_loans_count ?? m.borrowedCount ?? 0;
      const isQuotaReached = loansCount >= maxBooks;
      return {
        id: String(m.id),
        label: m.name,
        meta: `${m.email ? `${m.email} · ` : ""}${loansCount}/${maxBooks} livres empruntés`,
        keywords: `${m.id} ${m.email || ""}`,
        disabled: isQuotaReached,
        disabledHint: isQuotaReached
          ? `Quota maximal atteint (${loansCount}/${maxBooks} livres)`
          : undefined,
        badge: isQuotaReached
          ? { label: "Quota atteint", tone: "danger" }
          : undefined,
        adornment: <Avatar name={m.name} gender={m.gender} size="sm" />,
      };
    });
  }, [members, maxBooks]);

  const bookOptions: ComboboxOption[] = React.useMemo(() => {
    return initialBooks.map((b) => {
      const activeLoan = loans.find((l) => (l.book_id ?? l.bookId) === b.id);
      const isLoaned = b.status === "Emprunté" || !!activeLoan;
      const isDamaged = b.status === "Endommagé";
      const isLost = b.status === "Perdu";
      const isAvailable = b.status === "Disponible" && !activeLoan;

      let disabledHint: string | undefined;
      let badge: ComboboxOption["badge"];

      if (isLoaned) {
        const returnDate = activeLoan
          ? formatDate(activeLoan.due_date || activeLoan.return_due_date || activeLoan.dueDate || "")
          : "date non définie";
        disabledHint = `Prêté (Retour prévu le ${returnDate})`;
        badge = { label: "Prêté", tone: "warning" };
      } else if (isDamaged) {
        disabledHint = "Livre endommagé";
        badge = { label: "Endommagé", tone: "danger" };
      } else if (isLost) {
        disabledHint = "Livre signalé perdu";
        badge = { label: "Perdu", tone: "danger" };
      }

      return {
        id: String(b.id),
        label: b.title,
        meta: `${b.author} · ISBN: ${b.isbn}`,
        keywords: `${b.isbn} ${b.id} ${b.category} ${b.author}`,
        disabled: !isAvailable,
        disabledHint,
        badge,
        adornment: (
          <BookCover
            title={b.title}
            category={b.category}
            className="h-9 w-6 text-xs"
          />
        ),
      };
    });
  }, [loans]);

  const ready = member !== null && book !== null;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member || !book) return;

    const record = initialBooks.find((item) => String(item.id) === book.id);
    const person = members.find((item) => String(item.id) === member.id);
    if (!record || !person) return;

    const coverStyle = getCoverByCategory(record.category);
    onRegister({
      id: `LN-${Math.floor(Math.random() * 9000 + 1000)}`,
      book_id: record.id,
      book_title: record.title,
      book_author: record.author,
      category: record.category,
      cover_color: coverStyle.gradient,
      cover_emoji: coverStyle.emoji,
      member_id: person.id,
      user_id: person.id,
      borrower: person.name,
      borrower_name: person.name,
      borrower_initials: person.avatar || person.name.slice(0, 2).toUpperCase(),
      borrower_gender: person.gender,
      borrow_date: REFERENCE_DATE,
      due_date: dueDate,
      return_due_date: dueDate,
      // camelCase aliases
      bookId: record.id,
      bookTitle: record.title,
      bookAuthor: record.author,
      coverColor: coverStyle.gradient,
      coverEmoji: coverStyle.emoji,
      memberId: person.id,
      borrowerInitials: person.avatar,
      borrowerGender: person.gender,
      borrowDate: REFERENCE_DATE,
      dueDate,
    });

    setConfirmation(`${record.title} prêté à ${person.name}.`);
    setMember(null);
    setBook(null);
    applyDuration("14");
  };

  const selectedMemberRecord = member
    ? members.find((m) => m.id === member.id)
    : null;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50">
              <BookPlus className="size-5 text-brand-600" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Enregistrer un nouvel emprunt</CardTitle>
              <p className="mt-0.5 text-sm text-slate-500">
                Recherche manuelle du membre et du livre pour valider la sortie.
              </p>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
          <div>
            <Field
              label="Sélectionner un membre"
              htmlFor="loan-member"
            >
              <Combobox
                id="loan-member"
                options={memberOptions}
                value={member}
                onChange={setMember}
                leadingIcon={User}
                placeholder="Rechercher par nom, e-mail ou identifiant..."
                emptyMessage="Aucun membre ne correspond à cette recherche"
                disabledHint="Quota maximum d'emprunts atteint"
              />
            </Field>
          </div>

          <Field
            label="Sélectionner un livre"
            htmlFor="loan-book"
            hint="Les livres déjà empruntés sont indiqués avec leur date de retour prévue."
          >
            <Combobox
              id="loan-book"
              options={bookOptions}
              value={book}
              onChange={setBook}
              leadingIcon={Search}
              placeholder="Rechercher par ISBN ou titre du livre..."
              emptyMessage="Aucun livre ne correspond à cette recherche"
              disabledHint="Non disponible au prêt"
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Field label="Durée du prêt" htmlFor="loan-duration">
                <Select
                  id="loan-duration"
                  value={duration}
                  onChange={(event) => applyDuration(event.target.value)}
                >
                  {loanDurations.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { days: "14", label: "14 j" },
                  { days: "30", label: "30 j" },
                  { days: "45", label: "45 j" },
                  { days: "60", label: "60 j" },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => applyDuration(item.days)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                      duration === item.days
                        ? "bg-brand-600 dark:bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1F2A40] dark:text-[#94A3B8] dark:hover:bg-[#2E3E5A]",
                    )}
                  >
                    {duration === item.days ? `✓ ${item.label}` : item.label}
                  </button>
                ))}
              </div>
            </div>

            <Field
              label="Date d'échéance"
              htmlFor="loan-due"
              hint={`Retour prévu le ${formatDate(dueDate)}`}
            >
              <Input
                id="loan-due"
                type="date"
                value={dueDate}
                min={REFERENCE_DATE}
                onChange={(event) => setDueDate(event.target.value)}
                leadingIcon={CalendarDays}
              />
            </Field>
          </div>

          {ready ? (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#111827] dark:border dark:border-[#212B44] p-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <Avatar
                name={member.label}
                gender={selectedMemberRecord?.gender}
                size="md"
              />
              <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                <span className="truncate font-medium text-slate-900 dark:text-[#F3F4F6]">
                  {member.label}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-slate-400 dark:text-[#94A3B8]"
                  aria-hidden="true"
                />
                <span className="truncate font-medium text-slate-900 dark:text-[#F3F4F6]">
                  {book.label}
                </span>
              </div>
            </div>
          ) : null}

          <Button type="submit" size="lg" disabled={!ready} className="w-full">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            Valider le prêt du livre
          </Button>

          <p
            role="status"
            aria-live="polite"
            className={cn(
              "text-center text-sm font-medium text-emerald-700 dark:text-emerald-400",
              confirmation ? "visible" : "invisible",
            )}
          >
            {confirmation ?? "placeholder"}
          </p>
        </form>
      </Card>
    </>
  );
}

function LoanRow({
  loan,
  onReturn,
}: {
  loan: ActiveLoan;
  onReturn: (id: string | number) => void;
}) {
  const book_title = loan.book_title || loan.bookTitle || "";
  const book_author = loan.book_author || loan.bookAuthor || "";
  const book_id = loan.book_id ?? loan.bookId;
  const due_date = loan.due_date || loan.return_due_date || loan.dueDate || "";
  const borrow_date = loan.borrow_date || loan.borrowDate || "";
  const borrower = loan.borrower_name || loan.borrower || "";
  const borrower_gender = loan.borrower_gender || loan.borrowerGender;

  const days = daysUntilDue(due_date);
  const overdue = days < 0;
  const dueSoon = days >= 0 && days <= 1;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-colors sm:flex-nowrap",
        overdue
          ? "border-rose-100 bg-rose-50/40 hover:bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/25 dark:hover:bg-rose-950/35"
          : "border-slate-100 hover:bg-slate-50 dark:border-[#212B44] dark:bg-[#171E31] dark:hover:bg-[#1F2A40]",
      )}
    >
      <BookCover
        title={book_title}
        category={
          loan.category ||
          initialBooks.find(
            (b) => b.id === book_id || b.title === book_title,
          )?.category
        }
      />

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <p className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
          {book_title}
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-[#94A3B8]">{book_author}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Avatar
            name={borrower}
            gender={borrower_gender}
            size="xs"
          />
          <span className="truncate text-xs font-medium text-slate-600 dark:text-[#94A3B8]">
            {borrower}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-5">
        <div className="text-right">
          <Badge
            tone={overdue ? "danger" : dueSoon ? "warning" : "neutral"}
            dot={overdue}
          >
            {describeDueDate(due_date)}
          </Badge>
          <p className="mt-1 whitespace-nowrap text-xs text-slate-400 dark:text-[#64748B]">
            Emprunté le {formatDate(borrow_date)}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => onReturn(loan.id)}
          aria-label={`Enregistrer le retour de ${book_title}, emprunté par ${borrower}`}
          className="hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
        >
          Enregistrer le retour
        </Button>
      </div>
    </li>
  );
}

export function BorrowReturnView() {
  const [loans, setLoans] = React.useState<ActiveLoan[]>(seedLoans);
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [filter, setFilter] = React.useState("");
  const [onlyOverdue, setOnlyOverdue] = React.useState(false);

  const registerLoan = React.useCallback((loan: ActiveLoan) => {
    setLoans((current) => [loan, ...current]);
    const memberId = loan.member_id ?? loan.memberId;
    setMembers((current) =>
      current.map((m) =>
        m.id === memberId
          ? {
              ...m,
              active_loans_count: (m.active_loans_count ?? m.borrowedCount ?? 0) + 1,
              borrowedCount: (m.borrowedCount ?? m.active_loans_count ?? 0) + 1,
            }
          : m,
      ),
    );
  }, []);

  const returnLoan = React.useCallback((id: string | number) => {
    setLoans((current) => {
      const target = current.find((l) => l.id === id);
      if (target) {
        const memberId = target.member_id ?? target.memberId;
        setMembers((prev) =>
          prev.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  active_loans_count: Math.max(0, (m.active_loans_count ?? m.borrowedCount ?? 1) - 1),
                  borrowedCount: Math.max(0, (m.borrowedCount ?? m.active_loans_count ?? 1) - 1),
                }
              : m,
          ),
        );
      }
      return current.filter((loan) => loan.id !== id);
    });
  }, []);

  const visible = React.useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return loans
      .filter((loan) => {
        const bookTitle = (loan.book_title || loan.bookTitle || "").toLowerCase();
        const borrower = (loan.borrower_name || loan.borrower || "").toLowerCase();
        const idStr = String(loan.id).toLowerCase();
        const dueDate = loan.due_date || loan.return_due_date || loan.dueDate || "";
        const matches =
          needle.length === 0 ||
          bookTitle.includes(needle) ||
          borrower.includes(needle) ||
          idStr.includes(needle);
        return matches && (!onlyOverdue || daysUntilDue(dueDate) < 0);
      })
      .sort((a, b) => {
        const dueA = a.due_date || a.return_due_date || a.dueDate || "";
        const dueB = b.due_date || b.return_due_date || b.dueDate || "";
        return daysUntilDue(dueA) - daysUntilDue(dueB);
      });
  }, [loans, filter, onlyOverdue]);

  const overdueCount = loans.filter((loan) => {
    const dueDate = loan.due_date || loan.return_due_date || loan.dueDate || "";
    return daysUntilDue(dueDate) < 0;
  }).length;

  return (
    <PageContainer>
      <PageHeader
        title="Prêts / Retours"
        description="Traitez les nouveaux emprunts et gérez les retours de livres."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:self-start">
          <RegisterLoanPanel
            loans={loans}
            onRegister={registerLoan}
            members={members}
          />
        </div>

        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="gap-3">
              <div className="min-w-0">
                <CardTitle>Emprunts en cours &amp; retours</CardTitle>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-[#94A3B8]">
                  {loans.length} en cours de prêt
                  {overdueCount > 0 ? (
                    <>
                      {", "}
                      <span className="font-medium text-rose-600 dark:text-rose-400">
                        {overdueCount} en retard
                      </span>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Input
                  type="search"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  leadingIcon={Search}
                  placeholder="Filtrer les emprunts..."
                  aria-label="Filtrer les emprunts actifs"
                  className="h-10 bg-slate-50 dark:bg-[#111827] focus:bg-white dark:focus:bg-[#111827] sm:w-56"
                />
                <Button
                  variant={onlyOverdue ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setOnlyOverdue((value) => !value)}
                  aria-pressed={onlyOverdue}
                  className="h-10 shrink-0"
                >
                  En retard
                </Button>
              </div>
            </CardHeader>

            {visible.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={
                  loans.length === 0
                    ? "Aucun livre n'est actuellement emprunté"
                    : "Aucun emprunt ne correspond à ce filtre"
                }
                description={
                  loans.length === 0
                    ? "Enregistrez un emprunt sur la gauche et il apparaîtra ici."
                    : "Essayez un autre nom ou titre, ou désactivez le filtre des retards."
                }
                action={
                  loans.length > 0 ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFilter("");
                        setOnlyOverdue(false);
                      }}
                    >
                      Effacer les filtres
                    </Button>
                  ) : null
                }
              />
            ) : (
              <ul className="space-y-3 p-6 sm:p-8">
                {visible.map((loan) => (
                  <LoanRow key={loan.id} loan={loan} onReturn={returnLoan} />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
