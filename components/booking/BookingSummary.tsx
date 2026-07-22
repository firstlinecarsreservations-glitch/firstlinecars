"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { PriceTag } from "@/components/ui/PriceTag";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { translateFeature } from "@/lib/vehicleFeatures";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/lib/i18n";

interface BookingSummaryProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  onChangeVehicle: (id: string) => void;
  locale: Locale;
}

export function BookingSummary({
  vehicle,
  allVehicles,
  onChangeVehicle,
  locale,
}: BookingSummaryProps) {
  // Le sélecteur affichait "{prix} MAD" en dur : changer de devise laissait
  // toutes les options figées en dirhams pendant que le prix au-dessus
  // basculait en euros.
  const { format } = useCurrency();
  const selectId = useId();

  return (
    <div className="shadow-card rounded-3xl bg-white p-6 sm:p-7">
      <div className="bg-marine-50 relative aspect-4/3 w-full overflow-hidden rounded-2xl">
        <VehicleImage
          src={vehicle.images[0] ?? "/images/vehicles/placeholder.jpg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          sizes="(min-width: 1024px) 420px, 100vw"
        />
      </div>

      <div className="mt-6">
        <p className="text-ink-soft text-xs font-medium tracking-wide uppercase">
          {vehicle.brand}
        </p>
        <h2 className="font-display text-marine-900 mt-1 text-2xl font-semibold tracking-tight">
          {vehicle.model}
        </h2>
        <p className="font-display text-marine-700 mt-2 text-lg font-bold">
          <PriceTag priceMad={vehicle.pricePerDayMad} />
          <span className="text-ink-soft ml-1 text-sm font-normal">
            {locale === "en" ? "/day" : "/jour"}
          </span>
        </p>
      </div>

      <div className="border-marine-100 mt-6 border-t pt-6">
        <label
          htmlFor={selectId}
          className="text-ink-soft text-xs font-semibold tracking-wide uppercase"
        >
          {locale === "en" ? "Change vehicle" : "Changer de voiture"}
        </label>
        <div className="relative mt-2">
          <select
            id={selectId}
            value={vehicle.id}
            onChange={(e) => onChangeVehicle(e.target.value)}
            className="border-marine-100 bg-sand-50 text-marine-900 focus:border-marine-500 w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-medium transition-colors"
          >
            {allVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} — {format(v.pricePerDayMad)}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-ink-soft pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
      </div>

      <ul className="border-marine-100 mt-6 flex flex-wrap gap-2 border-t pt-6">
        {vehicle.features.slice(0, 4).map((featureKey) => (
          <li
            key={featureKey}
            className="bg-marine-50 text-marine-700 rounded-full px-3 py-1 text-xs font-medium"
          >
            {translateFeature(featureKey, locale)}
          </li>
        ))}
      </ul>
    </div>
  );
}
