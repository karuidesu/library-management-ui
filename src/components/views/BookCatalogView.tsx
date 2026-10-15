"use client";

import * as React from "react";
import {
  BookOpen,
  Copy,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  MoreHorizontal,
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
  categoryEmojis,
  initialBooks,
  libraryStats,
  type Book,
} from "@/lib/data";
import { getCoverByCategory } from "@/lib/covers";

const PAGE_SIZE = 6;
const statuses: Book["status"][] = [
  "Disponible",
  "Emprunté",
  "Endommagé",
  "Perdu",
];

function AddBookModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter un nouveau livre"
      description="Créer une fiche de catalogue. L'ISBN doit être unique dans la bibliothèque."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="sm:w-auto">
            Annuler
          </Button>
          <Button onClick={onClose} className="sm:w-auto">
            Enregistrer le livre
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Titre du livre" htmlFor="book-title" className="sm:col-span-2" required>
          <Input
            id="book-title"
            data-autofocus
            placeholder=" Le Grand Meaulnes"
          />
        </Field>

        <Field label="Auteur" htmlFor="book-author" required>
          <Input id="book-author" placeholder=" Alain-Fournier" />
        </Field>

        <Field
          label="ISBN"
          htmlFor="book-isbn"
          hint="13 chiffres, tirets facultatifs."
          required
        >
          <Input
            id="book-isbn"
            inputMode="numeric"
            placeholder="978-0000000000"
            className="font-mono"
          />
        </Field>

        <Field label="Catégorie" htmlFor="book-category" required>
          <Select id="book-category" defaultValue="Fiction">
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCoverByCategory(category).emoji} {category}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="État" htmlFor="book-condition" required>
          <Select id="book-condition" defaultValue="Neuf">
            {bookConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Année de publication" htmlFor="book-year" optional>
          <Input id="book-year" inputMode="numeric" placeholder="2024" />
        </Field>

        <Field label="Nombre d'exemplaires" htmlFor="book-copies" optional>
          <Input id="book-copies" inputMode="numeric" defaultValue="1" />
        </Field>
      </form>
    </Modal>
  );
}

function RowActions({ title }: { title: string }) {
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
      <DropdownItem icon={Pencil}>Modifier les détails</DropdownItem>
      <DropdownItem icon={Copy}>Dupliquer la fiche</DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={Trash2} tone="danger">
        Supprimer le livre
      </DropdownItem>
    </DropdownMenu>
  );
}

export function BookCatalogView() {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initialBooks.filter((book) => {
      const matchesQuery =
        needle.length === 0 ||
        book.title.toLowerCase().includes(needle) ||
        book.author.toLowerCase().includes(needle) ||
        book.isbn.toLowerCase().includes(needle);
      const matchesCategory = category === "all" || book.category === category;
      const matchesStatus = status === "all" || book.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [query, category, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

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

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = (safePage - 1) * PAGE_SIZE + visible.length;

  return (
    <PageContainer>
      <PageHeader
        title="Catalogue de livres"
        description={`Gérez et suivez ${libraryStats.totalBooks.toLocaleString("fr-FR")} livres dans votre bibliothèque.`}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="size-[1.125rem]" aria-hidden="true" />
            Ajouter un nouveau livre
          </Button>
        }
      />

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
        {filtered.length === 0 ? (
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
                        <RowActions title={book.title} />
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
                  <RowActions title={book.title} />
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
                      {filtered.length.toLocaleString("fr-FR")}
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
      />
    </PageContainer>
  );
}
