"use client";

import { useId, useMemo } from "react";
import { Search } from "lucide-react";
import { useVehicleFilters } from "@/hooks/useVehicleFilters";
import { getAvailableBrands } from "@/lib/vehicles";
import { getDictionary, type Locale } from "@/lib/i18n";
import { VehicleFilters } from "./VehicleFilters";
import { VehicleGrid } from "./VehicleGrid";
import type { Vehicle } from "@/types/vehicle";

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  locale: Locale;
}

/**
 * Client Component : reçoit la liste complète (déjà rendue côté serveur
 * pour le SEO) et applique le filtrage en mémoire, sans round-trip réseau.
 */
export function VehicleCatalog({ vehicles, locale }: VehicleCatalogProps) {
  const { filters, filteredVehicles, updateFilter, resetFilters } =
    useVehicleFilters(vehicles);
  const dict = getDictionary(locale);
  const searchId = useId();

  // getAvailableBrands parcourt et trie la liste : sans mémoïsation, ce
  // travail était refait à chaque frappe dans la recherche.
  const availableBrands = useMemo(
    () => getAvailableBrands(vehicles),
    [vehicles],
  );

  return (
    <div>
      {/* Recherche en pleine largeur au-dessus des deux colonnes : c'est
         le chemin le plus court quand on sait déjà quel modèle on veut,
         alors que les filtres servent à explorer. */}
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          {dict.vehiclesPage.searchLabel}
        </label>
        <Search
          className="text-ink-soft pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          id={searchId}
          type="search"
          value={filters.search ?? ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder={dict.vehiclesPage.searchPlaceholder}
          className="border-marine-100 text-marine-900 placeholder:text-ink-soft/60 focus:border-marine-500 w-full rounded-xl border bg-white py-3.5 pr-4 pl-11 text-sm transition-colors"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
        <VehicleFilters
          locale={locale}
          availableBrands={availableBrands}
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
        />
        <div>
          {/* Sert de titre à la grille, et annonce le résultat aux
             lecteurs d'écran : la liste se mettait à jour sans qu'aucun
             retour ne soit donné. */}
          <p
            aria-live="polite"
            className="font-display text-marine-900 mb-6 text-xl font-bold tracking-tight"
          >
            {filteredVehicles.length}{" "}
            <span className="text-ink-soft text-base font-medium">
              {filteredVehicles.length > 1
                ? dict.vehiclesPage.resultsPlural
                : dict.vehiclesPage.resultsSingular}
            </span>
          </p>
          <VehicleGrid vehicles={filteredVehicles} locale={locale} />
        </div>
      </div>
    </div>
  );
}
