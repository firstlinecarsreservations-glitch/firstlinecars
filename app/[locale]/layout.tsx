import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Space_Grotesk, Inter } from "next/font/google";
import {
  isValidLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n";
import { CURRENCY_COOKIE, parseCurrency } from "@/lib/currency";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Toute langue hors de generateStaticParams renvoie un 404 au lieu de
 * servir la version française sous une URL arbitraire (/zz/vehicules
 * rendait le site entier en dupliqué, indexable à l'infini).
 */
export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://firstlinecars.ma",
  ),
  title: {
    default: "FirstLineCars — Location de voiture à Agadir",
    template: "%s | FirstLineCars",
  },
  description:
    "Location de voitures récentes et entretenues à Agadir. Assurance incluse, sans caution possible, livraison aéroport et assistance 24/7.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Lire le cookie rend ce layout dynamique. Le coût est nul ici — toutes
  // les données du site sont des JSON locaux, aucun appel réseau — et c'est
  // ce qui permet d'afficher la bonne devise dès le premier rendu.
  const cookieStore = await cookies();
  const currency = parseCurrency(cookieStore.get(CURRENCY_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <CurrencyProvider initialCurrency={currency}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </CurrencyProvider>
      </body>
    </html>
  );
}
