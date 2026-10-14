"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, KeyRound, Library, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input } from "@/components/ui/Field";
import { APP_NAME } from "@/lib/nav";

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
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-brand-900/70 via-slate-900 to-slate-950"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-600">
            <Library className="size-6 text-white" aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-white">
            {APP_NAME}
          </span>
        </div>

        <div className="relative max-w-lg">
          <h2 className="text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl">
            Le système de gestion de bibliothèque de nouvelle génération.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-slate-300">
            Élégant, rapide et sécurisé. Offrez à vos bibliothécaires tous les
            outils nécessaires pour gérer catalogues, membres et prêts sans friction.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { value: "600+", label: "Bibliothèques" },
              { value: "4.2M", label: "Livres répertoriés" },
              { value: "99.9%", label: "Disponibilité" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-slate-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-[56%] translate-y-[14%] opacity-30"
        >
          <ShelfArtwork />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent"
        />
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-600">
              <Library className="size-6 text-white" aria-hidden="true" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              {APP_NAME}
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Bon retour
          </h1>
          <p className="mt-2 text-slate-500">
            Connectez-vous à votre espace de bibliothèque pour continuer.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="Adresse e-mail" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                inputSize="lg"
                leadingIcon={Mail}
                placeholder="vous@bibliotheque.org"
              />
            </Field>

            <Field
              label="Mot de passe"
              htmlFor="password"
              action={
                <Link
                  href="/login"
                  className="-my-1.5 rounded px-0.5 py-1.5 text-sm font-medium text-brand-600 outline-none transition-colors hover:text-brand-700 focus-visible:ring-4 focus-visible:ring-brand-600/20"
                >
                  Mot de passe oublié ?
                </Link>
              }
            >
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
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
                    className="grid size-9 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-4 focus-visible:ring-brand-600/20"
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

            <label className="flex w-fit cursor-pointer items-center gap-2.5 py-1">
              <Checkbox name="remember" defaultChecked />
              <span className="text-sm text-slate-600">Se souvenir de moi</span>
            </label>

            <Button
              type="submit"
              size="lg"
              loading={submitting}
              className="w-full shadow-lg shadow-brand-600/20"
            >
              Se connecter
              {submitting ? null : (
                <ArrowRight className="size-[1.125rem]" aria-hidden="true" />
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/login"
              className="rounded font-semibold text-brand-600 outline-none transition-colors hover:text-brand-700 focus-visible:ring-4 focus-visible:ring-brand-600/20"
            >
              Contactez votre administrateur
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
