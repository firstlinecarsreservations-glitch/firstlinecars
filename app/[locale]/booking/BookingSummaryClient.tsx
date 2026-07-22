"use client";

import { useState } from "react";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingForm } from "@/components/booking/BookingForm";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/lib/i18n";

interface BookingSummaryClientProps {
  initialVehicle: Vehicle;
  allVehicles: Vehicle[];
  locale: Locale;
}

export function BookingSummaryClient({
  initialVehicle,
  allVehicles,
  locale,
}: BookingSummaryClientProps) {
  const [vehicle, setVehicle] = useState(initialVehicle);

  function handleChangeVehicle(id: string) {
    const next = allVehicles.find((v) => v.id === id);
    if (next) setVehicle(next);
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[400px_1fr] lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28">
        <BookingSummary
          vehicle={vehicle}
          allVehicles={allVehicles}
          onChangeVehicle={handleChangeVehicle}
          locale={locale}
        />
      </div>
      <BookingForm vehicle={vehicle} locale={locale} />
    </div>
  );
}
