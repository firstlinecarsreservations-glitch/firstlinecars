"use client";

import { useId } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { ReservationDates } from "@/types/booking";

interface ReservationDateFieldsProps {
  value: ReservationDates;
  onChange: (next: ReservationDates) => void;
  locale: Locale;
  /**
   * `dark` : posé sur le fond marine du Hero (libellés clairs).
   * `light` : sur fond blanc (/vehicules, /booking).
   */
  tone?: "light" | "dark";
  /**
   * Nombre max de colonnes sur grand écran. La barre de recherche (Hero,
   * /vehicules) est large et tient sur 4 ; la colonne étroite du formulaire
   * de réservation reste sur 2 pour que les libellés ne passent pas à la
   * ligne.
   */
  columns?: 2 | 4;
}

/** `YYYY-MM-DD` du jour, en local — borne minimale des sélecteurs de date. */
function todayInput(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Les quatre champs date/heure de la réservation, en composant contrôlé pur.
 * Réutilisé tel quel par la barre de recherche (Hero, /vehicules) et par le
 * formulaire de réservation (/booking) — la saisie des dates n'existe donc
 * qu'à un seul endroit.
 */
export function ReservationDateFields({
  value,
  onChange,
  locale,
  tone = "light",
  columns = 4,
}: ReservationDateFieldsProps) {
  const dict = getDictionary(locale);
  const t = dict.search;
  const fieldId = useId();

  const labelClasses =
    tone === "dark"
      ? "mb-2 block text-xs font-semibold uppercase tracking-wide text-white/80"
      : "mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft";

  const inputClasses =
    "w-full rounded-xl border border-marine-100 bg-white px-4 py-3 text-sm text-marine-900 transition-colors focus:border-marine-500 focus:outline-none";

  const today = todayInput();

  const fields = [
    {
      key: "pickupDate" as const,
      label: t.pickupDate,
      type: "date",
      min: today,
    },
    { key: "pickupTime" as const, label: t.pickupTime, type: "time" },
    {
      key: "returnDate" as const,
      label: t.returnDate,
      type: "date",
      // Le retour ne peut pas précéder la prise en charge : la borne suit
      // la date choisie plus haut, ce qui bloque l'inversion à la source.
      min: value.pickupDate || today,
    },
    { key: "returnTime" as const, label: t.returnTime, type: "time" },
  ];

  const gridClasses =
    columns === 4
      ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-3 sm:grid-cols-2";

  return (
    <div className={gridClasses}>
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={`${fieldId}-${field.key}`} className={labelClasses}>
            {field.label}
          </label>
          <input
            id={`${fieldId}-${field.key}`}
            type={field.type}
            value={value[field.key]}
            min={field.min}
            onChange={(e) => onChange({ ...value, [field.key]: e.target.value })}
            className={inputClasses}
          />
        </div>
      ))}
    </div>
  );
}
