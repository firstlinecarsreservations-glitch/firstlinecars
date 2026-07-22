"use client";

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

export function VehicleFilters({
  locale,
  availableBrands,
  filters,
  onChange,
  onReset,
}: VehicleFiltersProps) {
  const dict = getDictionary(locale);
  const f = dict.vehiclesPage.filters;

  return (
    <aside className="bg-sand-50 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-marine-900 text-base font-semibold">
          {f.title}
        </h2>
        <button
          onClick={onReset}
          className="text-marine-700 hover:text-marine-900 text-xs font-medium underline underline-offset-2"
        >
          {f.reset}
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-ink-soft text-xs font-semibold tracking-wide uppercase">
            {f.brand}
          </label>
          <select
            value={filters.brand ?? ""}
            onChange={(e) => onChange("brand", e.target.value || undefined)}
            className="border-marine-100 focus:border-marine-500 mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">{f.all}</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-ink-soft text-xs font-semibold tracking-wide uppercase">
            {f.transmission}
          </label>
          <select
            value={filters.transmission ?? ""}
            onChange={(e) =>
              onChange(
                "transmission",
                (e.target.value || undefined) as VehicleFiltersType["transmission"],
              )
            }
            className="border-marine-100 focus:border-marine-500 mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">{f.all}</option>
            <option value="manual">{f.manual}</option>
            <option value="automatic">{f.automatic}</option>
          </select>
        </div>

        <div>
          <label className="text-ink-soft text-xs font-semibold tracking-wide uppercase">
            {f.fuel}
          </label>
          <select
            value={filters.fuel ?? ""}
            onChange={(e) =>
              onChange(
                "fuel",
                (e.target.value || undefined) as VehicleFiltersType["fuel"],
              )
            }
            className="border-marine-100 focus:border-marine-500 mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">{f.all}</option>
            <option value="diesel">{f.diesel}</option>
            <option value="essence">{f.essence}</option>
            <option value="hybrid">{f.hybrid}</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
