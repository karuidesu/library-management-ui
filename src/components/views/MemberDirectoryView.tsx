"use client";

import * as React from "react";
import {
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserMinus,
  Users,
} from "lucide-react";
import { Badge, roleTone } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
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
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { initialMembers, libraryStats, REFERENCE_DATE, type Member } from "@/lib/data";

const PAGE_SIZE = 6;
const roles: Member["role"][] = ["Admin", "Bibliothécaire", "Membre"];

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatJoinDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}

function EditMemberForm({
  member,
  onClose,
  onSave,
}: {
  member: Member;
  onClose: () => void;
  onSave: (updated: Member) => void;
}) {
  const [name, setName] = React.useState(member.name);
  const [email, setEmail] = React.useState(member.email || "");
  const [gender, setGender] = React.useState<Member["gender"]>(member.gender || "F");
  const [role, setRole] = React.useState<Member["role"]>(member.role);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...member,
      name: name.trim(),
      email: email.trim() || undefined,
      gender,
      role,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nom complet" htmlFor="edit-member-name" required>
        <Input
          id="edit-member-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-autofocus
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Sexe" htmlFor="edit-member-gender" required>
          <Select
            id="edit-member-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Member["gender"])}
          >
            <option value="F">Féminin (Femme / Fille)</option>
            <option value="M">Masculin (Homme / Garçon)</option>
          </Select>
        </Field>
        <Field
          label="Adresse e-mail"
          htmlFor="edit-member-email"
          hint="Optionnel pour les enfants."
        >
          <Input
            id="edit-member-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optionnel pour les enfants"
          />
        </Field>
      </div>
      <Field label="Rôle dans la bibliothèque" htmlFor="edit-member-role" required>
        <Select
          id="edit-member-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Member["role"])}
        >
          <option value="Membre">Membre standard</option>
          <option value="Bibliothécaire">Bibliothécaire</option>
          <option value="Admin">Administrateur</option>
        </Select>
      </Field>
      <div className="flex justify-end gap-3 pt-3">
        <Button variant="ghost" onClick={onClose} className="sm:w-auto">
          Annuler
        </Button>
        <Button type="submit" disabled={!name.trim()} className="sm:w-auto">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}

