"use client";

import * as React from "react";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { Badge, bookStatusTone } from "@/components/ui/Badge";
import { BookCover } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/Card";
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/DropdownMenu";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import {
  EmptyState,
  PageContainer,
  PageHeader,
  TableScroll,
  Td,
  Th,
} from "@/components/ui/Page";
import {
  bookConditions,
  categories,
  initialBooks,
  libraryStats,
  type Book,
} from "@/lib/data";
import { getCoverByCategory } from "@/lib/covers";
import { bookService } from "@/services/bookService";

const PAGE_SIZE = 6;
const statuses: Book["status"][] = [
  "Disponible",
  "Emprunté",
  "Endommagé",
  "Perdu",
];

function normalizeBook(raw: any): Book {
  const category = raw.category || "Fiction";
  const cover = getCoverByCategory(category);
  const status =
    raw.status || (raw.is_borrowed ? "Emprunté" : "Disponible");

  return {
    ...raw,
    id: String(raw.id),
    title: raw.title || "Livre sans titre",
    author: raw.author || "Auteur inconnu",
    isbn: raw.isbn || "—",
    category,
    status,
    cover_color: raw.cover_color || raw.coverColor || cover.gradient,
    cover_accent: raw.cover_accent || raw.coverAccent || cover.accent,
    cover_emoji: raw.cover_emoji || raw.coverEmoji || cover.emoji,
    publication_year: raw.publication_year ?? raw.year ?? 2024,
    copies: raw.copies ?? 1,
    description: raw.description || "",
  };
}

function AddBookModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Partial<Book>) => Promise<void>;
}) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [isbn, setIsbn] = React.useState("");
  const [category, setCategory] = React.useState("Fiction");
  const [condition, setCondition] = React.useState("Neuf");
  const [year, setYear] = React.useState("2024");
  const [copies, setCopies] = React.useState("1");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("Fiction");
    setCondition("Neuf");
    setYear("2024");
    setCopies("1");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !author.trim() || !isbn.trim()) {
      setError("Veuillez remplir tous les champs obligatoires (Titre, Auteur, ISBN).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAdd({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category,
        publication_year: Number(year) || 2024,
        copies: Number(copies) || 1,
        status: "Disponible",
      });
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Impossible d'enregistrer le livre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Ajouter un nouveau livre"
      description="Créer une fiche de catalogue. L'ISBN doit être unique dans la bibliothèque."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} className="sm:w-auto" disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={() => handleSubmit()}
            className="sm:w-auto"
            disabled={isSubmitting || !title.trim() || !author.trim() || !isbn.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer le livre"
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {error && (
          <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Field label="Titre du livre" htmlFor="book-title" className="sm:col-span-2" required>
          <Input
            id="book-title"
            data-autofocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Le Grand Meaulnes"
          />
        </Field>

        <Field label="Auteur" htmlFor="book-author" required>
          <Input
            id="book-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Alain-Fournier"
          />
        </Field>

        <Field
          label="ISBN"
          htmlFor="book-isbn"
          hint="13 chiffres, tirets facultatifs."
          required
        >
          <Input
            id="book-isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="978-0000000000"
            className="font-mono"
          />
        </Field>

        <Field label="Catégorie" htmlFor="book-category" required>
          <Select
            id="book-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {getCoverByCategory(cat).emoji} {cat}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="État" htmlFor="book-condition" required>
          <Select
            id="book-condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {bookConditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Année de publication" htmlFor="book-year" optional>
          <Input
            id="book-year"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
          />
        </Field>

        <Field label="Nombre d'exemplaires" htmlFor="book-copies" optional>
          <Input
            id="book-copies"
            inputMode="numeric"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}

function EditBookModal({
  book,
  open,
  onClose,
  onSave,
}: {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Book>) => Promise<void>;
}) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [isbn, setIsbn] = React.useState("");
  const [category, setCategory] = React.useState("Fiction");
  const [status, setStatus] = React.useState<Book["status"]>("Disponible");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setIsbn(book.isbn || "");
      setCategory(book.category || "Fiction");
      setStatus(book.status || "Disponible");
      setError(null);
    }
  }, [book]);

  if (!book) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Le titre et l'auteur sont obligatoires.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(book.id, {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Échec de la modification du livre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier le livre"
      description={`Mettre à jour les informations du livre ${book.title}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="sm:w-auto">
            Annuler
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !title.trim() || !author.trim()}
            className="sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sauvegarde...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {error && (
          <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Field label="Titre du livre" htmlFor="edit-book-title" className="sm:col-span-2" required>
          <Input
            id="edit-book-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Auteur" htmlFor="edit-book-author" required>
          <Input
            id="edit-book-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Field>

        <Field label="ISBN" htmlFor="edit-book-isbn" required>
          <Input
            id="edit-book-isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="font-mono"
          />
        </Field>

        <Field label="Catégorie" htmlFor="edit-book-category" required>
          <Select
            id="edit-book-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {getCoverByCategory(cat).emoji} {cat}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Statut de disponibilité" htmlFor="edit-book-status" required>
          <Select
            id="edit-book-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Book["status"])}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
      </form>
    </Modal>
  );
}

function RowActions({
  title,
  onEdit,
  onDelete,
}: {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu
      label={`Actions pour ${title}`}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions pour ${title}`}
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
        </Button>
      }
    >
      <DropdownItem icon={Pencil} onSelect={onEdit}>
        Modifier les détails
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={Trash2} tone="danger" onSelect={onDelete}>
        Supprimer le livre
      </DropdownItem>
    </DropdownMenu>
  );
}

