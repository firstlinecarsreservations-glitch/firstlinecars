import { z } from "zod";
import { differenceInCalendarDays } from "date-fns";
import type { BookingEstimate } from "@/types/booking";

export function calculateEstimate(
  startDate: Date,
  endDate: Date,
  pricePerDayMad: number,
): BookingEstimate {
  const rawDays = differenceInCalendarDays(endDate, startDate);
  const days = Math.max(rawDays, 1);
  return { days, totalPriceMad: days * pricePerDayMad };
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
