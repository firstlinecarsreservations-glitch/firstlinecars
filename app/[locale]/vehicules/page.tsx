import type { Metadata } from "next";
import {
  getDictionary,
  isValidLocale,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n";
import { getAllVehicles } from "@/lib/vehicles";
import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";

interface VehiclesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VehiclesPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.vehiclesPage.title,
    description: dict.vehiclesPage.description,
    alternates: {
      canonical: `/${locale}/vehicules`,
      languages: { fr: "/fr/vehicules", en: "/en/vehicules" },
    },
  };
}

export default async function VehiclesPage({ params }: VehiclesPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const vehicles = getAllVehicles();

  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-marine-900 text-4xl font-bold">
          {dict.vehiclesPage.title}
        </h1>
        <p className="text-ink-soft mt-4">{dict.vehiclesPage.description}</p>
      </div>

      <div className="mt-10">
        <VehicleCatalog vehicles={vehicles} locale={locale} />
      </div>
    </section>
  );
}
