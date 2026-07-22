import { Zap, ShieldCheck, Truck, Headset } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

interface WhyUsProps {
  locale: Locale;
}

const CONTENT = {
  fr: {
    title: "Pourquoi choisir FirstLineCars ?",
    items: [
      {
        icon: Zap,
        title: "Réservation Express",
        description:
          "Un processus simple et rapide sans démarches administratives complexes.",
      },
      {
        icon: ShieldCheck,
        title: "Prix transparents",
        description:
          "Assurance, taxes et frais obligatoires inclus. Aucun frais caché.",
      },
      {
        icon: Truck,
        title: "Livraison flexible",
        description:
          "Aéroport Agadir Al Massira, hôtel, appartement ou adresse privée.",
      },
      {
        icon: Headset,
        title: "Assistance 24/7",
        description:
          "Une équipe disponible avant, pendant et après la location.",
      },
    ],
  },
  en: {
    title: "Why choose FirstLineCars?",
    items: [
      {
        icon: Zap,
        title: "Express booking",
        description: "A simple, fast process with no complex paperwork.",
      },
      {
        icon: ShieldCheck,
        title: "Transparent pricing",
        description:
          "Insurance, taxes and mandatory fees included. No hidden costs.",
      },
      {
        icon: Truck,
        title: "Flexible delivery",
        description:
          "Agadir Al Massira airport, hotel, apartment or private address.",
      },
      {
        icon: Headset,
        title: "24/7 assistance",
        description: "A team available before, during and after your rental.",
      },
    ],
  },
} as const;

export function WhyUs({ locale }: WhyUsProps) {
  const content = CONTENT[locale];

  return (
    <section className="bg-sand-100 py-24">
      <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="font-display text-marine-900 text-center text-3xl font-bold">
            {content.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="shadow-card h-full rounded-2xl bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-marine-900 mt-4 text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-ink-soft mt-2 text-sm">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
