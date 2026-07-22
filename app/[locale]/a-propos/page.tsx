import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Gauge, HeartHandshake, Star } from "lucide-react";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Button } from "@/components/ui/Button";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

const CONTENT = {
  fr: {
    eyebrow: "Notre histoire",
    title:
      "Votre partenaire de confiance pour découvrir Agadir en toute liberté",
    intro:
      "FirstLineCars est une agence locale spécialisée dans la location de véhicules pour les touristes, les Marocains résidents à l'étranger, les voyageurs professionnels et tous ceux qui souhaitent explorer Agadir et ses environs.",
    mission:
      "Notre objectif est d'éliminer les mauvaises expériences liées à la location de voiture : frais inattendus, démarches compliquées et manque de communication. Chaque véhicule, chaque échange, chaque livraison est pensé pour que vous n'ayez qu'une chose à faire : profiter de votre séjour.",
    values: [
      {
        icon: ShieldCheck,
        title: "Transparence totale",
        description:
          "Des prix clairs dès le départ. Aucun frais caché à la restitution.",
      },
      {
        icon: Gauge,
        title: "Qualité de la flotte",
        description:
          "Véhicules récents, contrôlés régulièrement, propres à chaque livraison.",
      },
      {
        icon: HeartHandshake,
        title: "Flexibilité & service",
        description:
          "Livraison aéroport, hôtel ou adresse privée, à toute heure.",
      },
      {
        icon: Star,
        title: "Satisfaction client",
        description: "Une note de 4,7/5 sur plus de 50 avis Google.",
      },
    ],
    ctaFleet: "Voir notre flotte",
    ctaBook: "Réserver maintenant",
  },
  en: {
    eyebrow: "Our story",
    title: "Your trusted partner to discover Agadir freely",
    intro:
      "FirstLineCars is a local agency specialised in car rental for tourists, Moroccans living abroad, business travellers and anyone exploring Agadir and its surroundings.",
    mission:
      "Our goal is to remove the bad experiences that come with car rental: unexpected fees, complicated procedures and poor communication. Every vehicle, every conversation, every delivery is designed so you only have one thing to do: enjoy your stay.",
    values: [
      {
        icon: ShieldCheck,
        title: "Total transparency",
        description:
          "Clear pricing from the start. No hidden fees when you return the car.",
      },
      {
        icon: Gauge,
        title: "Fleet quality",
        description:
          "Recent vehicles, regularly checked, clean for every delivery.",
      },
      {
        icon: HeartHandshake,
        title: "Flexibility & service",
        description:
          "Airport, hotel or private address delivery, any time of day.",
      },
      {
        icon: Star,
        title: "Customer satisfaction",
        description: "A 4.7/5 rating across 50+ Google reviews.",
      },
    ],
    ctaFleet: "View our fleet",
    ctaBook: "Book now",
  },
} as const;

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const content = CONTENT[locale];
  return {
    title: locale === "en" ? "About us" : "À propos",
    description: content.intro,
    alternates: {
      canonical: `/${locale}/a-propos`,
      languages: { fr: "/fr/a-propos", en: "/en/a-propos" },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const content = CONTENT[locale];

  return (
    <>
      <section className="bg-marine-900 relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/agadir-coastline.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="from-marine-900 via-marine-900/70 to-marine-900/30 absolute inset-0 bg-linear-to-t" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            {content.eyebrow}
          </p>
          <AnimatedHeading
            text={content.title}
            as="h1"
            className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <Reveal>
          <p className="text-ink-soft text-lg leading-relaxed">
            {content.intro}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-ink-soft mt-6 text-lg leading-relaxed">
            {content.mission}
          </p>
        </Reveal>
      </section>

      <section className="bg-sand-100 py-20">
        <div className="mx-auto max-w-[80rem] px-6 sm:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={index * 0.1}>
                  <div className="shadow-card h-full rounded-2xl bg-white p-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-marine-900 mt-5 text-base font-semibold">
                      {value.title}
                    </h3>
                    <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10">
        <Reveal>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={`/${locale}/vehicules`} variant="secondary">
              {content.ctaFleet}
            </Button>
            <Button href={`/${locale}/booking`} variant="primary">
              {content.ctaBook}
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
