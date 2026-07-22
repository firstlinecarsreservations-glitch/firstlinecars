import { notFound } from "next/navigation";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getAllVehicles, getVehicleById } from "@/lib/vehicles";
import { BookingSummaryClient } from "./BookingSummaryClient";

interface BookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ carId?: string }>;
}

export const metadata = { robots: { index: false, follow: false } };

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { locale: rawLocale } = await params;
  const { carId } = await searchParams;
  const locale: Locale = isValidLocale(rawLocale)
    ? rawLocale
    : DEFAULT_LOCALE;
  const vehicles = getAllVehicles();
  const initialVehicle = carId ? getVehicleById(carId) : vehicles[0];

  if (!initialVehicle) notFound();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:px-10">
      <p className="text-xs font-semibold tracking-[0.25em] text-amber-500 uppercase">
        {locale === "en" ? "Booking" : "Réservation"}
      </p>
      <h1 className="font-display text-marine-900 mt-3 text-4xl font-semibold tracking-tight">
        {locale === "en" ? "Book your car" : "Réservez votre voiture"}
      </h1>
      <p className="text-ink-soft mt-3 max-w-lg text-sm">
        {locale === "en"
          ? "Complete your details below — confirmation typically takes just a few minutes."
          : "Complétez vos informations ci-dessous — la confirmation prend généralement quelques minutes."}
      </p>

      <BookingSummaryClient
        initialVehicle={initialVehicle}
        allVehicles={vehicles}
        locale={locale}
      />
    </section>
  );
}
