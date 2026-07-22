import type { Metadata } from "next";
import { Phone, MapPin, Clock } from "lucide-react";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { BUSINESS, SOCIAL } from "@/lib/business";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/SocialIcons";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    title: locale === "en" ? "Contact us" : "Contactez-nous",
    description:
      locale === "en"
        ? "Reach FirstLineCars by WhatsApp, phone or visit our agency in Talborjt, Agadir."
        : "Contactez FirstLineCars par WhatsApp, téléphone ou visitez notre agence à Talborjt, Agadir.",
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const whatsappMessage =
    locale === "en"
      ? "Hello FirstLineCars, I'd like information about a car rental."
      : "Bonjour FirstLineCars, je souhaite avoir des informations sur une location de voiture.";

  return (
    <section className="mx-auto max-w-5xl px-6 pt-32 pb-24 sm:px-10">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.25em] text-amber-500 uppercase">
          {locale === "en" ? "Get in touch" : "Nous contacter"}
        </p>
        <h1 className="font-display text-marine-900 mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {locale === "en"
            ? "Contact FirstLineCars"
            : "Contactez FirstLineCars"}
        </h1>
        <p className="text-ink-soft mt-4 max-w-lg">
          {locale === "en"
            ? "A question about a vehicle or a booking? Our team is available 7 days a week to help you organise your rental in Agadir."
            : "Une question sur un véhicule ou une réservation ? Notre équipe est disponible 7 jours sur 7 pour vous accompagner."}
        </p>
      </Reveal>

      {/* WhatsApp mis en avant seul, en pleine largeur, au-dessus de la
         grille secondaire : priorité visuelle claire (canal n°1) plutôt
         qu'une carte de même poids que les autres. */}
      <Reveal delay={0.1}>
        <div className="bg-marine-900 mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              WhatsApp
            </p>
            <p className="text-marine-100 mt-1.5 max-w-sm text-sm">
              {locale === "en"
                ? "The fastest way to reach us — usually a reply within minutes."
                : "Le moyen le plus rapide de nous joindre — réponse en quelques minutes."}
            </p>
          </div>
          <WhatsAppButton
            message={whatsappMessage}
            label={locale === "en" ? "Chat on WhatsApp" : "Écrire sur WhatsApp"}
            variant="primary"
            className="shrink-0"
          />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Reveal delay={0.15}>
          <div className="shadow-card h-full rounded-2xl bg-white p-7">
            <div className="bg-marine-50 text-marine-700 flex h-11 w-11 items-center justify-center rounded-full">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-marine-900 mt-5 font-semibold">
              {locale === "en" ? "Phone" : "Téléphone"}
            </p>
            <a
              href={`tel:${BUSINESS.phone}`}
              className="text-marine-700 hover:text-marine-900 mt-1.5 inline-block text-sm font-medium"
            >
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="shadow-card h-full rounded-2xl bg-white p-7">
            <div className="bg-marine-50 text-marine-700 flex h-11 w-11 items-center justify-center rounded-full">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-marine-900 mt-5 font-semibold">
              {locale === "en" ? "Agency address" : "Adresse de l'agence"}
            </p>
            <p className="text-ink-soft mt-1.5 text-sm">{BUSINESS.address}</p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="shadow-card h-full rounded-2xl bg-white p-7">
            <div className="bg-marine-50 text-marine-700 flex h-11 w-11 items-center justify-center rounded-full">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-marine-900 mt-5 font-semibold">
              {locale === "en" ? "Opening hours" : "Horaires"}
            </p>
            <p className="text-ink-soft mt-1.5 text-sm">
              {BUSINESS.openingHours.opens} – {BUSINESS.openingHours.closes},{" "}
              {locale === "en" ? "7 days a week" : "7 jours sur 7"}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="shadow-card h-full rounded-2xl bg-white p-7">
            <div className="bg-marine-50 text-marine-700 flex h-11 w-11 items-center justify-center rounded-full">
              <InstagramIcon className="h-5 w-5" />
            </div>
            <p className="font-display text-marine-900 mt-5 font-semibold">
              {locale === "en" ? "Follow us" : "Suivez-nous"}
            </p>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-marine-700 mt-1.5 inline-block text-sm underline underline-offset-2"
            >
              Instagram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
