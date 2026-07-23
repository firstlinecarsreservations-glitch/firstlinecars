import type { Metadata } from "next";
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
      "First Line Cars, votre agence de location de voiture à Agadir",
    intro:
      "First Line Cars est une agence locale de location de voiture à Agadir et à l'aéroport Agadir Al Massira. Nous accompagnons les touristes, les Marocains résidant à l'étranger et les voyageurs d'affaires avec un large choix de véhicules, de la citadine économique au SUV premium, à des tarifs parmi les plus compétitifs du Maroc.",
    mission:
      "Notre engagement : une location abordable sans mauvaise surprise. Prix affichés tout compris, assurance incluse, véhicules récents et entretenus, et livraison à l'aéroport comme à votre hôtel. Un service de qualité, pensé pour que vous n'ayez qu'une chose à faire : prendre la route.",
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
    title: "First Line Cars, your car rental agency in Agadir",
    intro:
      "First Line Cars is a local car rental agency in Agadir and at Agadir Al Massira Airport. We serve tourists, Moroccans living abroad and business travellers with a wide selection of vehicles, from affordable city cars to premium SUVs, at some of the most competitive rates in Morocco.",
    mission:
      "Our commitment: affordable car rental with no unpleasant surprises. All-inclusive pricing, insurance included, recent and well-maintained vehicles, and delivery to the airport or your hotel. Quality service, designed so you only have one thing to do: hit the road.",
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
        {/* Même traitement que le Hero : aplat marine plus halo discret,
           au lieu d'une photo de fond. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #E2A63B 0%, rgba(226,166,59,0) 65%)",
          }}
        />

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
