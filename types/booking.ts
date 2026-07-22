export type DeliveryLocation = "agency" | "airport" | "custom";
export type AirportCity = "agadir" | "marrakech";

export interface BookingRequest {
  vehicleId: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  email?: string;
  deliveryLocation: DeliveryLocation;
  /** Requis uniquement si deliveryLocation === "airport". */
  airportCity?: AirportCity;
  deliveryAddress?: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface BookingEstimate {
  days: number;
  totalPriceMad: number;
}
