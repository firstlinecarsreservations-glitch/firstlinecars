"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { combineDateTime } from "@/lib/booking";
import type { Vehicle } from "@/types/vehicle";
import type { ReservationDates } from "@/types/booking";
import type { Locale } from "@/lib/i18n";

type SubmitStatus = "idle" | "loading" | "success" | "error";

/**
 * Les messages étaient codés en dur en français et s'affichaient tels
 * quels sur la version anglaise du site. Ils suivent maintenant la langue
 * de la page.
 */
const MESSAGES = {
  fr: {
    nameTooShort: "Merci d'indiquer votre nom complet.",
    nationalityRequired: "Merci d'indiquer votre nationalité.",
    phoneInvalid: "Numéro de téléphone invalide.",
    ageRequired: "Merci d'indiquer l'âge du conducteur.",
    ageTooYoung: "Le conducteur doit avoir au moins 21 ans.",
    ageTooOld: "Merci de vérifier l'âge saisi.",
    emailInvalid: "Adresse email invalide.",
    datesRequired: "Merci de sélectionner vos dates de location.",
    returnBeforePickup:
      "La date de retour ne peut pas précéder la prise en charge.",
    addressRequired: "Merci d'indiquer l'adresse de livraison.",
    airportRequired: "Merci de choisir un aéroport.",
  },
  en: {
    nameTooShort: "Please enter your full name.",
    nationalityRequired: "Please enter your nationality.",
    phoneInvalid: "Invalid phone number.",
    ageRequired: "Please enter the driver's age.",
    ageTooYoung: "The driver must be at least 21 years old.",
    ageTooOld: "Please check the age entered.",
    emailInvalid: "Invalid email address.",
    datesRequired: "Please select your rental dates.",
    returnBeforePickup: "The return cannot be earlier than the pickup.",
    addressRequired: "Please enter the delivery address.",
    airportRequired: "Please choose an airport.",
  },
} as const;

function buildSchema(locale: Locale) {
  const t = MESSAGES[locale];

  return z
    .object({
      fullName: z.string().min(2, t.nameTooShort),
      nationality: z.string().min(2, t.nationalityRequired),
      phone: z.string().min(6, t.phoneInvalid),
      // Un <input type="number"> renvoie une chaîne : la conversion se
      // fait à l'inscription du champ (valueAsNumber), pas via
      // z.coerce — celui-ci rendrait le type d'entrée du schéma
      // `unknown` et casserait le typage du resolver.
      driverAge: z
        .number({ message: t.ageRequired })
        .int(t.ageRequired)
        .min(21, t.ageTooYoung)
        .max(99, t.ageTooOld),
      email: z.string().email(t.emailInvalid).optional().or(z.literal("")),
      deliveryLocation: z.enum(["agency", "airport", "custom"]),
      airportCity: z.enum(["agadir", "marrakech"]).optional(),
      deliveryAddress: z.string().optional(),
    })
    // Chaque règle pointe vers le champ concerné (`path`) : l'erreur
    // s'affiche à côté du contrôle fautif au lieu d'un message générique
    // en bas du formulaire, loin de ce qu'il faut corriger.
    .refine(
      (data) =>
        data.deliveryLocation !== "custom" ||
        Boolean(data.deliveryAddress?.trim()),
      { message: t.addressRequired, path: ["deliveryAddress"] },
    )
    .refine(
      (data) =>
        data.deliveryLocation !== "airport" || Boolean(data.airportCity),
      { message: t.airportRequired, path: ["airportCity"] },
    );
}

export type BookingFormValues = z.infer<ReturnType<typeof buildSchema>>;

/**
 * Gère les champs personnels et le lieu de livraison via react-hook-form.
 * Les dates/heures, elles, vivent dans le Context de réservation et sont
 * remontées par la page (`dates`) : elles sont pré-remplies depuis la
 * recherche et restent éditables, sans jamais être ressaisies. Le hook les
 * combine en dates ISO au moment de l'envoi.
 */
export function useBookingForm(
  vehicle: Vehicle,
  locale: Locale,
  dates: ReservationDates,
) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [dateError, setDateError] = useState<string | undefined>();

  const schema = useMemo(() => buildSchema(locale), [locale]);
  const messages = MESSAGES[locale];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      nationality: "",
      phone: "",
      // undefined plutôt que 0 : le champ s'affiche vide au lieu de
      // pré-remplir un âge que personne n'a saisi.
      driverAge: undefined,
      email: "",
      deliveryLocation: "agency",
      airportCity: undefined,
      deliveryAddress: "",
    },
  });

  const deliveryLocation = form.watch("deliveryLocation");

  async function onSubmit(values: BookingFormValues) {
    // Les dates viennent des <input> natifs : `min` empêche déjà l'inversion
    // dans le sélecteur, mais une saisie manuelle pourrait la contourner —
    // d'où cette validation avant l'envoi, en plus du refine côté serveur.
    const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
    const dropoff = combineDateTime(dates.returnDate, dates.returnTime);
    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      setDateError(messages.datesRequired);
      return;
    }
    if (dropoff.getTime() < pickup.getTime()) {
      setDateError(messages.returnBeforePickup);
      return;
    }
    setDateError(undefined);

    setStatus("loading");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          fullName: values.fullName,
          nationality: values.nationality,
          phone: values.phone,
          driverAge: values.driverAge,
          email: values.email,
          deliveryLocation: values.deliveryLocation,
          airportCity:
            values.deliveryLocation === "airport"
              ? values.airportCity
              : undefined,
          deliveryAddress:
            values.deliveryLocation === "custom"
              ? values.deliveryAddress
              : undefined,
          startDate: pickup.toISOString(),
          endDate: dropoff.toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Booking request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  /** Permet de repartir d'un formulaire vierge après un envoi réussi. */
  function startNewBooking() {
    form.reset();
    setStatus("idle");
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    deliveryLocation,
    status,
    dateError,
    startNewBooking,
  };
}
