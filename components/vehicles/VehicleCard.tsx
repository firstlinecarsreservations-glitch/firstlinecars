import Link from "next/link";
import { Fuel, Users, Cog } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { buildVehicleWhatsAppMessage } from "@/lib/whatsapp";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PriceTag } from "@/components/ui/PriceTag";
import { VehicleImage } from "@/components/ui/VehicleImage";
import type { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  locale: Locale;
}

export function VehicleCard({ vehicle, locale }: VehicleCardProps) {
  const dict = getDictionary(locale);
  const bookingHref = `/${locale}/booking?carId=${vehicle.id}`;

  const transmissionLabel =
    vehicle.transmission === "automatic"
      ? dict.vehiclesPage.filters.automatic
      : dict.vehiclesPage.filters.manual;
  const fuelLabel = dict.vehiclesPage.filters[vehicle.fuel];

  return (
    <Card className="group flex flex-col overflow-hidden">
      <div className="bg-marine-50 relative aspect-4/3 w-full overflow-hidden">
        <VehicleImage
          src={vehicle.images[0] ?? "/images/vehicles/placeholder.jpg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-ink-soft text-xs font-medium tracking-wide uppercase">
          {vehicle.brand}
        </p>
        <h3 className="font-display text-marine-900 mt-1 text-lg font-semibold">
          {vehicle.model}
        </h3>

        <p className="font-display text-marine-700 mt-2 text-xl font-bold">
          <PriceTag priceMad={vehicle.pricePerDayMad} />
          <span className="text-ink-soft ml-1 text-sm font-normal">
            {dict.fleet.perDay}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge icon={<Cog className="h-3.5 w-3.5" aria-hidden="true" />}>
            {transmissionLabel}
          </Badge>
          <Badge icon={<Fuel className="h-3.5 w-3.5" aria-hidden="true" />}>
            {fuelLabel}
          </Badge>
          <Badge icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}>
            {vehicle.seats} {dict.vehicleCard.seats}
          </Badge>
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            href={bookingHref}
            className="bg-marine-700 font-display hover:bg-marine-900 flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors"
          >
            {dict.vehicleCard.book}
          </Link>
          <WhatsAppButton
            message={buildVehicleWhatsAppMessage(
              vehicle.brand,
              vehicle.model,
              locale,
            )}
            label={dict.vehicleCard.whatsapp}
            className="flex-1"
          />
        </div>
      </div>
    </Card>
  );
}
