"use client";

import * as React from "react";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserMinus,
  Users,
  AlertCircle,
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
import { memberService } from "@/services/memberService";

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

function normalizeMember(raw: any): Member {
  const name = raw.name || raw.username || raw.full_name || raw.email || "Membre";
  const initials =
    raw.avatar ||
    name
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || (raw.gender === "M" ? "M" : "F");

  let role: Member["role"] = "Membre";
  if (raw.role) {
    if (typeof raw.role === "string") {
      role = raw.role;
    } else if (typeof raw.role === "object" && raw.role.name) {
      role = raw.role.name;
    }
  } else if (raw.role_id === 1) {
    role = "Admin";
  } else if (raw.role_id === 2) {
    role = "Bibliothécaire";
  }

  const loansCount =
    raw.active_loans_count ??
    raw.borrowedCount ??
    raw.borrowed_count ??
    0;

  return {
    ...raw,
    id: String(raw.id),
    name,
    email: raw.email || undefined,
    gender: raw.gender === "M" ? "M" : "F",
    role,
    created_at: raw.created_at || raw.joinDate || REFERENCE_DATE,
    joinDate: raw.joinDate || raw.created_at || REFERENCE_DATE,
    avatar: initials,
    active_loans_count: loansCount,
    borrowedCount: loansCount,
    is_active: raw.is_active ?? true,
  };
}

