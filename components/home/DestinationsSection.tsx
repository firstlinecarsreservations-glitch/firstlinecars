import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { Destination } from "@/types/destination";
import { Reveal } from "@/components/ui/Reveal";

interface DestinationsSectionProps {
  destinations: Destination[];
  locale: Locale;
}

const CONTENT = {
  fr: {
    title: "Destinations populaires autour d'Agadir",
    subtitle:
      "Louez votre voiture et explorez la région Souss-Massa en toute liberté.",
  },
  en: {
    title: "Popular destinations around Agadir",
    subtitle: "Rent your car and explore the Souss-Massa region freely.",
  },
} as const;

export function DestinationsSection({
  destinations,
  locale,
}: DestinationsSectionProps) {
  const content = CONTENT[locale];

  return (
    <section className="bg-sand-100 py-24">
      <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="font-display text-marine-900 text-center text-3xl font-bold">
            {content.title}
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-xl text-center text-sm">
            {content.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <Reveal key={destination.id} delay={(index % 3) * 0.1}>
              <div className="group relative aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="from-marine-900/90 via-marine-900/20 absolute inset-0 bg-linear-to-t to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-5">
                  <p className="font-display text-lg font-semibold text-white">
                    {destination.name}
                  </p>
                  <p className="text-marine-100 mt-1 text-xs">
                    {locale === "en"
                      ? destination.descriptionEn
                      : destination.descriptionFr}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    {destination.distanceFromAgadir}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
