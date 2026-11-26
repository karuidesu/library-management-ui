"use client";

import * as React from "react";
import {
  ArrowRight,
  BookPlus,
  CalendarDays,
  CheckCircle2,
  Inbox,
  Loader2,
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
  type Book,
  type Member,
} from "@/lib/data";
import { getCoverByCategory } from "@/lib/covers";
import { loanService } from "@/services/loanService";
import { memberService } from "@/services/memberService";
import { bookService } from "@/services/bookService";

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeLoan(raw: any): ActiveLoan {
  const due = raw.due_date || raw.return_due_date || raw.dueDate || REFERENCE_DATE;
  const borrow = raw.borrow_date || raw.borrowDate || REFERENCE_DATE;
  const borrowerName = raw.borrower_name || raw.borrower || "Adhérent";
  const bookTitle = raw.book_title || raw.bookTitle || raw.book?.title || "Livre";
  const bookAuthor = raw.book_author || raw.bookAuthor || raw.book?.author || "Auteur";
  const bookCategory = raw.category || raw.book?.category || "Fiction";
  const coverStyle = getCoverByCategory(bookCategory);

  return {
    ...raw,
    id: String(raw.id),
    book_id: raw.book_id ?? raw.bookId ?? raw.book?.id,
    book_title: bookTitle,
    book_author: bookAuthor,
    category: bookCategory,
    cover_color: raw.cover_color || raw.coverColor || coverStyle.gradient,
    cover_emoji: raw.cover_emoji || raw.coverEmoji || coverStyle.emoji,
    member_id: raw.member_id ?? raw.memberId ?? raw.user_id,
    user_id: raw.user_id ?? raw.member_id ?? raw.memberId,
    borrower: borrowerName,
    borrower_name: borrowerName,
    borrower_initials: raw.borrower_initials || borrowerName.slice(0, 2).toUpperCase(),
    borrower_gender: raw.borrower_gender || raw.borrowerGender || "F",
    borrow_date: borrow,
    due_date: due,
    return_due_date: due,
    // camelCase
    bookId: raw.book_id ?? raw.bookId ?? raw.book?.id,
    bookTitle,
    bookAuthor,
    coverColor: raw.cover_color || raw.coverColor || coverStyle.gradient,
    coverEmoji: raw.cover_emoji || raw.coverEmoji || coverStyle.emoji,
    memberId: raw.member_id ?? raw.memberId ?? raw.user_id,
    borrowerInitials: raw.borrower_initials || borrowerName.slice(0, 2).toUpperCase(),
    borrowerGender: raw.borrower_gender || raw.borrowerGender || "F",
    borrowDate: borrow,
    dueDate: due,
  };
}

