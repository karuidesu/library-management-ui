"use client";

import * as React from "react";
import { Bell, Building2, CreditCard, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { PageContainer, PageHeader } from "@/components/ui/Page";
import { currentUser, loanDurations } from "@/lib/data";

const sections = [
  { id: "profile", label: "Profil", icon: User },
  { id: "library", label: "Bibliothèque", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: ShieldCheck },
  { id: "billing", label: "Facturation", icon: CreditCard },
] as const;

type SectionId = (typeof sections)[number]["id"];

function ToggleRow({
  id,
  title,
  description,
  defaultChecked = false,
}: {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
    >
      <Checkbox id={id} defaultChecked={defaultChecked} className="mt-0.5" />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-900">
          {title}
        </span>
        <span className="mt-0.5 block text-sm text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Profil</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Comment vous apparaissez aux autres bibliothécaires.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            name={currentUser.name}
            initials={currentUser.avatar}
            size="xl"
            className="size-16 text-lg"
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-sm text-slate-500">{currentUser.role}</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto">
            Changer la photo
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nom complet" htmlFor="settings-name">
            <Input id="settings-name" defaultValue={currentUser.name} />
          </Field>
          <Field label="Adresse e-mail" htmlFor="settings-email">
            <Input
              id="settings-email"
              type="email"
              defaultValue={currentUser.email}
            />
          </Field>
          <Field label="Rôle" htmlFor="settings-role">
            <Select id="settings-role" defaultValue="Bibliothécaire">
              <option>Admin</option>
              <option>Bibliothécaire</option>
              <option>Membre</option>
            </Select>
          </Field>
          <Field label="Langue" htmlFor="settings-language">
            <Select id="settings-language" defaultValue="fr">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </Select>
          </Field>
        </div>
      </div>
    </Card>
  );
}

function LibrarySection() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Bibliothèque &amp; prêts</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Valeurs par défaut appliquées à chaque nouvel emprunt.
          </p>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Nom de la bibliothèque" htmlFor="settings-library">
          <Input id="settings-library" defaultValue="Bibliothèque Publique Centrale" />
        </Field>
        <Field label="Durée de prêt par défaut" htmlFor="settings-loan-period">
          <Select id="settings-loan-period" defaultValue="14">
            {loanDurations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Nombre maximal de livres par membre"
          htmlFor="settings-max-books"
          hint="Les bibliothécaires peuvent modifier cette limite par membre."
        >
          <Input id="settings-max-books" inputMode="numeric" defaultValue="5" />
        </Field>
        <Field
          label="Frais de retard par jour"
          htmlFor="settings-late-fee"
          hint="Définir à 0 pour désactiver les frais de retard."
        >
          <Input id="settings-late-fee" inputMode="decimal" defaultValue="0.25" />
        </Field>
      </div>
    </Card>
  );
}

function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Notifications</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Choisissez ce dont Agbale vous informe.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-3 p-6 sm:p-8">
        <ToggleRow
          id="notify-overdue"
          title="Rappels de retard"
          description="Envoyer un e-mail aux membres le jour où un prêt arrive à échéance."
          defaultChecked
        />
        <ToggleRow
          id="notify-due-soon"
          title="Rappels d'échéance proche"
          description="Envoyer un e-mail aux membres deux jours avant l'échéance."
          defaultChecked
        />
        <ToggleRow
          id="notify-registrations"
          title="Nouvelles inscriptions"
          description="M'avertir lorsqu'un membre s'inscrit et nécessite une validation."
          defaultChecked
        />
        <ToggleRow
          id="notify-digest"
          title="Récapitulatif hebdomadaire"
          description="Un résumé du lundi sur les emprunts, retours et retards."
        />
      </div>
    </Card>
  );
}

function SecuritySection() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Sécurité</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Protégez l&apos;accès à votre espace.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Mot de passe actuel" htmlFor="settings-current-password">
            <Input
              id="settings-current-password"
              type="password"
              autoComplete="current-password"
            />
          </Field>
          <Field
            label="Nouveau mot de passe"
            htmlFor="settings-new-password"
            hint="Au moins 12 caractères."
          >
            <Input
              id="settings-new-password"
              type="password"
              autoComplete="new-password"
            />
          </Field>
        </div>
        <ToggleRow
          id="security-2fa"
          title="Authentification à deux facteurs"
          description="Exiger un code unique d'une application d'authentification lors de la connexion."
          defaultChecked
        />
        <ToggleRow
          id="security-sessions"
          title="Déconnecter les autres sessions"
          description="Mettre fin à toutes les sessions sauf celle-ci lors du prochain enregistrement."
        />
      </div>
    </Card>
  );
}

function BillingSection() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Facturation</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Détails du forfait et du paiement pour cette bibliothèque.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-50 p-5">
          <div className="min-w-0">
            <p className="font-semibold text-brand-900">Forfait Institution</p>
            <p className="mt-0.5 text-sm text-brand-800/80">
              Jusqu&apos;à 50 000 titres et nombre illimité de bibliothécaires.
            </p>
          </div>
          <Button variant="secondary" className="shrink-0 bg-white">
            Changer de forfait
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="E-mail de facturation" htmlFor="settings-billing-email">
            <Input
              id="settings-billing-email"
              type="email"
              defaultValue="comptabilite@bibliotheque.org"
            />
          </Field>
          <Field label="Cycle de facturation" htmlFor="settings-cycle">
            <Select id="settings-cycle" defaultValue="annual">
              <option value="monthly">Mensuel</option>
              <option value="annual">Annuel (deux mois offerts)</option>
            </Select>
          </Field>
        </div>
      </div>
    </Card>
  );
}

const panels: Record<SectionId, React.ComponentType> = {
  profile: ProfileSection,
  library: LibrarySection,
  notifications: NotificationsSection,
  security: SecuritySection,
  billing: BillingSection,
};

export function SettingsView() {
  const [active, setActive] = React.useState<SectionId>("profile");
  const Panel = panels[active];

  return (
    <PageContainer>
      <PageHeader
        title="Paramètres"
        description="Gérez votre profil, vos règles de prêt et les préférences de l'espace."
        actions={
          <>
            <Button variant="ghost">Annuler</Button>
            <Button>Enregistrer les modifications</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <nav aria-label="Sections des paramètres" className="lg:col-span-3">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)] lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {sections.map((section) => {
              const Icon = section.icon;
              const selected = section.id === active;
              return (
                <li key={section.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(section.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium",
                      "outline-none transition-colors focus-visible:ring-4 focus-visible:ring-brand-600/20",
                      selected
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[1.125rem] shrink-0",
                        selected ? "text-white" : "text-slate-400",
                      )}
                      aria-hidden="true"
                    />
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 lg:col-span-9">
          <Panel />
        </div>
      </div>
    </PageContainer>
  );
}
