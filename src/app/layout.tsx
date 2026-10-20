import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant_garamond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Vesuviana Cosmetics | Salud capilar por capas",
    template: "%s | Vesuviana Cosmetics",
  },
  description:
    "Casa botánica de cuidado capilar: Defilé, Tricomplex y Oleo's. Fórmulas por capas, diagnóstico técnico y una red de asesores y tiendas en Colombia.",
  applicationName: "Vesuviana Cosmetics",
  keywords: [
    "Vesuviana Cosmetics",
    "salud capilar",
    "Defilé",
    "Tricomplex",
    "Oleo's",
    "cosmética botánica",
    "mayoristas capilares",
  ],
  authors: [{ name: "Vesuviana Cosmetics" }],
  openGraph: {
    title: "Vesuviana Cosmetics | Salud capilar por capas",
    description:
      "Tres líneas, un ecosistema: mantenimiento, rescate estructural y sellado lipídico para la fibra capilar.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant_garamond.variable} ${plus_jakarta_sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
