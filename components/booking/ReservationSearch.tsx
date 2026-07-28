"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useReservation } from "@/hooks/useReservation";
import { ReservationDateFields } from "./ReservationDateFields";
import type { ReservationDates } from "@/types/booking";

interface ReservationSearchProps {
  locale: Locale;
  /**
   * `hero` : après la recherche, redirige vers /vehicules (début du parcours).
   * `results` : déjà sur /vehicules, la recherche recalcule la liste sur place.
   */
  variant: "hero" | "results";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  /**
   * Appelé après la publication des dates dans le Context (variant `results`).
   * Permet à la page de résultats de déclencher son indicateur de chargement.
   */
  onSearch?: () => void;
  /** Reflète l'état de rechargement de la liste sur le bouton. */
  loading?: boolean;
}

/**
 * Barre de recherche de réservation. L'état est local (l'utilisateur peut
 * ajuster les champs sans impacter le reste de l'app) et n'est publié dans le
 * Context qu'au clic sur « Rechercher » — ce qui reproduit le geste d'une
 * vraie recherche et recalcule alors les totaux affichés partout.
 */
export function ReservationSearch({
  locale,
  variant,
  tone = "light",
  id,
  className = "",
  onSearch,
  loading = false,
}: ReservationSearchProps) {
  const dict = getDictionary(locale);
  const { dates, setDates } = useReservation();
  const router = useRouter();

  // Amorcé sur les dates partagées : sur /vehicules le formulaire arrive donc
  // déjà pré-rempli avec ce qui a été saisi dans le Hero.
  const [draft, setDraft] = useState<ReservationDates>(dates);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setDates(draft);
    if (variant === "hero") {
      router.push(`/${locale}/vehicules`);
    } else {
      onSearch?.();
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={className}>
      <ReservationDateFields
        value={draft}
        onChange={setDraft}
        locale={locale}
        tone={tone}
      />
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="font-display text-ink mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-200 hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {dict.search.loading}
          </>
        ) : (
          <>
            <Search className="h-4 w-4" aria-hidden="true" />
            {dict.search.submit}
          </>
        )}
      </button>
    </form>
  );
}
