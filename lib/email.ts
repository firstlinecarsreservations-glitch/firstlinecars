import { Resend } from "resend";
import { formatPrice } from "@/lib/currency";
import { BUSINESS } from "@/lib/business";
import type { Vehicle } from "@/types/vehicle";
import type { BookingEstimate } from "@/types/booking";
import type { BookingRequestInput } from "@/lib/booking";

/**
 * Envoi de la demande de réservation par email.
 *
 * Le transport est isolé dans ce fichier : la route API ne connaît que
 * `sendBookingRequestEmail`. Passer de Resend à du SMTP (Nodemailer) ne
 * toucherait que ce module.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * Adresse d'expédition. `onboarding@resend.dev` fonctionne sans vérifier
 * de domaine, mais uniquement vers l'adresse du compte Resend. Une fois
 * firstlinecars.ma vérifié chez Resend, passer à
 * "Réservations <reservations@firstlinecars.ma>" améliore la délivrabilité
 * et évite que le message parte en spam.
 */
const FROM_ADDRESS =
  process.env.BOOKING_EMAIL_FROM ?? "FirstLineCars <onboarding@resend.dev>";

const TO_ADDRESS =
  process.env.BOOKING_EMAIL_TO ?? "firstlinecars.reservations@gmail.com";

// Typés sur les unions réelles plutôt que Record<string, string> : le
// compilateur garantit qu'aucun cas n'est oublié si un lieu de livraison
// ou un aéroport est ajouté plus tard.
const DELIVERY_LABELS: Record<BookingRequestInput["deliveryLocation"], string> =
  {
    agency: "À l'agence (Talborjt, Agadir)",
    airport: "Aéroport",
    custom: "Hôtel / adresse privée",
  };

const AIRPORT_LABELS: Record<
  NonNullable<BookingRequestInput["airportCity"]>,
  string
> = {
  agadir: "Agadir – Al Massira (AGA)",
  marrakech: "Marrakech – Menara (RAK)",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Prix affichés dans les deux devises : l'agence facture en dirhams,
 *  la plupart des clients raisonnent en euros. */
function formatBoth(priceMad: number): string {
  return `${formatPrice(priceMad, "MAD")} (${formatPrice(priceMad, "EUR")})`;
}

function buildPickupLine(data: BookingRequestInput): string {
  if (data.deliveryLocation === "airport") {
    const airport = data.airportCity
      ? AIRPORT_LABELS[data.airportCity]
      : "non précisé";
    return `${DELIVERY_LABELS.airport} — ${airport}`;
  }
  if (data.deliveryLocation === "custom") {
    return `${DELIVERY_LABELS.custom} — ${data.deliveryAddress}`;
  }
  return DELIVERY_LABELS.agency;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BookingEmailInput {
  data: BookingRequestInput;
  vehicle: Vehicle;
  estimate: BookingEstimate;
}

function buildRows({ data, vehicle, estimate }: BookingEmailInput) {
  return [
    ["Véhicule", `${vehicle.brand} ${vehicle.model}`],
    ["Prix / jour", formatBoth(vehicle.pricePerDayMad)],
    ["Départ", formatDate(data.startDate)],
    ["Retour", formatDate(data.endDate)],
    ["Durée", `${estimate.days} jour(s)`],
    ["Total estimé", formatBoth(estimate.totalPriceMad)],
    ["Récupération", buildPickupLine(data)],
    ["Client", data.fullName],
    ["Nationalité", data.nationality],
    ["Téléphone", data.phone],
    ["Email", data.email || "—"],
    ["Âge du conducteur", `${data.driverAge} ans`],
  ] as const;
}

function buildHtml(input: BookingEmailInput): string {
  const rows = buildRows(input)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e8eeed;color:#3a4f52;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #e8eeed;color:#0a2f2e;font-size:14px;font-weight:600;">${escapeHtml(String(value))}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#fbf9f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8eeed;border-radius:16px;overflow:hidden;border-collapse:collapse;width:100%;">
      <tr>
        <td style="background:#0a2f2e;padding:24px;">
          <p style="margin:0;color:#e2a63b;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Nouvelle demande</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:600;">Réservation ${escapeHtml(input.vehicle.brand)} ${escapeHtml(input.vehicle.model)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">${rows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#f4efe6;">
          <a href="https://wa.me/${BUSINESS.phone.replace(/\D/g, "")}" style="color:#0f4c4a;font-size:13px;font-weight:600;">Répondre au client sur WhatsApp</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Version texte : certains clients mail bloquent le HTML par défaut. */
function buildText(input: BookingEmailInput): string {
  return buildRows(input)
    .map(([label, value]) => `${label} : ${value}`)
    .join("\n");
}

export async function sendBookingRequestEmail(
  input: BookingEmailInput,
): Promise<void> {
  if (!RESEND_API_KEY) {
    // Sans clé, on échoue explicitement plutôt que de laisser croire à
    // l'agence que la demande est partie : une réservation perdue en
    // silence coûte un client.
    throw new Error(
      "RESEND_API_KEY manquante : impossible d'envoyer la demande de réservation.",
    );
  }

  const resend = new Resend(RESEND_API_KEY);
  const { vehicle, data } = input;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    subject: `Réservation ${vehicle.brand} ${vehicle.model} — ${data.fullName}`,
    html: buildHtml(input),
    text: buildText(input),
    // Répondre à l'email va directement au client quand il en a laissé un.
    ...(data.email ? { replyTo: data.email } : {}),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}
