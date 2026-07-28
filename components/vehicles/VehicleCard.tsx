"use client";

import { Fuel, Users, Gauge, CalendarCheck, Search } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { buildVehicleWhatsAppMessage } from "@/lib/whatsapp";
import {
  hasValidReservation,
  useReservation,
  useReservationEstimate,
} from "@/hooks/useReservation";
import { useCurrency } from "@/hooks/useCurrency";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PriceTag } from "@/components/ui/PriceTag";
import { VehicleImage } from "@/components/ui/VehicleImage";
import type { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  locale: Locale;
  /**
   * `home` : vitrine sur la page d'accueil — prix indicatif par jour, le
   * bouton principal renvoie vers la recherche.
   * `results` : page /vehicules — total pour la durée choisie, le bouton
   * principal ouvre la réservation.
   */
  variant?: "home" | "results";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function VehicleCard({
  vehicle,
  locale,
  variant = "results",
}: VehicleCardProps) {
  const dict = getDictionary(locale);
  const bookingHref = `/${locale}/booking?carId=${vehicle.id}`;

  // Tant que la recherche n'est pas remplie, on affiche le prix / jour ; dès
  // que des dates valides sont saisies, la carte bascule sur le total de la
  // location (recalculé quand les dates changent). Cette bascule vaut aussi
  // bien sur l'accueil que sur la page résultats.
  const { dates } = useReservation();
  const showTotal = hasValidReservation(dates);
  const estimate = useReservationEstimate(vehicle.pricePerDayMad);
  const { format } = useCurrency();

  const isAutomatic = vehicle.transmission === "automatic";

  // `short` est affiché (les tuiles sont étroites), `spoken` est lu par
  // les lecteurs d'écran, pour qui "Manu" seul ne veut rien dire.
  const specs = [
    {
      icon: Gauge,
      short: isAutomatic
        ? dict.vehicleCard.automaticShort
        : dict.vehicleCard.manualShort,
      spoken: isAutomatic
        ? dict.vehiclesPage.filters.automatic
        : dict.vehiclesPage.filters.manual,
    },
    {
      icon: Fuel,
      short: dict.vehiclesPage.filters[vehicle.fuel],
      spoken: dict.vehiclesPage.filters[vehicle.fuel],
    },
    {
      icon: Users,
      short: `${vehicle.seats} ${dict.vehicleCard.seatsShort}`,
      spoken: `${vehicle.seats} ${dict.vehicleCard.seats}`,
    },
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
            {showTotal ? (
              <>
                <span className="font-display text-marine-900 block text-2xl font-bold">
                  {format(estimate.totalPriceMad)}
                </span>
                <span className="text-ink-soft mt-0.5 block text-[11px] font-semibold tracking-[0.1em] uppercase">
                  {dict.vehicleCard.total} · {estimate.days}{" "}
                  {estimate.days > 1
                    ? dict.vehicleCard.days
                    : dict.vehicleCard.day}
                </span>
              </>
            ) : (
              <>
                <PriceTag
                  priceMad={vehicle.pricePerDayMad}
                  className="font-display text-marine-900 text-2xl font-bold"
                />
                <span className="text-ink-soft mt-0.5 block text-[11px] font-semibold tracking-[0.1em] uppercase">
                  {dict.fleet.perDay}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Trois tuiles de largeur égale, contenu centré. */}
        <ul className="mt-5 grid grid-cols-3 gap-2.5">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <li
                key={spec.spoken}
                className="bg-marine-50 flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3.5"
              >
                <Icon
                  className="text-marine-500 h-5 w-5"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <span
                  aria-hidden="true"
                  className="text-marine-900 text-[11px] font-bold tracking-[0.06em] uppercase"
                >
                  {spec.short}
                </span>
                <span className="sr-only">{spec.spoken}</span>
              </li>
            );
          })}
        </ul>

        {/* mt-auto : quelle que soit la longueur du nom du modèle, les
           boutons de toutes les cartes d'une rangée s'alignent. */}
        <div className="mt-auto flex flex-col gap-2.5 pt-6">
          {variant === "results" ? (
            <Button href={bookingHref} variant="secondary" className="w-full">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {dict.vehicleCard.book}
            </Button>
          ) : (
            // Sur l'accueil, « Rechercher » ne lance pas de réservation : il
            // ramène l'utilisateur tout en haut de la page, sur le formulaire
            // du Hero, pour démarrer le parcours par le choix des dates.
            <Button variant="secondary" className="w-full" onClick={scrollToTop}>
              <Search className="h-4 w-4" aria-hidden="true" />
              {dict.vehicleCard.search}
            </Button>
          )}
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
