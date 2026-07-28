"use client";

import { useEffect, useRef, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ReservationSearch } from "@/components/booking/ReservationSearch";
import { VehicleGrid } from "./VehicleGrid";
import { VehicleGridSkeleton } from "./VehicleGridSkeleton";
import type { Vehicle } from "@/types/vehicle";

interface VehicleResultsProps {
  vehicles: Vehicle[];
  locale: Locale;
}

/** Durée de la simulation de rechargement de la liste, en millisecondes. */
const FAKE_RELOAD_MS = 700;

/**
 * Page de résultats de recherche. Il ne s'agit plus d'un catalogue à filtrer :
 * la recherche (simulation, toutes les voitures toujours disponibles) est
 * pré-remplie avec les dates saisies dans le Hero, et modifier ces dates
 * recalcule les totaux affichés sur chaque carte. Le serveur fournit toujours
 * la liste complète (bon pour le SEO) ; ce composant ne fait qu'ajouter
 * l'interactivité de recherche par-dessus.
 *
 * À chaque recherche, un court état de chargement factice simule l'appel réseau
 * qu'un vrai système de disponibilités déclencherait — c'est le point exact où
 * un `fetch` viendra se brancher plus tard.
 */
export function VehicleResults({ vehicles, locale }: VehicleResultsProps) {
  const dict = getDictionary(locale);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Nettoyage du minuteur si le composant est démonté pendant le chargement,
  // pour éviter un setState sur un composant absent.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleSearch() {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    timeoutRef.current = setTimeout(() => setLoading(false), FAKE_RELOAD_MS);
  }

  return (
    <div>
      {/* Pas de conteneur à fond/padding : les champs s'alignent exactement
         sur le bord de la colonne de contenu (titre, description, grille). */}
      <ReservationSearch
        locale={locale}
        variant="results"
        tone="light"
        onSearch={handleSearch}
        loading={loading}
      />

      <p
        aria-live="polite"
        className="font-display text-marine-900 mt-10 mb-6 text-xl font-bold tracking-tight"
      >
        {loading ? (
          <span className="text-ink-soft text-base font-medium">
            {dict.search.loading}
          </span>
        ) : (
          <>
            {vehicles.length}{" "}
            <span className="text-ink-soft text-base font-medium">
              {vehicles.length > 1
                ? dict.vehiclesPage.resultsPlural
                : dict.vehiclesPage.resultsSingular}
            </span>
          </>
        )}
      </p>

      {loading ? (
        <VehicleGridSkeleton count={vehicles.length} />
      ) : (
        <VehicleGrid vehicles={vehicles} locale={locale} variant="results" />
      )}
    </div>
  );
}
