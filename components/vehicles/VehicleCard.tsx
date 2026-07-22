import { Fuel, Users, Gauge, CalendarCheck } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { buildVehicleWhatsAppMessage } from "@/lib/whatsapp";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

  const specs = [
    { icon: Gauge, label: transmissionLabel },
    { icon: Fuel, label: fuelLabel },
    { icon: Users, label: `${vehicle.seats} ${dict.vehicleCard.seats}` },
  ];

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <div className="bg-marine-50 relative aspect-4/3 w-full overflow-hidden">
        <VehicleImage
          src={vehicle.images[0] ?? "/images/vehicles/placeholder.jpg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* La marque passe en pastille sur l'image : le nom du modèle
           devient le seul titre de la carte, au lieu d'un surtitre et
           d'un titre qui se disputaient la hiérarchie. */}
        <span className="bg-marine-900/85 absolute top-4 left-4 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white uppercase backdrop-blur-sm">
          {vehicle.brand}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Modèle à gauche, prix à droite sur la même ligne de base : les
           prix se comparent d'une carte à l'autre sur une colonne
           constante, sans avoir à les chercher dans le texte. */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-marine-900 text-2xl font-bold tracking-tight">
            {vehicle.model}
          </h3>
          <div className="shrink-0 text-right">
            <PriceTag
              priceMad={vehicle.pricePerDayMad}
              className="font-display text-marine-900 text-2xl font-bold"
            />
            <span className="text-ink-soft mt-0.5 block text-[11px] font-semibold tracking-[0.1em] uppercase">
              {dict.fleet.perDay}
            </span>
          </div>
        </div>

        {/* Grille de 3 colonnes égales plutôt qu'un flex-wrap : une
           caractéristique longue ("Automatique") faisait passer la
           troisième à la ligne sur certaines cartes seulement, et les
           cartes d'une même rangée n'avaient plus la même hauteur de
           contenu. Ici la ligne est toujours unique. */}
        <ul className="text-ink-soft mt-5 grid grid-cols-3 gap-x-2 text-[13px]">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <li
                key={spec.label}
                title={spec.label}
                className="flex min-w-0 items-center gap-1.5"
              >
                <Icon
                  className="text-marine-500 h-4 w-4 shrink-0"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <span className="truncate">{spec.label}</span>
              </li>
            );
          })}
        </ul>

        {/* mt-auto : quelle que soit la longueur du nom du modèle, les
           boutons de toutes les cartes d'une rangée s'alignent. */}
        <div className="mt-auto flex flex-col gap-2.5 pt-6">
          <Button href={bookingHref} variant="secondary" className="w-full">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {dict.vehicleCard.book}
          </Button>
          <WhatsAppButton
            message={buildVehicleWhatsAppMessage(
              vehicle.brand,
              vehicle.model,
              locale,
            )}
            label={dict.vehicleCard.whatsapp}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}
