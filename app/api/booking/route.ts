import { NextResponse } from "next/server";
import { bookingRequestSchema, calculateEstimate } from "@/lib/booking";
import { getVehicleById } from "@/lib/vehicles";

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

  // TODO production : envoyer un email (ex. Resend) à
  // process.env.BOOKING_NOTIFICATION_EMAIL et/ou relayer vers une API
  // WhatsApp Business, avec parsed.data + estimate.

  return NextResponse.json({ success: true, estimate }, { status: 200 });
}
