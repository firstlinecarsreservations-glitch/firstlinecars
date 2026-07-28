import { z } from "zod";
import type { BookingEstimate } from "@/types/booking";
import type { ReservationDates } from "@/types/booking";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Combine une date (`YYYY-MM-DD`) et une heure (`HH:mm`) en un objet Date.
 * Retourne une Date invalide (isNaN) si l'un des deux est vide ou malformé —
 * les appelants doivent donc valider avec `Number.isNaN(d.getTime())`.
 */
export function combineDateTime(date: string, time: string): Date {
  if (!date) return new Date(NaN);
  return new Date(`${date}T${time || "00:00"}`);
}

/**
 * Source unique du calcul de prix de toute l'application (cartes de
 * résultats, formulaire de réservation, route API). Chaque écran fournit ses
 * propres dates, mais la logique de tarification n'existe qu'ici.
 *
 * Le nombre de jours facturés est le nombre de tranches de 24 h entamées,
 * jamais moins de 1 : une prise et un retour le même jour restent facturés
 * une journée, et une durée invalide ou inversée retombe sur 1 jour plutôt
 * que d'afficher un total négatif ou NaN.
 */
export function calculateEstimate(
  pickup: Date,
  dropoff: Date,
  pricePerDayMad: number,
): BookingEstimate {
  const diffMs = dropoff.getTime() - pickup.getTime();
  const days =
    Number.isFinite(diffMs) && diffMs > 0 ? Math.ceil(diffMs / DAY_MS) : 1;
  return { days, totalPriceMad: days * pricePerDayMad };
}

/** Estimation directement à partir des 4 champs de réservation (dates+heures). */
export function estimateFromReservation(
  dates: ReservationDates,
  pricePerDayMad: number,
): BookingEstimate {
  return calculateEstimate(
    combineDateTime(dates.pickupDate, dates.pickupTime),
    combineDateTime(dates.returnDate, dates.returnTime),
    pricePerDayMad,
  );
}

export const bookingRequestSchema = z
  .object({
    vehicleId: z.string().min(1),
    fullName: z.string().min(2),
    nationality: z.string().min(2),
    phone: z.string().min(6),
    driverAge: z.number().int().min(21).max(99),
    email: z.string().email().optional().or(z.literal("")),
    deliveryLocation: z.enum(["agency", "airport", "custom"]),
    airportCity: z.enum(["agadir", "marrakech"]).optional(),
    deliveryAddress: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine(
    (data) =>
      data.deliveryLocation !== "custom" || Boolean(data.deliveryAddress),
    {
      message: "L'adresse de livraison est requise.",
      path: ["deliveryAddress"],
    },
  )
  .refine(
    (data) => data.deliveryLocation !== "airport" || Boolean(data.airportCity),
    { message: "Merci de préciser l'aéroport.", path: ["airportCity"] },
  )
  .refine(
    (data) =>
      !Number.isNaN(Date.parse(data.startDate)) &&
      !Number.isNaN(Date.parse(data.endDate)),
    { message: "Dates invalides.", path: ["startDate"] },
  )
  // Le schéma exigeait endDate > startDate, ce qui rejetait les locations
  // à la journée — alors que calculateEstimate les facture explicitement
  // 1 jour (Math.max(rawDays, 1)). Le serveur refusait donc une réservation
  // que le calendrier laissait sélectionner, et le client ne voyait qu'un
  // "une erreur est survenue" générique. La location d'un jour est un
  // produit réel : c'est la contrainte serveur qui était fausse.
  .refine((data) => Date.parse(data.endDate) >= Date.parse(data.startDate), {
    message: "La date de retour ne peut pas précéder la date de départ.",
    path: ["endDate"],
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