function RegisterLoanPanel({
  loans,
  onRegister,
  members,
  books,
  isRegistering,
}: {
  loans: ActiveLoan[];
  onRegister: (
    loan: ActiveLoan,
    meta: { userId: number | string; bookId: number | string; dueDate: string },
  ) => Promise<void>;
  members: Member[];
  books: Book[];
  isRegistering?: boolean;
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
    const sourceBooks = books.length > 0 ? books : initialBooks;
    return sourceBooks.map((b) => {
      const activeLoan = loans.find((l) => String(l.book_id ?? l.bookId) === String(b.id));
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
  }, [books, loans]);

  const ready = member !== null && book !== null;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!member || !book) return;

    const sourceBooks = books.length > 0 ? books : initialBooks;
    const record = sourceBooks.find((item) => String(item.id) === book.id);
    const person = members.find((item) => String(item.id) === member.id);
    if (!record || !person) return;

    const coverStyle = getCoverByCategory(record.category);
    const newLoan: ActiveLoan = {
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
    };

    await onRegister(newLoan, {
      userId: person.id,
      bookId: record.id,
      dueDate,
    });

    setConfirmation(
      `L'emprunt de « ${record.title} » par ${person.name} a été enregistré jusqu'au ${formatDate(dueDate)}.`,
    );
    setBook(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-blue-950/60 dark:text-blue-400">
          <BookPlus className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-[#F3F4F6]">
            Enregistrer un emprunt
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Sélectionnez l&apos;adhérent et l&apos;ouvrage disponible
          </p>
        </div>
      </div>

      {confirmation ? (
        <div
          role="status"
          className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-semibold">Prêt enregistré !</p>
            <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">
              {confirmation}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmation(null)}
            className="text-xs font-semibold text-emerald-700 underline dark:text-emerald-400"
          >
            Fermer
          </button>
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="Adhérent emprunteur" htmlFor="borrow-member" required>
          <Combobox
            id="borrow-member"
            options={memberOptions}
            value={member}
            onChange={(opt) => {
              setMember(opt);
              setConfirmation(null);
            }}
            placeholder="Rechercher par nom ou e-mail..."
            emptyMessage="Aucun adhérent trouvé."
            leadingIcon={User}
          />
        </Field>

        <Field label="Livre à emprunter" htmlFor="borrow-book" required>
          <Combobox
            id="borrow-book"
            options={bookOptions}
            value={book}
            onChange={(opt) => {
              setBook(opt);
              setConfirmation(null);
            }}
            placeholder="Rechercher par titre, auteur ou ISBN..."
            emptyMessage="Aucun livre trouvé."
            leadingIcon={Search}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Durée standard" htmlFor="preset-duration">
            <Select
              id="preset-duration"
              value={duration}
              onChange={(e) => applyDuration(e.target.value)}
            >
              {loanDurations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Date d'échéance" htmlFor="custom-due-date" required>
            <Input
              id="custom-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setDuration("custom");
              }}
              min={REFERENCE_DATE}
              leadingIcon={CalendarDays}
            />
          </Field>
        </div>

        {ready ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 dark:border-[#212B44] dark:bg-[#131929] dark:text-[#94A3B8]">
            <p className="font-semibold text-slate-800 dark:text-[#F3F4F6]">
              Résumé de la transaction
            </p>
            <p className="mt-1">
              <span className="font-medium text-slate-900 dark:text-white">
                {member?.label}
              </span>{" "}
              emprunte « {book?.label} ».
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-[#94A3B8]">
              Retour prévu le{" "}
              <strong className="text-slate-900 dark:text-white">
                {formatDate(dueDate)}
              </strong>
              .
            </p>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={!ready || isRegistering}
          className="w-full"
        >
          {isRegistering ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Validation du prêt...
            </>
          ) : (
            <>
              Valider l&apos;emprunt
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}

function LoanRow({
  loan,
  onReturn,
  isReturning,
}: {
  loan: ActiveLoan;
  onReturn: (id: string | number) => Promise<void>;
  isReturning?: boolean;
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
          disabled={isReturning}
          aria-label={`Enregistrer le retour de ${book_title}, emprunté par ${borrower}`}
          className="hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
        >
          {isReturning ? "Retour..." : "Enregistrer le retour"}
        </Button>
      </div>
    </li>
  );
}

export function BorrowReturnView() {
  const [loans, setLoans] = React.useState<ActiveLoan[]>(() => seedLoans.map(normalizeLoan));
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [books, setBooks] = React.useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [returningId, setReturningId] = React.useState<string | number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const [filter, setFilter] = React.useState("");
  const [onlyOverdue, setOnlyOverdue] = React.useState(false);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [loansRes, membersRes, booksRes] = await Promise.allSettled([
        loanService.getLoans({ is_active: true }),
        memberService.getMembers(),
        bookService.getBooks(),
      ]);

      if (loansRes.status === "fulfilled" && Array.isArray(loansRes.value) && loansRes.value.length > 0) {
        setLoans(loansRes.value.map(normalizeLoan));
      }
      if (membersRes.status === "fulfilled" && Array.isArray(membersRes.value) && membersRes.value.length > 0) {
        setMembers(membersRes.value);
      }
      if (booksRes.status === "fulfilled" && Array.isArray(booksRes.value) && booksRes.value.length > 0) {
        setBooks(booksRes.value);
      }
    } catch {
      // Keep initial seed data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const registerLoan = React.useCallback(
    async (
      loan: ActiveLoan,
      meta: { userId: number | string; bookId: number | string; dueDate: string },
    ) => {
      try {
        setIsRegistering(true);
        const uid = Number(meta.userId);
        const bid = Number(meta.bookId);
        if (!Number.isNaN(uid) && !Number.isNaN(bid)) {
          await loanService.borrowBook({
            user_id: uid,
            book_id: bid,
            return_due_date: meta.dueDate,
          });
        }
        setLoans((current) => [loan, ...current]);
        const memberId = loan.member_id ?? loan.memberId;
        setMembers((current) =>
          current.map((m) =>
            String(m.id) === String(memberId)
              ? {
                  ...m,
                  active_loans_count: (m.active_loans_count ?? m.borrowedCount ?? 0) + 1,
                  borrowedCount: (m.borrowedCount ?? m.active_loans_count ?? 0) + 1,
                }
              : m,
          ),
        );
        showNotification(`Emprunt enregistré.`);
      } catch {
        // Fallback local
        setLoans((current) => [loan, ...current]);
        const memberId = loan.member_id ?? loan.memberId;
        setMembers((current) =>
          current.map((m) =>
            String(m.id) === String(memberId)
              ? {
                  ...m,
                  active_loans_count: (m.active_loans_count ?? m.borrowedCount ?? 0) + 1,
                  borrowedCount: (m.borrowedCount ?? m.active_loans_count ?? 0) + 1,
                }
              : m,
          ),
        );
        showNotification(`Emprunt enregistré localement.`);
      } finally {
        setIsRegistering(false);
      }
    },
    [],
  );

  const returnLoan = React.useCallback(async (id: string | number) => {
    setReturningId(id);
    const target = loans.find((l) => String(l.id) === String(id));
    try {
      if (target) {
        const lid = Number(target.id);
        const bid = Number(target.book_id ?? target.bookId);
        await loanService.returnBook({
          loan_id: !Number.isNaN(lid) ? lid : undefined,
          book_id: !Number.isNaN(bid) ? bid : undefined,
        });
      }
      setLoans((current) => current.filter((loan) => String(loan.id) !== String(id)));
      if (target) {
        const memberId = target.member_id ?? target.memberId;
        setMembers((prev) =>
          prev.map((m) =>
            String(m.id) === String(memberId)
              ? {
                  ...m,
                  active_loans_count: Math.max(0, (m.active_loans_count ?? m.borrowedCount ?? 1) - 1),
                  borrowedCount: Math.max(0, (m.borrowedCount ?? m.active_loans_count ?? 1) - 1),
                }
              : m,
          ),
        );
      }
      showNotification(`Retour validé.`);
    } catch {
      setLoans((current) => current.filter((loan) => String(loan.id) !== String(id)));
      if (target) {
        const memberId = target.member_id ?? target.memberId;
        setMembers((prev) =>
          prev.map((m) =>
            String(m.id) === String(memberId)
              ? {
                  ...m,
                  active_loans_count: Math.max(0, (m.active_loans_count ?? m.borrowedCount ?? 1) - 1),
                  borrowedCount: Math.max(0, (m.borrowedCount ?? m.active_loans_count ?? 1) - 1),
                }
              : m,
          ),
        );
      }
      showNotification(`Retour validé localement.`);
    } finally {
      setReturningId(null);
    }
  }, [loans]);

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

      {feedbackMessage && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:self-start">
          <RegisterLoanPanel
            loans={loans}
            onRegister={registerLoan}
            members={members}
            books={books}
            isRegistering={isRegistering}
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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="size-7 animate-spin text-brand-600 dark:text-blue-400" />
                <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Chargement des emprunts...
                </p>
              </div>
            ) : visible.length === 0 ? (
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
                  <LoanRow
                    key={loan.id}
                    loan={loan}
                    onReturn={returnLoan}
                    isReturning={returningId === loan.id}
                  />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
