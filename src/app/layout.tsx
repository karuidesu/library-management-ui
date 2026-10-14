import type { Metadata, Viewport } from "next";
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-canvas font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

