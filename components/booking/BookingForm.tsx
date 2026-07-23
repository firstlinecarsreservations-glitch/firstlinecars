"use client";

import { useId } from "react";
import { useBookingForm } from "@/hooks/useBookingForm";
import { LocationSelector } from "./LocationSelector";
import { DateRangePicker } from "./DateRangePicker";
import { useCurrency } from "@/hooks/useCurrency";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/lib/i18n";

interface BookingFormProps {
  vehicle: Vehicle;
  locale: Locale;
}

interface FormSectionProps {
  step: string;
  title: string;
  children: React.ReactNode;
}

function FormSection({ step, title, children }: FormSectionProps) {
  return (
    <div className="border-marine-100 border-b py-9 first:pt-0 last:border-0 last:pb-0">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-display text-sm font-semibold text-amber-500">
          {step}
        </span>
        <h3 className="font-display text-marine-900 text-base font-semibold">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-clay-500 mt-1.5 text-xs">
      {message}
    </p>
  );
}

export function BookingForm({ vehicle, locale }: BookingFormProps) {
  const {
    form,
    onSubmit,
    deliveryLocation,
    dateRange,
    estimate,
    status,
    startNewBooking,
  } = useBookingForm(vehicle, locale);

  const { format } = useCurrency();
  const fieldId = useId();

  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  if (status === "success") {
    return (
      <div className="bg-marine-50 rounded-3xl p-10 text-center">
        <p className="font-display text-marine-900 text-xl font-semibold">
          {locale === "en" ? "Request received" : "Demande reçue"}
        </p>
        <p className="text-ink-soft mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          {locale === "en"
            ? "We'll confirm your booking shortly. Feel free to reach us on WhatsApp in the meantime."
            : "Nous confirmons votre réservation très prochainement. N'hésitez pas à nous contacter sur WhatsApp entre-temps."}
        </p>
        <button
          type="button"
          onClick={startNewBooking}
          className="text-marine-700 hover:text-marine-900 mt-6 text-sm font-semibold underline underline-offset-4"
        >
          {locale === "en" ? "Book another car" : "Réserver une autre voiture"}
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-marine-100 bg-white px-4 py-3 text-sm text-marine-900 transition-colors placeholder:text-ink-soft/50 focus:border-marine-500";
  const labelClasses =
    "mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft";

  const textFields = [
    {
      name: "fullName" as const,
      label: locale === "en" ? "Full name" : "Nom complet",
      type: "text",
      autoComplete: "name",
    },
    {
      name: "phone" as const,
      label: locale === "en" ? "Phone" : "Téléphone",
      type: "tel",
      autoComplete: "tel",
    },
    {
      name: "driverAge" as const,
      label: locale === "en" ? "Driver age" : "Âge du conducteur",
      type: "number",
      autoComplete: "off",
      placeholder: locale === "en" ? "e.g. 30" : "ex. 30",
      // Le clavier numérique s'ouvre directement sur mobile, et les
      // bornes correspondent à celles du schéma de validation.
      inputMode: "numeric" as const,
      min: 21,
      max: 99,
    },
  ];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="shadow-card rounded-3xl bg-white p-6 sm:p-9"
    >
      <FormSection
        step="01"
        title={locale === "en" ? "Your details" : "Vos informations"}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`${fieldId}-${field.name}`} className={labelClasses}>
                {field.label}
              </label>
              <input
                {...register(
                  field.name,
                  field.type === "number" ? { valueAsNumber: true } : undefined,
                )}
                id={`${fieldId}-${field.name}`}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                inputMode={field.inputMode}
                min={field.min}
                max={field.max}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={
                  errors[field.name] ? `${fieldId}-${field.name}-error` : undefined
                }
                className={inputClasses}
              />
              <FieldError
                id={`${fieldId}-${field.name}-error`}
                message={errors[field.name]?.message}
              />
            </div>
          ))}

          <div>
            <label htmlFor={`${fieldId}-email`} className={labelClasses}>
              Email{" "}
              <span className="text-ink-soft/60 normal-case">
                ({locale === "en" ? "optional" : "facultatif"})
              </span>
            </label>
            <input
              {...register("email")}
              id={`${fieldId}-email`}
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? `${fieldId}-email-error` : undefined
              }
              className={inputClasses}
            />
            <FieldError
              id={`${fieldId}-email-error`}
              message={errors.email?.message}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        step="02"
        title={locale === "en" ? "Pickup location" : "Lieu de récupération"}
      >
        <LocationSelector
          value={deliveryLocation}
          onChange={(value) =>
            setValue("deliveryLocation", value, { shouldValidate: true })
          }
          address={form.watch("deliveryAddress") ?? ""}
          onAddressChange={(value) =>
            setValue("deliveryAddress", value, { shouldValidate: true })
          }
          airportCity={form.watch("airportCity")}
          onAirportCityChange={(value) =>
            setValue("airportCity", value, { shouldValidate: true })
          }
          addressError={errors.deliveryAddress?.message}
          airportError={errors.airportCity?.message}
          locale={locale}
        />
      </FormSection>

      <FormSection
        step="03"
        title={locale === "en" ? "Rental dates" : "Dates de location"}
      >
        <DateRangePicker
          range={dateRange}
          onChange={(range) =>
            setValue("dateRange", range, { shouldValidate: true })
          }
          locale={locale}
        />
        <FieldError
          id={`${fieldId}-dates-error`}
          message={errors.dateRange?.message}
        />

        {estimate && (
          <div className="text-marine-900 mt-5 flex items-center justify-between rounded-xl bg-amber-50 px-5 py-4 text-sm">
            <span>
              {estimate.days}{" "}
              {locale === "en"
                ? estimate.days > 1
                  ? "days"
                  : "day"
                : estimate.days > 1
                  ? "jours"
                  : "jour"}
            </span>
            <span className="font-display text-base font-bold">
              {format(estimate.totalPriceMad)}
            </span>
          </div>
        )}
      </FormSection>

      <div className="pt-9">
        <button
          type="submit"
          disabled={status === "loading"}
          className="font-display text-ink w-full rounded-xl bg-amber-500 px-6 py-4 text-sm font-semibold transition-colors hover:bg-amber-600 disabled:opacity-60"
        >
          {status === "loading"
            ? locale === "en"
              ? "Sending..."
              : "Envoi en cours..."
            : locale === "en"
              ? "Confirm booking"
              : "Confirmer la réservation"}
        </button>

        {status === "error" && (
          <p role="alert" className="text-clay-500 mt-4 text-center text-sm">
            {locale === "en"
              ? "Something went wrong. Please try again or contact us on WhatsApp."
              : "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp."}
          </p>
        )}
      </div>
    </form>
  );
}
