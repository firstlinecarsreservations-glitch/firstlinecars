"use client";

import { DayPicker } from "react-day-picker";

/**
 * Le type de plage vient du schéma de validation du formulaire (les deux
 * bornes sont optionnelles tant que l'utilisateur n'a pas fini sa
 * sélection), pas de react-day-picker. La feuille de style de la librairie
 * est importée une seule fois, dans globals.css.
 */
export interface DatePickerRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  range: DatePickerRange | undefined;
  onChange: (range: DatePickerRange | undefined) => void;
  locale: "fr" | "en";
}

export function DateRangePicker({
  range,
  onChange,
  locale,
}: DateRangePickerProps) {
  return (
    <div className="border-marine-100 rounded-xl border p-3">
      <DayPicker
        mode="range"
        selected={range as { from: Date | undefined; to?: Date }}
        onSelect={(next) => onChange(next ?? undefined)}
        disabled={{ before: new Date() }}
        numberOfMonths={1}
        weekStartsOn={locale === "fr" ? 1 : 0}
        className="flc-daypicker"
      />
    </div>
  );
}
