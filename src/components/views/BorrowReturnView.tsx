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
} from "@/lib/data";

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const memberOptions: ComboboxOption[] = initialMembers.map((member) => ({
  id: member.id,
  label: member.name,
  meta: `${member.email} · ${member.borrowedCount} en prêt`,
  keywords: member.id,
  disabled: member.status === "Inactif",
  adornment: (
    <Avatar name={member.name} initials={member.avatar} size="sm" />
  ),
}));

const bookOptions: ComboboxOption[] = initialBooks.map((book) => ({
  id: book.id,
  label: book.title,
  meta: `${book.author} · ${book.isbn}`,
  keywords: `${book.isbn} ${book.id} ${book.category}`,
  disabled: book.status !== "Disponible",
  adornment: (
    <BookCover
      title={book.title}
      gradient={book.coverColor}
      emoji={book.coverEmoji}
      className="h-9 w-6 text-xs"
    />
  ),
}));

function RegisterLoanPanel({
  onRegister,
}: {
  onRegister: (loan: ActiveLoan) => void;
}) {
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

  const ready = member !== null && book !== null;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member || !book) return;

    const record = initialBooks.find((item) => item.id === book.id);
    const person = initialMembers.find((item) => item.id === member.id);
    if (!record || !person) return;

    onRegister({
      id: `LN-${Math.floor(Math.random() * 9000 + 1000)}`,
      bookId: record.id,
      bookTitle: record.title,
      bookAuthor: record.author,
      coverColor: record.coverColor,
      coverEmoji: record.coverEmoji,
      memberId: person.id,
      borrower: person.name,
      borrowerInitials: person.avatar,
      borrowDate: REFERENCE_DATE,
      dueDate,
    });

    setConfirmation(`${record.title} prêté à ${person.name}.`);
    setMember(null);
    setBook(null);
    applyDuration("14");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50">
            <BookPlus className="size-5 text-brand-600" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Enregistrer un nouvel emprunt</CardTitle>
            <p className="mt-0.5 text-sm text-slate-500">
              Scannez ou recherchez pour enregistrer un prêt de livre.
            </p>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
        <Field label="Sélectionner un membre" htmlFor="loan-member">
          <Combobox
            id="loan-member"
            options={memberOptions}
            value={member}
            onChange={setMember}
            leadingIcon={User}
            placeholder="Rechercher par nom, e-mail ou identifiant..."
            emptyMessage="Aucun membre ne correspond à cette recherche"
            disabledHint="Compte inactif"
          />
        </Field>

        <Field label="Sélectionner un livre" htmlFor="loan-book">
          <Combobox
            id="loan-book"
            options={bookOptions}
            value={book}
            onChange={setBook}
            leadingIcon={Search}
            placeholder="Scanner l'ISBN ou rechercher par titre..."
            emptyMessage="Aucun livre ne correspond à cette recherche"
            disabledHint="Non disponible au prêt"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <Avatar name={member.label} size="md" />
            <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
              <span className="truncate font-medium text-slate-900">
                {member.label}
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <span className="truncate font-medium text-slate-900">
                {book.label}
              </span>
            </div>
          </div>
        ) : null}

        <Button type="submit" size="lg" disabled={!ready} className="w-full">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          Emprunter le livre
        </Button>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-center text-sm font-medium text-emerald-700",
            confirmation ? "visible" : "invisible",
          )}
        >
          {confirmation ?? "placeholder"}
        </p>
      </form>
    </Card>
  );
}

function LoanRow({
  loan,
  onReturn,
}: {
  loan: ActiveLoan;
  onReturn: (id: string) => void;
}) {
  const days = daysUntilDue(loan.dueDate);
  const overdue = days < 0;
  const dueSoon = days >= 0 && days <= 1;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-colors sm:flex-nowrap",
        overdue
          ? "border-rose-100 bg-rose-50/40 hover:bg-rose-50/70"
          : "border-slate-100 hover:bg-slate-50",
      )}
    >
      <BookCover
        title={loan.bookTitle}
        gradient={loan.coverColor}
        emoji={loan.coverEmoji}
      />

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <p className="truncate font-semibold text-slate-900">
          {loan.bookTitle}
        </p>
        <p className="truncate text-sm text-slate-500">{loan.bookAuthor}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Avatar
            name={loan.borrower}
            initials={loan.borrowerInitials}
            size="xs"
          />
          <span className="truncate text-xs font-medium text-slate-600">
            {loan.borrower}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-5">
        <div className="text-right">
          <Badge
            tone={overdue ? "danger" : dueSoon ? "warning" : "neutral"}
            dot={overdue}
          >
            {describeDueDate(loan.dueDate)}
          </Badge>
          <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
            Emprunté depuis le {formatDate(loan.borrowDate)}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => onReturn(loan.id)}
          aria-label={`Retourner ${loan.bookTitle}, emprunté par ${loan.borrower}`}
          className="hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Retourner
        </Button>
      </div>
    </li>
  );
}

export function BorrowReturnView() {
  const [loans, setLoans] = React.useState<ActiveLoan[]>(seedLoans);
  const [filter, setFilter] = React.useState("");
  const [onlyOverdue, setOnlyOverdue] = React.useState(false);

  const registerLoan = React.useCallback((loan: ActiveLoan) => {
    setLoans((current) => [loan, ...current]);
  }, []);

  const returnLoan = React.useCallback((id: string) => {
    setLoans((current) => current.filter((loan) => loan.id !== id));
  }, []);

  const visible = React.useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return loans
      .filter((loan) => {
        const matches =
          needle.length === 0 ||
          loan.bookTitle.toLowerCase().includes(needle) ||
          loan.borrower.toLowerCase().includes(needle) ||
          loan.id.toLowerCase().includes(needle);
        return matches && (!onlyOverdue || daysUntilDue(loan.dueDate) < 0);
      })
      .sort((a, b) => daysUntilDue(a.dueDate) - daysUntilDue(b.dueDate));
  }, [loans, filter, onlyOverdue]);

  const overdueCount = loans.filter(
    (loan) => daysUntilDue(loan.dueDate) < 0,
  ).length;

  return (
    <PageContainer>
      <PageHeader
        title="Prêts & Retours"
        description="Traitez les nouveaux emprunts et gérez les prêts en cours."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:self-start">
          <RegisterLoanPanel onRegister={registerLoan} />
        </div>

        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="gap-3">
              <div className="min-w-0">
                <CardTitle>Emprunts en cours &amp; retours</CardTitle>
                <p className="mt-0.5 text-sm text-slate-500">
                  {loans.length} en cours de prêt
                  {overdueCount > 0 ? (
                    <>
                      {", "}
                      <span className="font-medium text-rose-600">
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
                  className="h-10 bg-slate-50 focus:bg-white sm:w-56"
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
