"use client";

import { useId } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { VehicleFilters as VehicleFiltersType } from "@/types/vehicle";

interface VehicleFiltersProps {
  locale: Locale;
  availableBrands: string[];
  filters: VehicleFiltersType;
  onChange: <K extends keyof VehicleFiltersType>(
    key: K,
    value: VehicleFiltersType[K],
  ) => void;
  onReset: () => void;
}

interface Option {
  value: string;
  label: string;
}

/**
 * Les trois filtres étaient des <select> natifs. Ils sont remplacés par
 * des groupes de boutons radio : toutes les options sont visibles d'un
 * coup d'œil (on voit les marques disponibles sans ouvrir de menu) et un
 * filtre actif se lit sans interaction.
 *
 * Ce sont de vrais <input type="radio"> masqués visuellement, et non des
 * <button> stylés : le groupement, la navigation aux flèches et
 * l'annonce "2 sur 6" par les lecteurs d'écran viennent gratuitement
 * avec l'élément natif.
 */
export function VehicleFilters({
  locale,
  availableBrands,
  filters,
  onChange,
  onReset,
}: VehicleFiltersProps) {
  const dict = getDictionary(locale);
  const f = dict.vehiclesPage.filters;
  const groupId = useId();

  const hasActiveFilters = Boolean(
    filters.brand || filters.transmission || filters.fuel,
  );

  const brandOptions: Option[] = [
    { value: "", label: f.all },
    ...availableBrands.map((brand) => ({ value: brand, label: brand })),
  ];

  return (
    <aside className="bg-sand-50 rounded-2xl p-6">
      {/* Marque : pastilles, parce que les valeurs sont courtes et
         nombreuses — elles se lisent en une seule grille. */}
      <fieldset>
        <legend className="text-marine-900 text-xs font-bold tracking-[0.1em] uppercase">
          {f.brand}
        </legend>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {brandOptions.map((option) => (
            <label key={option.value || "all"} className="cursor-pointer">
              <input
                type="radio"
                name={`${groupId}-brand`}
                value={option.value}
                checked={(filters.brand ?? "") === option.value}
                onChange={() => onChange("brand", option.value || undefined)}
                className="peer sr-only"
              />
              <span className="border-marine-100 text-marine-700 hover:border-marine-300 peer-checked:border-marine-700 peer-checked:bg-marine-700 peer-focus-visible:outline-marine-700 block rounded-lg border bg-white px-3.5 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Transmission et carburant : listes verticales, peu de valeurs
         qui se comparent mieux en colonne. */}
      <RadioList
        legend={f.transmission}
        name={`${groupId}-transmission`}
        options={[
          { value: "", label: f.all },
          { value: "automatic", label: f.automatic },
          { value: "manual", label: f.manual },
        ]}
        selected={filters.transmission ?? ""}
        onSelect={(value) =>
          onChange(
            "transmission",
            (value || undefined) as VehicleFiltersType["transmission"],
          )
        }
      />

      <RadioList
        legend={f.fuel}
        name={`${groupId}-fuel`}
        options={[
          { value: "", label: f.all },
          { value: "diesel", label: f.diesel },
          { value: "essence", label: f.essence },
          { value: "hybrid", label: f.hybrid },
        ]}
        selected={filters.fuel ?? ""}
        onSelect={(value) =>
          onChange("fuel", (value || undefined) as VehicleFiltersType["fuel"])
        }
      />

      {/* Désactivé quand aucun filtre n'est actif : le bouton ne promet
         plus une action sans effet. */}
      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="border-marine-100 mt-8 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-marine-700 transition-colors hover:border-marine-300 hover:text-marine-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {f.reset}
      </button>
    </aside>
  );
}

interface RadioListProps {
  legend: string;
  name: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
}

function RadioList({
  legend,
  name,
  options,
  selected,
  onSelect,
}: RadioListProps) {
  return (
    <fieldset className="mt-8">
      <legend className="text-marine-900 text-xs font-bold tracking-[0.1em] uppercase">
        {legend}
      </legend>
      <div className="mt-3.5 flex flex-col gap-0.5">
        {options.map((option) => (
          <label
            key={option.value || "all"}
            className="group flex cursor-pointer items-center gap-3 py-1.5"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={() => onSelect(option.value)}
              className="peer sr-only"
            />
            <span className="border-marine-100 group-hover:border-marine-300 peer-checked:border-marine-700 peer-checked:bg-marine-700 peer-focus-visible:outline-marine-700 h-5 w-5 shrink-0 rounded-md border bg-white transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" />
            <span className="text-ink-soft peer-checked:text-marine-900 text-sm transition-colors peer-checked:font-medium">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
