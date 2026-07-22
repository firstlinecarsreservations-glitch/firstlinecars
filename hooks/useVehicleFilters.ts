"use client";

import { useMemo, useState } from "react";
import { filterVehicles } from "@/lib/vehicles";
import type { Vehicle, VehicleFilters } from "@/types/vehicle";

/**
 * Gère l'état des filtres et retourne la liste de véhicules déjà filtrée.
 * Séparé de VehicleFilters (composant de présentation) pour rester
 * testable indépendamment du rendu.
 */
export function useVehicleFilters(allVehicles: Vehicle[]) {
  const [filters, setFilters] = useState<VehicleFilters>({});

  const filteredVehicles = useMemo(
    () => filterVehicles(allVehicles, filters),
    [allVehicles, filters],
  );

  function updateFilter<K extends keyof VehicleFilters>(
    key: K,
    value: VehicleFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  }

  function resetFilters() {
    setFilters({});
  }

  return { filters, filteredVehicles, updateFilter, resetFilters };
}
