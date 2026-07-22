"use client";

import { useVehicleFilters } from "@/hooks/useVehicleFilters";
import { getAvailableBrands } from "@/lib/vehicles";
import { VehicleFilters } from "./VehicleFilters";
import { VehicleGrid } from "./VehicleGrid";
import type { Locale } from "@/lib/i18n";
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
  const availableBrands = getAvailableBrands(vehicles);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <VehicleFilters
        locale={locale}
        availableBrands={availableBrands}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />
      <VehicleGrid vehicles={filteredVehicles} locale={locale} />
    </div>
  );
}
