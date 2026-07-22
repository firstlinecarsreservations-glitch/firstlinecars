import type { Metadata } from "next";
import {
  getDictionary,
  isValidLocale,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n";
import { getAllVehicles } from "@/lib/vehicles";
import { GOOGLE_REVIEWS } from "@/lib/business";
import reviewsData from "@/data/reviews.json";
import destinationsData from "@/data/destinations.json";
import faqData from "@/data/faq.json";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyUs } from "@/components/home/WhyUs";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { ReviewsCarousel } from "@/components/reviews/ReviewsCarousel";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.hero.title,
    description: dict.hero.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const featuredVehicles = getAllVehicles().slice(0, 3);

  return (
    <>
      <Hero locale={locale} />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="font-display text-marine-900 text-3xl font-bold">
                {dict.fleet.title}
              </h2>
              <p className="text-ink-soft mt-2 text-sm">
                {dict.fleet.subtitle}
              </p>
            </div>
            <Button href={`/${locale}/vehicules`} variant="secondary">
              {dict.fleet.viewAll}
            </Button>
          </div>
        </Reveal>

        <div className="mt-10">
          <VehicleGrid vehicles={featuredVehicles} locale={locale} />
        </div>
      </section>

      <HowItWorks locale={locale} />

      {/* La note et le nombre d'avis viennent de la fiche Google réelle,
         pas d'un calcul sur data/reviews.json — ce fichier ne contient
         encore que des avis de démonstration. */}
      <ReviewsCarousel
        reviews={reviewsData}
        averageRating={GOOGLE_REVIEWS.rating}
        totalReviews={GOOGLE_REVIEWS.count}
        title={
          locale === "en" ? "What our customers say" : "Avis de nos clients"
        }
        seeAllLabel={
          locale === "en"
            ? "See all Google reviews"
            : "Voir tous les avis Google"
        }
        googleReviewsLabel={locale === "en" ? "Google reviews" : "avis Google"}
        locale={locale}
      />

      <DestinationsSection destinations={destinationsData} locale={locale} />
      <WhyUs locale={locale} />

      <FaqAccordion
        items={faqData.map((item) => ({
          id: item.id,
          question: locale === "en" ? item.questionEn : item.questionFr,
          answer: locale === "en" ? item.answerEn : item.answerFr,
        }))}
        title={
          locale === "en"
            ? "Frequently asked questions"
            : "Questions fréquentes"
        }
      />
    </>
  );
}
