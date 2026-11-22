"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Library,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useLibrarySettings } from "@/hooks/useLibrarySettings";
import { useTheme } from "@/hooks/useTheme";
import { APP_NAME } from "@/lib/nav";
import { authService } from "@/services/auth";
import { ApiError } from "@/lib/api";

function ShelfArtwork() {
  return (
    <svg
      viewBox="0 0 520 420"
      role="presentation"
      aria-hidden="true"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="spine-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="spine-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="spine-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {[
        { y: 150, items: [34, 58, 22, 46, 30, 64, 26] },
        { y: 270, items: [46, 26, 60, 34, 52, 24, 40] },
      ].map((shelf, shelfIndex) => {
        let x = 40;
        return (
          <g key={shelf.y}>
            {shelf.items.map((width, index) => {
              const height = 70 + ((index * 17 + shelfIndex * 11) % 46);
              const node = (
                <rect
                  key={`${shelf.y}-${index}`}
                  x={x}
                  y={shelf.y - height}
                  width={width}
                  height={height}
                  rx={6}
                  fill={`url(#spine-${["a", "b", "c"][(index + shelfIndex) % 3]})`}
                  opacity={0.9}
                />
              );
              x += width + 8;
              return node;
            })}
            <rect
              x={28}
              y={shelf.y}
              width={464}
              height={8}
              rx={4}
              fill="#1E3A8A"
              opacity={0.65}
            />
          </g>
        );
      })}

      <g transform="translate(196 300)">
        <path
          d="M4 36C4 36 28 20 64 20V74C28 74 4 90 4 90V36Z"
          fill="#DBEAFE"
          opacity={0.95}
        />
        <path
          d="M124 36C124 36 100 20 64 20V74C100 74 124 90 124 90V36Z"
          fill="#EFF6FF"
          opacity={0.95}
        />
        <path d="M64 20V74" stroke="#1D4ED8" strokeWidth={2} opacity={0.4} />
      </g>
    </svg>
  );
}

