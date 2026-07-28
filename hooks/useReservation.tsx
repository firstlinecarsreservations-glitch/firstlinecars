"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { combineDateTime, estimateFromReservation } from "@/lib/booking";
import type { BookingEstimate, ReservationDates } from "@/types/booking";

/**
 * Ancre du formulaire de recherche dans le Hero. Le bouton « Rechercher » des
 * cartes de la page d'accueil fait défiler jusqu'à cet élément — la constante
 * évite de dupliquer la chaîne entre le Hero et les cartes.
 */
export const RESERVATION_SEARCH_ID = "reservation-search";

/**
 * État initial vide : tant que l'utilisateur n'a pas renseigné ses dates, on
 * ne présume aucune durée. Les cartes affichent alors le prix / jour, et ne
 * basculent sur le prix total qu'une fois la recherche remplie.
 */
export function defaultReservationDates(): ReservationDates {
  return { pickupDate: "", pickupTime: "", returnDate: "", returnTime: "" };
}

/**
 * Vrai lorsque la période de location est complète et cohérente (les deux
 * dates sont saisies et le retour ne précède pas la prise en charge). Sert de
 * bascule « prix / jour » ↔ « prix total » dans toute l'application.
 */
export function hasValidReservation(dates: ReservationDates): boolean {
  if (!dates.pickupDate || !dates.returnDate) return false;
  const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
  const dropoff = combineDateTime(dates.returnDate, dates.returnTime);
  return (
    !Number.isNaN(pickup.getTime()) &&
    !Number.isNaN(dropoff.getTime()) &&
    dropoff.getTime() >= pickup.getTime()
  );
}

interface ReservationContextValue {
  dates: ReservationDates;
  setDates: (dates: ReservationDates) => void;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

/**
 * État partagé des dates de réservation. Placé dans le layout, il survit à la
 * navigation client entre le Hero, /vehicules et /booking sans passer par
 * l'URL ni par des props traversant tout l'arbre. Point d'accroche naturel
 * pour une future connexion à un vrai système de disponibilités.
 */
export function ReservationProvider({ children }: { children: ReactNode }) {
  const [dates, setDates] = useState<ReservationDates>(defaultReservationDates);

  const value = useMemo(() => ({ dates, setDates }), [dates]);

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation(): ReservationContextValue {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error(
      "useReservation doit être utilisé à l'intérieur de ReservationProvider",
    );
  }
  return ctx;
}

/**
 * Estimation du prix total. Utilise les dates passées en argument si fournies
 * (page /booking, où les champs sont éditables localement), sinon celles du
 * Context (cartes de résultats). Le calcul lui-même reste dans lib/booking.ts.
 */
export function useReservationEstimate(
  pricePerDayMad: number,
  overrideDates?: ReservationDates,
): BookingEstimate {
  const { dates } = useReservation();
  const effective = overrideDates ?? dates;
  return useMemo(
    () => estimateFromReservation(effective, pricePerDayMad),
    [effective, pricePerDayMad],
  );
}
