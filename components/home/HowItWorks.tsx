import { CarFront, MessageSquareText, Route } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

interface HowItWorksProps {
  locale: Locale;
}

const CONTENT = {
  fr: {
    title: "Comment ça marche ?",
    steps: [
      {
        icon: CarFront,
        title: "Choisissez votre véhicule",
        description:
          "Découvrez notre flotte et choisissez la voiture adaptée à votre voyage.",
      },
      {
        icon: MessageSquareText,
        title: "Réservez facilement",
        description:
          "Remplissez le formulaire ou contactez-nous directement via WhatsApp.",
      },
      {
        icon: Route,
        title: "Prenez la route",
        description:
          "Nous livrons votre véhicule et vous profitez pleinement de votre séjour.",
      },
    ],
  },
  en: {
    title: "How does it work?",
    steps: [
      {
        icon: CarFront,
        title: "Choose your vehicle",
        description: "Browse our fleet and pick the car that fits your trip.",
      },
      {
        icon: MessageSquareText,
        title: "Book easily",
        description: "Fill in the form or contact us directly on WhatsApp.",
      },
      {
        icon: Route,
        title: "Hit the road",
        description:
          "We deliver your vehicle so you can fully enjoy your stay.",
      },
    ],
  },
} as const;

export function HowItWorks({ locale }: HowItWorksProps) {
  const content = CONTENT[locale];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <h2 className="font-display text-marine-900 text-center text-3xl font-bold">
          {content.title}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {content.steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={index * 0.12}>
              <div className="bg-sand-50 relative h-full rounded-2xl p-8">
                <span className="font-display text-sm font-semibold text-amber-500">
                  0{index + 1}
                </span>
                <div className="bg-marine-700 mt-3 flex h-12 w-12 items-center justify-center rounded-xl text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-marine-900 mt-4 text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-ink-soft mt-2 text-sm">{step.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