export function LoginView() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { establishmentName } = useLibrarySettings();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [capsLockOn, setCapsLockOn] = React.useState(false);
  const [demoCopied, setDemoCopied] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Modals state
  const [forgotModalOpen, setForgotModalOpen] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotSubmitted, setForgotSubmitted] = React.useState(false);
  const [contactModalOpen, setContactModalOpen] = React.useState(false);

  const isDark = theme === "dark";

  const handleKeyModifier = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@agbale.org");
    setPassword("AdminPassword123!");
    if (errorMessage) setErrorMessage(null);
    setDemoCopied(true);
    setTimeout(() => setDemoCopied(false), 2500);
  };

  const handleOpenForgotModal = () => {
    setForgotEmail(email || "admin@agbale.org");
    setForgotSubmitted(false);
    setForgotModalOpen(true);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await authService.login({ email, password });
      // En cas de succès : stocker l'utilisateur et faire router.push("/dashboard")
      if (typeof window !== "undefined" && res.user) {
        try {
          localStorage.setItem("agbale:user", JSON.stringify(res.user));
        } catch {
          // Ignorer si localStorage est bloqué
        }
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erreur de connexion au serveur.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-12 bg-slate-50 dark:bg-[#0B0F19]">
      {/* Colonne de Gauche : Vitrine & Branding */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 lg:col-span-6 xl:col-span-7 lg:flex">
        {/* Arrière-plans & trame graphique */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-slate-950 to-slate-950"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* En-tête marque */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 ring-1 ring-white/20">
              <Library className="size-6 text-white" aria-hidden="true" />
            </span>
            <div>
              <span className="block text-2xl font-bold tracking-tight text-white">
                {APP_NAME}
              </span>
              <span className="block text-xs font-medium text-slate-400">
                {establishmentName}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Système opérationnel • v2.4
          </div>
        </div>

        {/* Corps central : Titre & Piliers de valeur (paragraphe supprimé et remplacé par des atouts structurés) */}
        <div className="relative my-auto max-w-xl py-8">
          <h2 className="text-balance text-3xl font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl xl:text-5xl">
            Le système de gestion de bibliothèque de nouvelle génération.
          </h2>

          <div className="mt-8 space-y-3">
            {[
              {
                icon: BookOpen,
                title: "Gestion documentaire & Dewey unifiée",
                desc: "Catalogage fluide, indexation ISBN instantanée et suivi des exemplaires en stock.",
              },
              {
                icon: Zap,
                title: "Prêts & retours automatisés",
                desc: "Validation en un clic, gestion proactive des retards et relances par courriel.",
              },
              {
                icon: ShieldCheck,
                title: "Sécurité & intégrité des données",
                desc: "Contrôle d'accès par rôles (RBAC), journal d'audit complet et sauvegardes régulières.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-all hover:bg-white/[0.07]"
              >
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/30">
                  <feature.icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Statistiques en cartes élégantes */}
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {[
              { value: "600+", label: "Bibliothèques" },
              { value: "4.2M", label: "Livres répertoriés" },
              { value: "99.9%", label: "Disponibilité" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center backdrop-blur-sm"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tracking-tight text-white xl:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-slate-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Bas de page gauche : Artwork & Réassurance */}
        <div className="relative flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
            <span>Chiffrement SSL 256-bit • Protection RGPD</span>
          </div>
          <span className="hidden sm:inline">Propulsé par Agbale LMS</span>
        </div>

        {/* Illustration d'étagères en arrière-plan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-[54%] translate-y-[15%] opacity-20"
        >
          <ShelfArtwork />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"
        />
      </section>

      {/* Colonne de Droite : Formulaire d'authentification */}
      <section className="flex flex-1 flex-col justify-between bg-white dark:bg-[#0B0F19] lg:col-span-6 xl:col-span-5">
        {/* Barre supérieure mobile & actions secondaires */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 dark:border-[#1F2A3C] lg:border-b-0 lg:py-6">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600 shadow-md shadow-brand-600/20">
              <Library className="size-5 text-white" aria-hidden="true" />
            </span>
            <div>
              <span className="block text-lg font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                {APP_NAME}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-[#94A3B8]">
                {establishmentName}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-[#171E31] dark:hover:text-[#F3F4F6]"
            >
              <HelpCircle className="size-3.5" aria-hidden="true" />
              <span>Assistance</span>
            </button>

            {/* Sélecteur de thème clair/sombre */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-[#212B44] dark:bg-[#171E31] dark:text-[#94A3B8] dark:hover:bg-[#1F2A40] dark:hover:text-white"
            >
              {isDark ? (
                <Sun className="size-4 text-amber-400 transition-transform duration-300 hover:rotate-45" aria-hidden="true" />
              ) : (
                <Moon className="size-4 text-slate-600 transition-transform duration-300 hover:-rotate-12" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* Contenu principal centré */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:py-12">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Badge et Titre */}
            <div className="mb-6">
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50/70 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/20 dark:bg-brand-950/40 dark:text-brand-300">
                <ShieldCheck className="size-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                Espace Gestion & Bibliothèque
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6] sm:text-3xl">
                Connexion
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94A3B8]">
                Saisissez vos identifiants pour administrer <span className="font-medium text-slate-700 dark:text-slate-300">{establishmentName}</span>.
              </p>
            </div>

            {/* Raccourci Compte Démo (accélérateur de test/démo) */}
            <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50/80 to-blue-50/40 p-3.5 dark:border-brand-900/50 dark:from-brand-950/30 dark:to-slate-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Compte Démo Administrateur
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-[#94A3B8]">
                    admin@agbale.org
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {demoCopied ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    <span>Inséré !</span>
                  </>
                ) : (
                  <span>Remplir</span>
                )}
              </button>
            </div>

            {/* Formulaire de connexion */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Message d'erreur retourné par le backend */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/95 p-3.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-900 dark:text-rose-200">
                      Échec de l&apos;authentification
                    </p>
                    <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              <Field label="Adresse e-mail professionnelle" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  inputSize="lg"
                  leadingIcon={Mail}
                  placeholder="admin@agbale.org"
                />
              </Field>

              <Field
                label="Mot de passe"
                htmlFor="password"
                required
                action={
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="-my-1.5 rounded px-0.5 py-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 outline-none transition-colors focus-visible:ring-4 focus-visible:ring-brand-600/20"
                  >
                    Mot de passe oublié ?
                  </button>
                }
              >
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyDown={handleKeyModifier}
                  onKeyUp={handleKeyModifier}
                  inputSize="lg"
                  leadingIcon={KeyRound}
                  placeholder="Entrez votre mot de passe"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                      }
                      aria-pressed={showPassword}
                      className="grid size-9 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#2E3E5A] dark:hover:text-[#F3F4F6] focus-visible:ring-4 focus-visible:ring-brand-600/20"
                    >
                      {showPassword ? (
                        <EyeOff className="size-[1.125rem]" aria-hidden="true" />
                      ) : (
                        <Eye className="size-[1.125rem]" aria-hidden="true" />
                      )}
                    </button>
                  }
                />
              </Field>

              {/* Indicateur Touche Verr. Majuscule */}
              {capsLockOn ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Attention : Le verrouillage des majuscules est activé</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-1">
                <label className="flex w-fit cursor-pointer items-center gap-2.5">
                  <Checkbox
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-slate-600 dark:text-[#94A3B8]">
                    Se souvenir de cet appareil
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="w-full shadow-lg shadow-brand-600/20 text-sm font-semibold"
              >
                {submitting ? "Connexion en cours..." : "Se connecter"}
                {submitting ? null : (
                  <ArrowRight className="size-[1.125rem]" aria-hidden="true" />
                )}
              </Button>
            </form>

            {/* Lien d'aide administrative */}
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-[#94A3B8]">
              Vous n&apos;avez pas encore d&apos;identifiant ?{" "}
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline-offset-2 hover:underline"
              >
                Contactez votre administrateur
              </button>
            </p>
          </div>
        </div>

        {/* Pied de page discret */}
        <footer className="border-t border-slate-100 px-6 py-4 text-center text-xs text-slate-400 sm:px-8 dark:border-[#1F2A3C] dark:text-[#64748B]">
          <span>© {new Date().getFullYear()} {APP_NAME} LMS. Tous droits réservés.</span>
        </footer>
      </section>

      {/* Modal Réinitialisation Mot de passe */}
      <Modal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Réinitialisation du mot de passe"
        description="Recevez un lien sécurisé pour définir un nouveau mot de passe."
        size="md"
      >
        {forgotSubmitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              E-mail de réinitialisation transmis !
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Si un compte bibliothécaire correspond à l&apos;adresse{" "}
              <strong className="text-slate-900 dark:text-white">{forgotEmail}</strong>,
              vous recevrez un lien de réinitialisation valide durant 15 minutes.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
              >
                Compris, retourner à la connexion
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForgotSubmitted(true);
            }}
            className="space-y-4 py-1"
          >
            <p className="text-sm text-slate-600 dark:text-[#94A3B8]">
              Indiquez l&apos;adresse e-mail professionnelle liée à votre compte. Un lien de réinitialisation à usage unique vous sera envoyé.
            </p>

            <Field label="Adresse e-mail" htmlFor="reset-email" required>
              <Input
                id="reset-email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                leadingIcon={Mail}
                placeholder="vous@bibliotheque.org"
              />
            </Field>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setForgotModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Transmettre les instructions
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Assistance & Contact Administrateur */}
      <Modal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Assistance & Demande de compte"
        description="Informations pour contacter l'équipe administrative de votre établissement."
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-[#212B44] dark:bg-[#131929]">
            <p className="font-semibold text-slate-900 dark:text-[#F3F4F6]">
              {establishmentName}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
              La création et l&apos;attribution des accès bibliothécaires sont centralisées par le responsable de votre établissement.
            </p>

            <div className="mt-4 space-y-2.5 border-t border-slate-200/80 pt-3 text-xs dark:border-[#212B44]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-[#94A3B8]">Administratrice du système :</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Sarah Connor</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-[#94A3B8]">E-mail du support :</span>
                <a
                  href="mailto:support@agbale.app"
                  className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  support@agbale.app
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-[#94A3B8]">Ligne directe interne :</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Poste 4022</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
            💡 <strong>Rappel :</strong> Ne partagez jamais vos identifiants ou mot de passe. Chaque bibliothécaire doit disposer de son propre compte nominatif pour la traçabilité des prêts et retours.
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setContactModalOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
