"use client";

import { useRef } from "react";
import Image from "next/image";
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
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const whatsappMessage =
    locale === "en"
      ? "Hello FirstLineCars, I'd like information about a car rental."
      : "Bonjour FirstLineCars, je souhaite avoir des informations sur une location de voiture.";

  // "+100 clients satisfaits" a été retiré : c'était un chiffre inventé,
  // invérifiable. Les trois affirmations restantes sont vraies.
  const stats = [
    dict.hero.statReviews,
    dict.hero.statDelivery,
    dict.hero.statAvailability,
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh min-h-160 flex-col overflow-hidden bg-marine-900"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/hero/agadir-coastline.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-marine-900 via-marine-900/55 to-marine-900/20" />
        <div className="absolute inset-0 bg-linear-to-r from-marine-900/40 via-transparent to-marine-900/40" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center sm:px-10"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400"
        >
          Agadir · Souss-Massa · Maroc
        </motion.span>

        <AnimatedHeading
          text={dict.hero.title}
          as="h1"
          className="max-w-4xl font-display text-[13vw] font-semibold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EXPO_OUT }}
          className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-marine-100/90 sm:text-lg"
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
          <WhatsAppButton message={whatsappMessage} label={dict.hero.ctaWhatsapp} variant="primary" />
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
            <div key={stat} className="px-6 py-5 text-center text-sm font-medium text-white/85 sm:text-[13px]">
              {stat}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