function EditMemberModal({
  member,
  open,
  onClose,
  onSave,
}: {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Member) => void;
}) {
  if (!member) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier l'usager"
      description={`Mettre à jour les privilèges et coordonnées de ${member.name}.`}
    >
      <EditMemberForm
        key={member.id}
        member={member}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

function RegisterMemberModal({
  open,
  onClose,
  onRegister,
}: {
  open: boolean;
  onClose: () => void;
  onRegister: (member: Member) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [gender, setGender] = React.useState<Member["gender"]>("F");
  const [role, setRole] = React.useState<Member["role"]>("Membre");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const initials =
      name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || (gender === "F" ? "F" : "M");

    const newMember: Member = {
      id: `MEM-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: name.trim(),
      email: email.trim() || undefined,
      gender,
      role,
      joinDate: REFERENCE_DATE,
      avatar: initials,
      borrowedCount: 0,
    };

    onRegister(newMember);
    setName("");
    setEmail("");
    setGender("F");
    setRole("Membre");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Inscrire un nouveau membre"
      description="Création d'une fiche d'adhérent dans la base du personnel."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="sm:w-auto">
            Annuler
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={!name.trim()}
            className="sm:w-auto"
          >
            Inscrire l&apos;usager
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nom complet" htmlFor="new-member-name" required>
          <Input
            id="new-member-name"
            placeholder=" Marguerite Duras ou Léo Martin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-autofocus
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Sexe" htmlFor="new-member-gender" required>
            <Select
              id="new-member-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Member["gender"])}
            >
              <option value="F">Feminin</option>
              <option value="M">Masculin</option>
            </Select>
          </Field>
          <Field label="Rôle initial" htmlFor="new-member-role" required>
            <Select
              id="new-member-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Member["role"])}
            >
              <option value="Membre">Membre standard</option>
              <option value="Bibliothécaire">Bibliothécaire</option>
              <option value="Admin">Administrateur</option>
            </Select>
          </Field>
        </div>
        <Field
          label="Adresse e-mail"
          htmlFor="new-member-email"
          hint="Non obligatoire, notamment pour les enfants ou usagers sans boîte mail."
        >
          <Input
            id="new-member-email"
            type="email"
            placeholder=" adresse@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}

export function MemberDirectoryView() {
  const { maxBooks } = useLibrarySettings();
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [editingMember, setEditingMember] = React.useState<Member | null>(null);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery =
        needle.length === 0 ||
        member.name.toLowerCase().includes(needle) ||
        (member.email ? member.email.toLowerCase().includes(needle) : false);
      return matchesQuery && (role === "all" || member.role === role);
    });
  }, [members, query, role]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const resetFilters = () => {
    setQuery("");
    setRole("all");
    setPage(1);
  };

  const handleToggleRole = (id: string) => {
    setMembers((current) =>
      current.map((m) => {
        if (m.id !== id) return m;
        const newRole: Member["role"] =
          m.role === "Membre" ? "Bibliothécaire" : "Membre";
        return { ...m, role: newRole };
      }),
    );
  };

  const handleSaveMember = (updated: Member) => {
    setMembers((current) =>
      current.map((m) => (m.id === updated.id ? updated : m)),
    );
  };

  const handleRegister = (newMember: Member) => {
    setMembers((current) => [newMember, ...current]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Répertoire des membres"
        description={`${libraryStats.activeMembers.toLocaleString("fr-FR")} membres inscrits dans l'ensemble des registres.`}
        actions={
          <Button onClick={() => setShowRegisterModal(true)}>
            <Plus className="size-[1.125rem]" aria-hidden="true" />
            Inscrire un membre
          </Button>
        }
      />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <Input
            leadingIcon={Search}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher des membres par nom ou e-mail..."
            aria-label="Rechercher des membres"
            className="bg-slate-50 dark:bg-[#111827] focus:bg-white dark:focus:bg-[#111827]"
          />
          <Select
            leadingIcon={SlidersHorizontal}
            value={role}
            aria-label="Filtrer par rôle"
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tous les rôles</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun membre ne correspond à ces filtres"
            description="Essayez un autre nom ou e-mail, ou effacez les filtres."
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
                    <Th className="px-6 lg:px-8">Membre</Th>
                    <Th>Rôle</Th>
                    <Th className="text-right">Livres empruntés</Th>
                    <Th>Inscrit(e)</Th>
                    <Th className="pr-6 text-right lg:pr-8">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#212B44]">
                  {visible.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-[#1F2A40]/50"
                    >
                      <Td className="px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                          <Avatar
                            name={member.name}
                            gender={member.gender}
                            size="xl"
                          />
                          <div className="min-w-0 max-w-[18rem]">
                            <p className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                              {member.name}
                            </p>
                            <p className="truncate text-sm text-slate-500 dark:text-[#94A3B8]">
                              {member.email || (
                                <span className="italic text-slate-400 dark:text-slate-500">
                                  Sans e-mail (Enfant)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                      </Td>
                      <Td className="text-right font-medium text-slate-700 dark:text-[#E2E8F0] tabular-nums">
                        <span className="inline-flex items-center justify-end gap-2">
                          <span>{member.borrowedCount} / {maxBooks}</span>
                          {member.borrowedCount >= maxBooks ? (
                            <Badge tone="danger">Quota atteint</Badge>
                          ) : null}
                        </span>
                      </Td>
                      <Td className="whitespace-nowrap text-sm text-slate-600 dark:text-[#94A3B8]">
                        {formatJoinDate(member.joinDate)}
                      </Td>
                      <Td className="pr-6 text-right lg:pr-8">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingMember(member)}
                            className="h-8 w-24 justify-center gap-1.5 px-2.5 text-xs text-slate-700 dark:text-[#F3F4F6] hover:text-slate-900 dark:hover:bg-[#2E3E5A]"
                            title="Modifier les coordonnées et le statut"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                            Modifier
                          </Button>
                          {member.role === "Membre" ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleToggleRole(member.id)}
                              className="h-8 w-44 justify-center gap-1.5 px-2.5 text-xs text-brand-700 dark:text-blue-400 hover:bg-brand-50 dark:hover:bg-blue-950/40 dark:border-[#2D3B55]"
                              title="Nommer gestionnaire (Bibliothécaire)"
                            >
                              <ShieldCheck className="size-3.5" aria-hidden="true" />
                              Nommer gestionnaire
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleRole(member.id)}
                              className="h-8 w-44 justify-center gap-1.5 px-2.5 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              title="Retirer les droits de gestionnaire"
                            >
                              <UserMinus className="size-3.5" aria-hidden="true" />
                              Retirer rôle
                            </Button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>

            <ul className="divide-y divide-slate-100 dark:divide-[#212B44] md:hidden">
              {visible.map((member) => (
                <li key={member.id} className="flex flex-col gap-3 p-5">
                  <div className="flex items-start gap-4">
                    <Avatar
                      name={member.name}
                      gender={member.gender}
                      size="xl"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-[#F3F4F6]">
                        {member.name}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-[#94A3B8]">
                        {member.email || (
                          <span className="italic text-slate-400 dark:text-slate-500">
                            Sans e-mail (Enfant)
                          </span>
                        )}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                        {member.borrowedCount >= maxBooks ? (
                          <Badge tone="danger">Quota atteint ({member.borrowedCount}/{maxBooks})</Badge>
                        ) : (
                          <Badge tone="neutral">{member.borrowedCount}/{maxBooks} empruntés</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-400 dark:text-[#64748B]">
                        Inscrit le {formatJoinDate(member.joinDate)} &middot;{" "}
                        {member.borrowedCount} en prêt
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-[#212B44] pt-2.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMember(member)}
                      className="h-8 w-24 justify-center gap-1.5 px-2.5 text-xs text-slate-700 dark:text-[#F3F4F6]"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Modifier
                    </Button>
                    {member.role === "Membre" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleRole(member.id)}
                        className="h-8 w-44 justify-center gap-1.5 px-2.5 text-xs text-brand-700 dark:text-blue-400 hover:bg-brand-50 dark:hover:bg-blue-950/40 dark:border-[#2D3B55]"
                      >
                        <ShieldCheck className="size-3.5" aria-hidden="true" />
                        Nommer gestionnaire
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRole(member.id)}
                        className="h-8 w-44 justify-center gap-1.5 px-2.5 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <UserMinus className="size-3.5" aria-hidden="true" />
                        Retirer rôle
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <CardFooter>
              <Pagination
                page={safePage}
                pageCount={pageCount}
                onPageChange={setPage}
                className="w-full"
                summary={`${filtered.length} sur ${members.length} membres affichés`}
              />
            </CardFooter>
          </>
        )}
      </Card>

      <EditMemberModal
        member={editingMember}
        open={editingMember !== null}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveMember}
      />

      <RegisterMemberModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
    </PageContainer>
  );
}
