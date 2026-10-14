import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Agbale — Système de gestion de bibliothèque",
    template: "%s · Agbale",
  },
  description:
    "Un système moderne et complet de gestion de bibliothèque pour le catalogage, les prêts et les analyses.",
  applicationName: "Agbale",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('agbale:theme') || localStorage.getItem('libris:theme');
                var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                var root = document.documentElement;
                if (isDark) {
                  root.classList.add('dark');
                  root.setAttribute('dark', '');
                  root.setAttribute('data-theme', 'dark');
                } else {
                  root.classList.remove('dark');
                  root.removeAttribute('dark');
                  root.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-canvas font-sans text-slate-900 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}


