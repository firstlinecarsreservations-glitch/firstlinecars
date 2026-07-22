"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { GOOGLE_REVIEWS } from "@/lib/business";
import type { Review } from "@/types/review";
import type { Locale } from "@/lib/i18n";

interface ReviewsCarouselProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  title?: string;
  seeAllLabel: string;
  googleReviewsLabel: string;
  locale: Locale;
}

export function ReviewsCarousel({
  reviews,
  averageRating,
  totalReviews,
  title,
  seeAllLabel,
  googleReviewsLabel,
  locale,
}: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const navLabels =
    locale === "en"
      ? { prev: "Previous reviews", next: "Next reviews" }
      : { prev: "Avis précédents", next: "Avis suivants" };

  function scrollByCard(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section id="avis" className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {title && (
            <h2 className="font-display text-marine-900 text-3xl font-bold">
              {title}
            </h2>
          )}
          <div className="text-ink-soft mt-2 flex items-center gap-2 text-sm">
            <span className="text-marine-900 flex items-center gap-1 font-semibold">
              <Star
                className="h-4 w-4 fill-amber-500 text-amber-500"
                aria-hidden="true"
              />
              {averageRating.toFixed(1)}
            </span>
            <span>
              · {totalReviews}+ {googleReviewsLabel}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label={navLabels.prev}
            className="border-marine-100 hover:bg-marine-50 rounded-full border p-2"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label={navLabels.next}
            className="border-marine-100 hover:bg-marine-50 rounded-full border p-2"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex snap-x scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <div key={review.id} className="snap-start">
            <ReviewCard review={review} locale={locale} />
          </div>
        ))}
      </div>

      <a
        href={GOOGLE_REVIEWS.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-marine-700 hover:text-marine-900 mt-6 inline-block text-sm font-semibold underline underline-offset-2"
      >
        {seeAllLabel}
      </a>
    </section>
  );
}
