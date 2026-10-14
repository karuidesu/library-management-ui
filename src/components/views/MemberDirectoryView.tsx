"use client";

import * as React from "react";
import {
  Mail,
  MoreHorizontal,
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
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/DropdownMenu";
import { Input, Select } from "@/components/ui/Field";
import { Pagination } from "@/components/ui/Pagination";
import {
  EmptyState,
  PageContainer,
  PageHeader,
  TableScroll,
  Td,
  Th,
} from "@/components/ui/Page";
import { initialMembers, libraryStats, type Member } from "@/lib/data";

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

function RowActions({ name }: { name: string }) {
  return (
    <DropdownMenu
      label={`Actions pour ${name}`}
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${name}`}>
          <MoreHorizontal className="size-5" aria-hidden="true" />
        </Button>
      }
    >
      <DropdownItem icon={Pencil}>Modifier le membre</DropdownItem>
      <DropdownItem icon={Mail}>Envoyer un e-mail</DropdownItem>
      <DropdownItem icon={ShieldCheck}>Changer de rôle</DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={UserMinus} tone="danger">
        Désactiver
      </DropdownItem>
    </DropdownMenu>
  );
}

export function MemberDirectoryView() {
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initialMembers.filter((member) => {
      const matchesQuery =
        needle.length === 0 ||
        member.name.toLowerCase().includes(needle) ||
        member.email.toLowerCase().includes(needle);
      return matchesQuery && (role === "all" || member.role === role);
    });
  }, [query, role]);

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

  return (
    <PageContainer>
      <PageHeader
        title="Répertoire des membres"
        description={`${libraryStats.activeMembers.toLocaleString("fr-FR")} membres inscrits dans toutes les succursales.`}
        actions={
          <Button>
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
            className="bg-slate-50 focus:bg-white"
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
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead className="bg-slate-50/60">
                  <tr>
                    <Th className="px-6 lg:px-8">Membre</Th>
                    <Th>Rôle</Th>
                    <Th className="text-right">En prêt</Th>
                    <Th>Inscrit(e)</Th>
                    <Th>Statut</Th>
                    <Th className="pr-6 text-right lg:pr-8">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <Td className="px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                          <Avatar
                            name={member.name}
                            initials={member.avatar}
                            size="xl"
                          />
                          <div className="min-w-0 max-w-[18rem]">
                            <p className="truncate font-semibold text-slate-900">
                              {member.name}
                            </p>
                            <p className="truncate text-sm text-slate-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                      </Td>
                      <Td className="text-right font-medium text-slate-700 tabular-nums">
                        {member.borrowedCount}
                      </Td>
                      <Td className="whitespace-nowrap text-sm text-slate-600">
                        {formatJoinDate(member.joinDate)}
                      </Td>
                      <Td>
                        <Badge
                          tone={member.status === "Actif" ? "success" : "neutral"}
                          dot
                        >
                          {member.status}
                        </Badge>
                      </Td>
                      <Td className="pr-6 text-right lg:pr-8">
                        <RowActions name={member.name} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>

            <ul className="divide-y divide-slate-100 md:hidden">
              {visible.map((member) => (
                <li key={member.id} className="flex items-start gap-4 p-5">
                  <Avatar
                    name={member.name}
                    initials={member.avatar}
                    size="xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {member.name}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {member.email}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                      <Badge
                        tone={member.status === "Actif" ? "success" : "neutral"}
                        dot
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Inscrit le {formatJoinDate(member.joinDate)} &middot;{" "}
                      {member.borrowedCount} en prêt
                    </p>
                  </div>
                  <RowActions name={member.name} />
                </li>
              ))}
            </ul>

            <CardFooter>
              <Pagination
                page={safePage}
                pageCount={pageCount}
                onPageChange={setPage}
                className="w-full"
                summary={`${filtered.length} sur ${initialMembers.length} membres affichés`}
              />
            </CardFooter>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