export function BookCatalogView() {
  const [books, setBooks] = React.useState<Book[]>(() => initialBooks.map(normalizeBook));
  const [totalCount, setTotalCount] = React.useState(initialBooks.length);
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadBooks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bookService.getBooksPaginated({
        search: query.trim() || undefined,
        category: category !== "all" ? category : undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });

      if (res && Array.isArray(res.items)) {
        const normalized = res.items.map(normalizeBook);
        setBooks(normalized);
        setTotalCount(res.total ?? normalized.length);
        return;
      }
    } catch (err) {
      // Fallback local filtering
      const needle = query.trim().toLowerCase();
      const filtered = initialBooks.filter((book) => {
        const matchesQuery =
          needle.length === 0 ||
          book.title.toLowerCase().includes(needle) ||
          book.author.toLowerCase().includes(needle) ||
          book.isbn.toLowerCase().includes(needle);
        const matchesCategory = category === "all" || book.category === category;
        const matchesStatus = status === "all" || book.status === status;
        return matchesQuery && matchesCategory && matchesStatus;
      });
      setBooks(filtered.map(normalizeBook));
      setTotalCount(filtered.length);
    } finally {
      setIsLoading(false);
    }
  }, [query, category, status, page]);

  React.useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleAddBook = async (data: Partial<Book>) => {
    try {
      const created = await bookService.createBook(data);
      const normalized = normalizeBook(created);
      setBooks((prev) => [normalized, ...prev]);
      setTotalCount((c) => c + 1);
      showNotification(`Le livre « ${normalized.title} » a été ajouté avec succès.`);
    } catch {
      // Local addition fallback
      const newBook: Book = normalizeBook({
        ...data,
        id: `BK-${Math.floor(Math.random() * 9000 + 1000)}`,
      });
      setBooks((prev) => [newBook, ...prev]);
      setTotalCount((c) => c + 1);
      showNotification(`Le livre « ${newBook.title} » a été enregistré localement.`);
    }
  };

  const handleSaveEdit = async (id: string, data: Partial<Book>) => {
    try {
      const updated = await bookService.updateBook(id, data);
      const normalized = normalizeBook(updated);
      setBooks((prev) => prev.map((b) => (b.id === id ? normalized : b)));
      showNotification(`Le livre « ${normalized.title} » a été mis à jour.`);
    } catch {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? normalizeBook({ ...b, ...data }) : b)),
      );
      showNotification(`Le livre a été mis à jour localement.`);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    const target = deletingBook;
    setDeletingBook(null);
    try {
      await bookService.deleteBook(target.id);
      setBooks((prev) => prev.filter((b) => b.id !== target.id));
      setTotalCount((c) => Math.max(0, c - 1));
      showNotification(`Le livre « ${target.title} » a été supprimé.`);
    } catch {
      setBooks((prev) => prev.filter((b) => b.id !== target.id));
      setTotalCount((c) => Math.max(0, c - 1));
      showNotification(`Le livre « ${target.title} » a été supprimé localement.`);
    }
  };

  // Determine visible items depending on client vs server pagination
  const visible = React.useMemo(() => {
    if (books.length <= PAGE_SIZE) {
      return books;
    }
    const safePage = Math.min(page, Math.max(1, Math.ceil(books.length / PAGE_SIZE)));
    return books.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [books, page]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const filtersActive =
    query.trim().length > 0 || category !== "all" || status !== "all";

  const allVisibleSelected =
    visible.length > 0 && visible.every((book) => selected.has(book.id));
  const someVisibleSelected =
    visible.some((book) => selected.has(book.id)) && !allVisibleSelected;

  const headerCheckbox = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckbox.current) {
      headerCheckbox.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const toggleAllVisible = () => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        visible.forEach((book) => next.delete(book.id));
      } else {
        visible.forEach((book) => next.add(book.id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setPage(1);
  };

  const rangeStart = totalCount === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(totalCount, (safePage - 1) * PAGE_SIZE + visible.length);

  return (
    <PageContainer>
      <PageHeader
        title="Catalogue de livres"
        description={`Gérez et suivez ${totalCount.toLocaleString("fr-FR")} livres dans votre bibliothèque.`}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="size-[1.125rem]" aria-hidden="true" />
            Ajouter un nouveau livre
          </Button>
        }
      />

      {feedbackMessage && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
          <Input
            leadingIcon={Search}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par titre, auteur ou ISBN..."
            aria-label="Rechercher dans le catalogue"
            className="bg-slate-50 dark:bg-[#111827] focus:bg-white dark:focus:bg-[#111827]"
          />

          <Select
            leadingIcon={SlidersHorizontal}
            value={category}
            aria-label="Filtrer par catégorie"
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            leadingIcon={SlidersHorizontal}
            value={status}
            aria-label="Filtrer par statut"
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tous les statuts</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Button
            variant="ghost"
            onClick={resetFilters}
            disabled={!filtersActive}
            className="justify-center sm:col-span-2 lg:col-span-1"
          >
            Réinitialiser les filtres
          </Button>
        </div>

        {selected.size > 0 ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50 dark:bg-blue-950/45 dark:border dark:border-blue-900/50 px-4 py-2.5">
            <p className="text-sm font-medium text-brand-800 dark:text-blue-300">
              {selected.size} {selected.size === 1 ? "livre sélectionné" : "livres sélectionnés"}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Désélectionner tout
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="size-8 animate-spin text-brand-600 dark:text-blue-400" />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Chargement du catalogue...
            </p>
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aucun livre ne correspond à ces filtres"
            description="Essayez un autre terme de recherche ou effacez les filtres pour voir tout le catalogue."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : (
          <>
            <TableScroll className="hidden md:block">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <thead className="bg-slate-50/60 dark:bg-[#131929]/80">
                  <tr>
                    <Th className="w-12 pl-6 pr-0 lg:pl-8">
                      <label className="-m-3 inline-flex cursor-pointer p-3">
                        <Checkbox
                          ref={headerCheckbox}
                          checked={allVisibleSelected}
                          onChange={toggleAllVisible}
                          aria-label="Sélectionner tous les livres sur cette page"
                        />
                      </label>
                    </Th>
                    <Th>Détails du livre</Th>
                    <Th>ISBN</Th>
                    <Th>Catégorie</Th>
                    <Th>Statut</Th>
                    <Th className="pr-6 text-right lg:pr-8">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#212B44]">
                  {visible.map((book) => (
                    <tr
                      key={book.id}
                      data-selected={selected.has(book.id)}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-[#1F2A40]/50 data-[selected=true]:bg-brand-50/40 dark:data-[selected=true]:bg-blue-950/40"
                    >
                      <Td className="pl-6 pr-0 lg:pl-8">
                        <label className="-m-3 inline-flex cursor-pointer p-3">
                          <Checkbox
                            checked={selected.has(book.id)}
                            onChange={() => toggleOne(book.id)}
                            aria-label={`Sélectionner ${book.title}`}
                          />
                        </label>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BookCover
                            title={book.title}
                            category={book.category}
                          />
                          <div className="min-w-0 max-w-[20rem]">
                            <p className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                              {book.title}
                            </p>
                            <p className="truncate text-sm text-slate-500 dark:text-[#94A3B8]">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap font-mono text-sm text-slate-600 dark:text-[#94A3B8]">
                        {book.isbn}
                      </Td>
                      <Td>
                        <Badge tone="neutral" className="gap-1.5 font-medium">
                          <span aria-hidden="true">{getCoverByCategory(book.category).emoji}</span>
                          <span>{book.category}</span>
                        </Badge>
                      </Td>
                      <Td>
                        <Badge tone={bookStatusTone[book.status]} dot>
                          {book.status}
                        </Badge>
                      </Td>
                      <Td className="pr-6 text-right lg:pr-8">
                        <RowActions
                          title={book.title}
                          onEdit={() => setEditingBook(book)}
                          onDelete={() => setDeletingBook(book)}
                        />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>

            <ul className="divide-y divide-slate-100 dark:divide-[#212B44] md:hidden">
              {visible.map((book) => (
                <li key={book.id} className="flex items-start gap-4 p-5">
                  <BookCover
                    title={book.title}
                    category={book.category}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-[#F3F4F6]">{book.title}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-[#94A3B8]">
                      {book.author}
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-400 dark:text-[#64748B]">
                      {book.isbn}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <Badge tone={bookStatusTone[book.status]} dot>
                        {book.status}
                      </Badge>
                      <Badge tone="neutral" className="gap-1.5 font-medium">
                        <span aria-hidden="true">{getCoverByCategory(book.category).emoji}</span>
                        <span>{book.category}</span>
                      </Badge>
                    </div>
                  </div>
                  <RowActions
                    title={book.title}
                    onEdit={() => setEditingBook(book)}
                    onDelete={() => setDeletingBook(book)}
                  />
                </li>
              ))}
            </ul>

            <CardFooter>
              <Pagination
                page={safePage}
                pageCount={pageCount}
                onPageChange={setPage}
                className="w-full"
                summary={
                  <>
                    Affichage de{" "}
                    <span className="font-medium text-slate-700 dark:text-[#F3F4F6]">
                      {rangeStart}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium text-slate-700 dark:text-[#F3F4F6]">
                      {rangeEnd}
                    </span>{" "}
                    sur{" "}
                    <span className="font-medium text-slate-700 dark:text-[#F3F4F6]">
                      {totalCount.toLocaleString("fr-FR")}
                    </span>{" "}
                    entrées
                  </>
                }
              />
            </CardFooter>
          </>
        )}
      </Card>

      <AddBookModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddBook}
      />

      <EditBookModal
        book={editingBook}
        open={editingBook !== null}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveEdit}
      />

      {deletingBook && (
        <Modal
          open={deletingBook !== null}
          onClose={() => setDeletingBook(null)}
          title="Confirmer la suppression"
          description={`Êtes-vous sûr de vouloir supprimer définitivement le livre « ${deletingBook.title} » ?`}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setDeletingBook(null)}
                className="sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteBook}
                className="bg-rose-600 hover:bg-rose-700 sm:w-auto"
              >
                Supprimer
              </Button>
            </>
          }
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Cette opération est irréversible. Le livre sera retiré du catalogue et ne sera plus disponible pour les nouveaux prêts.
          </p>
        </Modal>
      )}
    </PageContainer>
  );
}
