import { NextResponse } from "next/server";
import { bookingRequestSchema, calculateEstimate } from "@/lib/booking";
import { getVehicleById } from "@/lib/vehicles";
import { sendBookingRequestEmail } from "@/lib/email";

export async function POST(request: Request) {
  // Un corps non-JSON fait lever request.json() : sans ce garde, une
  // requête malformée remontait en 500 non gérée au lieu d'un 400 clair.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const vehicle = getVehicleById(parsed.data.vehicleId);
  if (!vehicle) {
    return NextResponse.json({ error: "vehicle_not_found" }, { status: 404 });
  }

  const estimate = calculateEstimate(
    new Date(parsed.data.startDate),
    new Date(parsed.data.endDate),
    vehicle.pricePerDayMad,
  );

  // L'email EST la réservation : il n'y a pas de base de données derrière.
  // Un échec d'envoi doit donc remonter au client — répondre "success"
  // alors que personne n'a reçu la demande ferait disparaître le dossier
  // sans que ni le client ni l'agence ne le sachent.
  try {
    await sendBookingRequestEmail({ data: parsed.data, vehicle, estimate });
  } catch (error) {
    console.error("[booking] échec de l'envoi de l'email", error);
    return NextResponse.json({ error: "email_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true, estimate }, { status: 200 });
}
