import { getDictionary, type Locale } from "@/lib/i18n";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";

interface VehicleGridProps {
  vehicles: Vehicle[];
  locale: Locale;
}

export function VehicleGrid({ vehicles, locale }: VehicleGridProps) {
  const dict = getDictionary(locale);

  if (vehicles.length === 0) {
    return (
      <p className="text-ink-soft py-16 text-center text-sm">
        {dict.vehiclesPage.noResults}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} />
      ))}
    </div>
  );
}
