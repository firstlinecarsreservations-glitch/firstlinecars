"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

interface HeroProps {
  locale: Locale;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export function Hero({ locale }: HeroProps) {
  const dict = getDictionary(locale);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const whatsappMessage =
    locale === "en"
      ? "Hello FirstLineCars, I'd like information about a car rental."
      : "Bonjour FirstLineCars, je souhaite avoir des informations sur une location de voiture.";

  const stats = [
    dict.hero.statReviews,
    dict.hero.statDelivery,
    dict.hero.statAvailability,
  ];

  return (
    // Aplat marine plein : la photo de fond a été retirée. Elle imposait
    // un voile sombre et deux dégradés superposés uniquement pour rendre
    // le texte lisible — la couleur de marque le fait directement, et la
    // page ne dépend plus du chargement d'une grande image.
    <section
      ref={sectionRef}
      // min-h-svh plutôt que h-svh : sur mobile, le contenu (titre sur
      // plusieurs lignes + description + deux boutons) est presque aussi
      // haut que l'écran. Une hauteur fixe forçait le centrage vertical à
      // faire passer le haut du titre SOUS le header fixe. Avec min-h, la
      // section s'étire si besoin et rien ne se chevauche.
      className="bg-marine-900 relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* Halo ambré très discret : donne de la profondeur à l'aplat sans
         rien ajouter à charger. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #E2A63B 0%, rgba(226,166,59,0) 65%)",
        }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        // Mobile : aligné en haut avec un dégagement fixe (pt-28) qui passe
        // sous le header, plutôt que centré. Desktop (sm+) : centrage
        // vertical inchangé, le contenu y tient largement.
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-start px-6 pt-32 pb-10 text-center sm:justify-center sm:px-10 sm:pt-0 sm:pb-0"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="mb-6 text-xs font-semibold tracking-[0.35em] text-amber-400 uppercase"
        >
          Agadir · Souss-Massa · Maroc
        </motion.span>

        <AnimatedHeading
          text={dict.hero.title}
          as="h1"
          className="font-display max-w-4xl text-[11vw] leading-[1.02] font-semibold tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EXPO_OUT }}
          className="text-marine-100/90 mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed sm:text-lg"
        >
          {dict.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EXPO_OUT }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href={`/${locale}/vehicules`} variant="primary">
            {dict.hero.ctaBook}
          </Button>
          <WhatsAppButton
            message={whatsappMessage}
            label={dict.hero.ctaWhatsapp}
            variant="primary"
          />
        </motion.div>
      </motion.div>

      {/* Ligne de stats éditoriale : bordures fines plutôt que des pilules,
         pour un rendu plus premium/architectural que des "badges" génériques. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, ease: EXPO_OUT }}
        className="relative border-t border-white/10"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat}
              className="px-6 py-5 text-center text-sm font-medium text-white/85 sm:text-[13px]"
            >
              {stat}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