function EditMemberForm({
  member,
  onClose,
  onSave,
}: {
  member: Member;
  onClose: () => void;
  onSave: (updated: Member) => Promise<void>;
}) {
  const [name, setName] = React.useState(member.name);
  const [email, setEmail] = React.useState(member.email || "");
  const [gender, setGender] = React.useState<Member["gender"]>(member.gender || "F");
  const [role, setRole] = React.useState<Member["role"]>(member.role);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError("Le nom complet est obligatoire.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        ...member,
        name: name.trim(),
        email: email.trim() || undefined,
        gender,
        role,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Impossible de sauvegarder le membre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
            placeholder="usager@domaine.fr"
          />
        </Field>
      </div>

      <Field label="Rôle d'accès" htmlFor="edit-member-role" required>
        <Select
          id="edit-member-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Member["role"])}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="sm:w-auto">
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || !name.trim()} className="sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sauvegarde...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
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
  onSave: (updated: Member) => Promise<void>;
}) {
  if (!member) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier la fiche adhérent"
      description={`Mise à jour des coordonnées pour ${member.name}.`}
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
  onRegister: (member: Partial<Member>) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [gender, setGender] = React.useState<Member["gender"]>("F");
  const [role, setRole] = React.useState<Member["role"]>("Membre");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError("Le nom complet est obligatoire.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onRegister({
        name: name.trim(),
        email: email.trim() || undefined,
        gender,
        role,
      });
      setName("");
      setEmail("");
      setGender("F");
      setRole("Membre");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Impossible d'inscrire le membre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Inscrire un nouveau membre"
      description="Création d'une fiche d'adhérent dans la base du personnel."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="sm:w-auto">
            Annuler
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !name.trim()}
            className="sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Inscription...
              </>
            ) : (
              "Inscrire l'usager"
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Field label="Nom complet" htmlFor="new-member-name" required>
          <Input
            id="new-member-name"
            placeholder="Marguerite Duras ou Léo Martin"
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
              <option value="F">Féminin</option>
              <option value="M">Masculin</option>
            </Select>
          </Field>
          <Field label="Rôle initial" htmlFor="new-member-role" required>
            <Select
              id="new-member-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Member["role"])}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field
          label="Adresse e-mail"
          htmlFor="new-member-email"
          hint="Optionnel pour les enfants."
        >
          <Input
            id="new-member-email"
            type="email"
            placeholder="m.duras@agbale.org"
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
  const [members, setMembers] = React.useState<Member[]>(() => initialMembers.map(normalizeMember));
  const [totalCount, setTotalCount] = React.useState(initialMembers.length);
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [editingMember, setEditingMember] = React.useState<Member | null>(null);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadMembers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await memberService.getMembersPaginated({
        search: query.trim() || undefined,
        role: role !== "all" ? role : undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });

      if (res && Array.isArray(res.items)) {
        const normalized = res.items.map(normalizeMember);
        setMembers(normalized);
        setTotalCount(res.total ?? normalized.length);
        return;
      }
    } catch {
      // Local fallback
      const needle = query.trim().toLowerCase();
      const filtered = initialMembers.filter((m) => {
        const matchesQuery =
          needle.length === 0 ||
          m.name.toLowerCase().includes(needle) ||
          (m.email && m.email.toLowerCase().includes(needle));
        const matchesRole = role === "all" || m.role === role;
        return matchesQuery && matchesRole;
      });
      setMembers(filtered.map(normalizeMember));
      setTotalCount(filtered.length);
    } finally {
      setIsLoading(false);
    }
  }, [query, role, page]);

  React.useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleRegister = async (data: Partial<Member>) => {
    try {
      const created = await memberService.createMember(data);
      const normalized = normalizeMember(created);
      setMembers((prev) => [normalized, ...prev]);
      setTotalCount((c) => c + 1);
      showNotification(`Le membre « ${normalized.name} » a été inscrit.`);
    } catch {
      const initials =
        (data.name || "MB")
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

      const localMember: Member = normalizeMember({
        ...data,
        id: `MEM-${Math.floor(Math.random() * 9000 + 1000)}`,
        created_at: REFERENCE_DATE,
        joinDate: REFERENCE_DATE,
        avatar: initials,
        active_loans_count: 0,
        borrowedCount: 0,
      });

      setMembers((prev) => [localMember, ...prev]);
      setTotalCount((c) => c + 1);
      showNotification(`Le membre « ${localMember.name} » a été inscrit localement.`);
    }
  };

  const handleSaveMember = async (updated: Member) => {
    try {
      await memberService.updateMember(updated.id, updated);
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showNotification(`Coordonnées de « ${updated.name} » mises à jour.`);
    } catch {
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showNotification(`Coordonnées de « ${updated.name} » mises à jour localement.`);
    }
  };

  const handleToggleRole = async (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newRole: Member["role"] =
      target.role === "Membre" ? "Bibliothécaire" : "Membre";

    try {
      await memberService.updateMember(id, { role: newRole });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
      );
      showNotification(`Le rôle de ${target.name} a été changé en « ${newRole} ».`);
    } catch {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
      );
      showNotification(`Rôle modifié localement en « ${newRole} ».`);
    }
  };

  const visible = React.useMemo(() => {
    if (members.length <= PAGE_SIZE) {
      return members;
    }
    const safePage = Math.min(page, Math.max(1, Math.ceil(members.length / PAGE_SIZE)));
    return members.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [members, page]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const resetFilters = () => {
    setQuery("");
    setRole("all");
    setPage(1);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Répertoire des membres"
        description={`${totalCount.toLocaleString("fr-FR")} membres inscrits dans l'ensemble des registres.`}
        actions={
          <Button onClick={() => setShowRegisterModal(true)}>
            <Plus className="size-[1.125rem]" aria-hidden="true" />
            Inscrire un membre
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="size-8 animate-spin text-brand-600 dark:text-blue-400" />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Chargement des membres...
            </p>
          </div>
        ) : visible.length === 0 ? (
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
                          <span>{(member.active_loans_count ?? member.borrowedCount ?? 0)} / {maxBooks}</span>
                          {(member.active_loans_count ?? member.borrowedCount ?? 0) >= maxBooks ? (
                            <Badge tone="danger">Quota atteint</Badge>
                          ) : null}
                        </span>
                      </Td>
                      <Td className="whitespace-nowrap text-sm text-slate-600 dark:text-[#94A3B8]">
                        {formatJoinDate(member.created_at || member.joinDate || "")}
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
                        {(member.active_loans_count ?? member.borrowedCount ?? 0) >= maxBooks ? (
                          <Badge tone="danger">Quota atteint ({(member.active_loans_count ?? member.borrowedCount ?? 0)}/{maxBooks})</Badge>
                        ) : (
                          <Badge tone="neutral">{(member.active_loans_count ?? member.borrowedCount ?? 0)}/{maxBooks} empruntés</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-400 dark:text-[#64748B]">
                        Inscrit le {formatJoinDate(member.created_at || member.joinDate || "")} &middot;{" "}
                        {member.active_loans_count ?? member.borrowedCount ?? 0} en prêt
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
                summary={`${totalCount} membres enregistrés`}
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
