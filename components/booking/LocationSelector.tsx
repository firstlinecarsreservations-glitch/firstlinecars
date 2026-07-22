"use client";

import { useId } from "react";
import { Building2, Plane, Home, Check } from "lucide-react";
import type { DeliveryLocation, AirportCity } from "@/types/booking";

interface LocationSelectorProps {
  value: DeliveryLocation;
  onChange: (value: DeliveryLocation) => void;
  address: string;
  onAddressChange: (value: string) => void;
  airportCity: AirportCity | undefined;
  onAirportCityChange: (value: AirportCity) => void;
  addressError?: string;
  airportError?: string;
  locale: "fr" | "en";
}

const OPTIONS: {
  value: DeliveryLocation;
  icon: typeof Building2;
  fr: string;
  en: string;
}[] = [
  { value: "agency", icon: Building2, fr: "Agence", en: "Agency" },
  { value: "airport", icon: Plane, fr: "Aéroport", en: "Airport" },
  {
    value: "custom",
    icon: Home,
    fr: "Hôtel / Domicile",
    en: "Hotel / Address",
  },
];

const AIRPORTS: { value: AirportCity; fr: string; en: string; code: string }[] =
  [
    {
      value: "agadir",
      fr: "Aéroport Agadir – Al Massira",
      en: "Agadir – Al Massira Airport",
      code: "AGA",
    },
    {
      value: "marrakech",
      fr: "Aéroport Marrakech – Menara",
      en: "Marrakech – Menara Airport",
      code: "RAK",
    },
  ];

export function LocationSelector({
  value,
  onChange,
  address,
  onAddressChange,
  airportCity,
  onAirportCityChange,
  addressError,
  airportError,
  locale,
}: LocationSelectorProps) {
  const fieldId = useId();

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={
          locale === "en" ? "Pickup location" : "Lieu de récupération"
        }
        className="grid gap-3 sm:grid-cols-3"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors ${
                isActive
                  ? "border-marine-700 bg-marine-50 text-marine-900"
                  : "border-marine-100 text-ink-soft hover:bg-marine-50"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {locale === "en" ? option.en : option.fr}
            </button>
          );
        })}
      </div>

      {/* Sous-choix aéroport : Agadir Al Massira est l'aéroport local,
         mais beaucoup de touristes atterrissent à Marrakech-Menara et
         font la route jusqu'à Agadir — d'où ce choix explicite plutôt
         que de supposer Agadir par défaut. */}
      {value === "airport" && (
        <div
          role="radiogroup"
          aria-label={locale === "en" ? "Airport" : "Aéroport"}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          {AIRPORTS.map((airport) => {
            const isActive = airportCity === airport.value;
            return (
              <button
                key={airport.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onAirportCityChange(airport.value)}
                className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${
                  isActive
                    ? "text-marine-900 border-amber-500 bg-amber-50"
                    : "border-marine-100 text-ink-soft hover:bg-marine-50"
                }`}
              >
                <span>
                  <span className="block font-medium">
                    {locale === "en" ? airport.en : airport.fr}
                  </span>
                  <span className="text-ink-soft/70 text-xs">
                    {airport.code}
                  </span>
                </span>
                {isActive && (
                  <Check
                    className="h-4 w-4 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {value === "airport" && airportError && (
        <p className="text-clay-500 mt-2 text-xs">{airportError}</p>
      )}

      {value === "custom" && (
        <div className="mt-4">
          <label
            htmlFor={`${fieldId}-address`}
            className="text-ink-soft mb-2 block text-xs font-semibold tracking-wide uppercase"
          >
            {locale === "en" ? "Delivery address" : "Adresse de livraison"}
          </label>
          <input
            id={`${fieldId}-address`}
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            aria-invalid={Boolean(addressError)}
            aria-describedby={
              addressError ? `${fieldId}-address-error` : undefined
            }
            placeholder={
              locale === "en"
                ? "Hotel name, street..."
                : "Nom de l'hôtel, rue..."
            }
            className="border-marine-100 focus:border-marine-500 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
          />
          {addressError && (
            <p
              id={`${fieldId}-address-error`}
              className="text-clay-500 mt-1.5 text-xs"
            >
              {addressError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
