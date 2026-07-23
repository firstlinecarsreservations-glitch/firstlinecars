"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calculateEstimate } from "@/lib/booking";
import type { Vehicle } from "@/types/vehicle";
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
    phoneInvalid: "Numéro de téléphone invalide.",
    ageRequired: "Merci d'indiquer l'âge du conducteur.",
    ageTooYoung: "Le conducteur doit avoir au moins 21 ans.",
    ageTooOld: "Merci de vérifier l'âge saisi.",
    emailInvalid: "Adresse email invalide.",
    datesRequired: "Merci de sélectionner vos dates de location.",
    addressRequired: "Merci d'indiquer l'adresse de livraison.",
    airportRequired: "Merci de choisir un aéroport.",
  },
  en: {
    nameTooShort: "Please enter your full name.",
    phoneInvalid: "Invalid phone number.",
    ageRequired: "Please enter the driver's age.",
    ageTooYoung: "The driver must be at least 21 years old.",
    ageTooOld: "Please check the age entered.",
    emailInvalid: "Invalid email address.",
    datesRequired: "Please select your rental dates.",
    addressRequired: "Please enter the delivery address.",
    airportRequired: "Please choose an airport.",
  },
} as const;

function buildSchema(locale: Locale) {
  const t = MESSAGES[locale];

  return z
    .object({
      fullName: z.string().min(2, t.nameTooShort),
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
      dateRange: z
        .object({ from: z.date().optional(), to: z.date().optional() })
        .optional(),
    })
    // Chaque règle pointe vers le champ concerné (`path`) : l'erreur
    // s'affiche à côté du contrôle fautif au lieu d'un message générique
    // en bas du formulaire, loin de ce qu'il faut corriger.
    .refine((data) => Boolean(data.dateRange?.from && data.dateRange?.to), {
      message: t.datesRequired,
      path: ["dateRange"],
    })
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
 * Source unique de vérité du formulaire : dates et lieu de livraison
 * étaient auparavant gérés dans des useState séparés, hors de
 * react-hook-form. La moitié des champs avait donc une validation par
 * champ, l'autre moitié un message global — et le serveur pouvait rejeter
 * une saisie que le client considérait valide.
 */
export function useBookingForm(vehicle: Vehicle, locale: Locale) {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const schema = useMemo(() => buildSchema(locale), [locale]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      // undefined plutôt que 0 : le champ s'affiche vide au lieu de
      // pré-remplir un âge que personne n'a saisi.
      driverAge: undefined,
      email: "",
      deliveryLocation: "agency",
      airportCity: undefined,
      deliveryAddress: "",
      dateRange: undefined,
    },
  });

  const deliveryLocation = form.watch("deliveryLocation");
  const dateRange = form.watch("dateRange");

  const estimate =
    dateRange?.from && dateRange?.to
      ? calculateEstimate(dateRange.from, dateRange.to, vehicle.pricePerDayMad)
      : null;

  async function onSubmit(values: BookingFormValues) {
    setStatus("loading");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          fullName: values.fullName,
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
          startDate: values.dateRange!.from!.toISOString(),
          endDate: values.dateRange!.to!.toISOString(),
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
    dateRange,
    estimate,
    status,
    startNewBooking,
  };
}
