"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { PriceTag } from "@/components/ui/PriceTag";
import { VehicleImage } from "@/components/ui/VehicleImage";
import type { Vehicle } from "@/types/vehicle";
import type { BookingEstimate } from "@/types/booking";
import type { Locale } from "@/lib/i18n";

interface BookingSummaryProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  onChangeVehicle: (id: string) => void;
  estimate: BookingEstimate;
  hasDates: boolean;
  locale: Locale;
}

export function BookingSummary({
  vehicle,
  allVehicles,
  onChangeVehicle,
  estimate,
  hasDates,
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
        {/* Prix / jour en indication, mais le montant mis en avant est le
           total de la location — le même que celui affiché sur la carte de
           résultats et dans le formulaire. */}
        <p className="text-ink-soft mt-2 text-sm">
          <PriceTag priceMad={vehicle.pricePerDayMad} />
          <span className="ml-1">{locale === "en" ? "/day" : "/jour"}</span>
        </p>
      </div>

      {hasDates && (
        <div className="bg-marine-50 mt-5 flex items-center justify-between rounded-2xl px-5 py-4">
          <span className="text-ink-soft text-sm">
            {estimate.days}{" "}
            {locale === "en"
              ? estimate.days > 1
                ? "days"
                : "day"
              : estimate.days > 1
                ? "jours"
                : "jour"}
          </span>
          <span className="font-display text-marine-900 text-xl font-bold">
            {format(estimate.totalPriceMad)}
          </span>
        </div>
      )}

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

    </div>
  );
}
