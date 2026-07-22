"use client";

import { Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Review } from "@/types/review";
import type { Locale } from "@/lib/i18n";

interface ReviewCardProps {
  review: Review;
  locale: Locale;
}

// La locale était figée en "fr-FR" : les dates s'affichaient en français
// ("12 mai 2026") sur la version anglaise du site.
function formatReviewDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function ReviewCard({ review, locale }: ReviewCardProps) {
  return (
    <Card className="flex h-full w-70 flex-col p-5 sm:w-[320px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="flex items-center gap-1"
            aria-label={
              locale === "en"
                ? `${review.rating} out of 5 stars`
                : `${review.rating} étoiles sur 5`
            }
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < review.rating;
              return (
                <Star
                  key={index}
                  className={`h-4 w-4 ${filled ? "fill-amber-500 text-amber-500" : "text-marine-100"}`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <p className="text-ink-soft mt-3 text-sm leading-6">{review.text}</p>
        </div>

        <Quote
          className="text-marine-100 h-8 w-8 shrink-0"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="font-display text-marine-900 text-sm font-semibold">
          {review.authorName}
        </p>
        <p className="text-ink-soft mt-1 text-xs">
          {formatReviewDate(review.date, locale)}
        </p>
      </div>
    </Card>
  );
}
