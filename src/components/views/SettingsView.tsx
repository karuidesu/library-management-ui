"use client";

import * as React from "react";
import {
  Bell,
  Building2,
  Check,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { PageContainer, PageHeader } from "@/components/ui/Page";
import { useTheme } from "@/hooks/useTheme";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { currentUser, loanDurations } from "@/lib/data";

const sections = [
  { id: "profile", label: "Profil", icon: User },
  { id: "preferences", label: "Préférences", icon: Palette },
  { id: "library", label: "Bibliothèque", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: ShieldCheck },
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
      className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-[#212B44] dark:hover:bg-[#1F2A40]"
    >
      <Checkbox id={id} defaultChecked={defaultChecked} className="mt-0.5" />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-900 dark:text-[#F3F4F6]">
          {title}
        </span>
        <span className="mt-0.5 block text-sm text-slate-500 dark:text-[#94A3B8]">
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
            Identité et informations affichées aux collègues bibliothécaires.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            name={currentUser.name}
            gender={currentUser.gender}
            size="xl"
            className="size-16 text-lg"
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-[#F3F4F6]">
              {currentUser.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
              {currentUser.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-5">
            <Field label="Nom complet" htmlFor="settings-name">
              <Input id="settings-name" defaultValue={currentUser.name} />
            </Field>
            <Field
              label="Numéro de téléphone"
              htmlFor="settings-phone"
              hint="Numéro direct pour les notifications d'urgence et de service."
            >
              <Input
                id="settings-phone"
                type="tel"
                defaultValue={currentUser.phone}
                placeholder="+229 97 00 12 34"
              />
            </Field>
          </div>

          <div className="space-y-5">
            <Field label="Adresse e-mail" htmlFor="settings-email">
              <Input
                id="settings-email"
                type="email"
                defaultValue={currentUser.email}
              />
            </Field>
            <Field
              label="Rôle"
              htmlFor="settings-role"
              hint="Attribué par l'administrateur système (non modifiable)."
            >
              <Input
                id="settings-role"
                value={currentUser.role}
                disabled
                readOnly
              />
            </Field>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PreferencesSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Préférences</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Personnalisez le mode d&apos;affichage et la langue de l&apos;espace de travail.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
            className={cn(
              "group relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 outline-none",
              theme === "light"
                ? "border-brand-600 bg-brand-50/40 ring-4 ring-brand-600/10 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#212B44] dark:bg-[#171E31]/50",
            )}
          >
            {/* Visual preview */}
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 p-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-rose-400" />
                  <div className="size-2 rounded-full bg-amber-400" />
                  <div className="size-2 rounded-full bg-emerald-400" />
                </div>
                <div className="h-2 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-14 w-8 rounded-lg bg-slate-200/70" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded-sm bg-brand-500/80" />
                  <div className="h-2 w-full rounded-sm bg-slate-200" />
                  <div className="h-2 w-2/3 rounded-sm bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="size-5 text-amber-500" aria-hidden="true" />
                <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">Mode Clair (Light)</span>
              </div>
              {theme === "light" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Check className="size-3" aria-hidden="true" />
                  Actif
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">Activer</span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#94A3B8]">
              Palette claire et lumineuse, idéale pour les postes en journée.
            </p>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
            className={cn(
              "group relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 outline-none",
              theme === "dark"
                ? "border-blue-500 bg-[#171E31] ring-4 ring-blue-500/20 shadow-sm"
                : "border-[#212B44] bg-[#0B0F19] hover:border-[#2D3B55]",
            )}
          >
            {/* Visual preview */}
            <div className="mb-4 overflow-hidden rounded-xl border border-[#212B44] bg-[#0B0F19] p-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#212B44] pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-rose-500" />
                  <div className="size-2 rounded-full bg-amber-500" />
                  <div className="size-2 rounded-full bg-emerald-500" />
                </div>
                <div className="h-2 w-16 rounded-full bg-[#212B44]" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-14 w-8 rounded-lg bg-[#212B44]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded-sm bg-blue-500" />
                  <div className="h-2 w-full rounded-sm bg-[#212B44]" />
                  <div className="h-2 w-2/3 rounded-sm bg-[#212B44]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="size-5 text-blue-400" aria-hidden="true" />
                <span className="font-semibold text-slate-100">Mode Sombre (Dark)</span>
              </div>
              {theme === "dark" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Check className="size-3" aria-hidden="true" />
                  Actif
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">Activer</span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Palette sombre reposante pour limiter la fatigue oculaire (#0B0F19).
            </p>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6 dark:border-[#212B44]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label
                htmlFor="pref-language"
                className="block text-sm font-medium text-slate-900 dark:text-[#F3F4F6]"
              >
                Langue de l&apos;interface
              </label>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
                Définir la langue principale de l&apos;application Agbale. (Changement complet prévu dans une prochaine version)
              </p>
            </div>
            <div className="w-full sm:w-60">
              <Select id="pref-language" defaultValue="fr" disabled className="opacity-90">
                <option value="fr">🇫🇷 Français (actif)</option>
                <option value="en" disabled>🇬🇧 English (bientôt)</option>
                <option value="es" disabled>🇪🇸 Español (bientôt)</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#131929]">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-[#94A3B8]">
            💡 <strong>Raccourci rapide :</strong> Vous pouvez également alterner de thème à tout instant grâce au bouton soleil/lune présent dans l&apos;en-tête supérieur.
          </p>
        </div>
      </div>
    </Card>
  );
}

function LibrarySection() {
  const { establishmentName, maxBooks, setMaxBooks } = useLibrarySettings();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Bibliothèque &amp; règles de prêt</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Paramètres et valeurs appliqués par défaut aux emprunts.
          </p>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <Field
          label="Nom de l'établissement"
          htmlFor="settings-library"
          hint="Récupéré depuis les variables d'environnement du backend (non modifiable depuis cette interface)."
        >
          <Input
            id="settings-library"
            value={establishmentName}
            disabled
            readOnly
          />
        </Field>
        <Field label="Durée de prêt standard" htmlFor="settings-loan-period">
          <Select id="settings-loan-period" defaultValue="14">
            {loanDurations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Nombre maximal d'emprunts simultanés"
          htmlFor="settings-max-books"
          hint="Les usagers ayant atteint ce quota ne peuvent plus emprunter de nouveau livre."
        >
          <Input
            id="settings-max-books"
            type="number"
            min={1}
            max={20}
            value={maxBooks}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value, 10);
              if (!Number.isNaN(val) && val > 0) {
                setMaxBooks(val);
              }
            }}
          />
        </Field>
        <Field
          label="Délai de grâce avant relance (jours)"
          htmlFor="settings-grace-period"
          hint="Période de tolérance accordée avant l'émission d'un avis de retard."
        >
          <Input id="settings-grace-period" inputMode="numeric" defaultValue="3" />
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
            Choisissez les événements nécessitant une alerte.
          </p>
        </div>
      </CardHeader>

      <div className="space-y-3 p-6 sm:p-8">
        <ToggleRow
          id="notify-overdue"
          title="Rappels d'échéance dépassée"
          description="Alerter les bibliothécaires le jour où un prêt entre en retard."
          defaultChecked
        />
        <ToggleRow
          id="notify-due-soon"
          title="Rappels d'échéance imminente"
          description="Informer les usagers deux jours avant la date limite de restitution."
          defaultChecked
        />
        <ToggleRow
          id="notify-registrations"
          title="Nouvelles adhésions"
          description="Signaler toute nouvelle inscription enregistrée dans l'établissement."
          defaultChecked
        />
        <ToggleRow
          id="notify-digest"
          title="Rapport hebdomadaire consolidé"
          description="Synthèse du lundi matin sur le flux d'emprunts et l'état des collections."
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
          <CardTitle>Sécurité &amp; Accès</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Protection de l&apos;accès au portail de gestion de la bibliothèque.
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
            hint="Au moins 12 caractères sécurisés."
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
          title="Authentification à double facteur (2FA)"
          description="Exiger un code à usage unique lors de l'ouverture de session."
          defaultChecked
        />
        <ToggleRow
          id="security-sessions"
          title="Fermer les autres sessions actives"
          description="Mettre fin aux connexions ouvertes sur d'autres terminaux."
        />
      </div>
    </Card>
  );
}

const panels: Record<SectionId, React.ComponentType> = {
  profile: ProfileSection,
  preferences: PreferencesSection,
  library: LibrarySection,
  notifications: NotificationsSection,
  security: SecuritySection,
};

export function SettingsView() {
  const [active, setActive] = React.useState<SectionId>("profile");
  const Panel = panels[active];

  return (
    <PageContainer>
      <PageHeader
        title="Paramètres"
        description="Gérez votre profil, le thème d'affichage et les règles de circulation."
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
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25 dark:bg-blue-600 dark:shadow-blue-900/40"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[1.125rem] shrink-0",
                        selected ? "text-white" : "text-slate-400 dark:text-[#94A3B8]",
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
