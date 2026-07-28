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

/**
 * Dates et heures de location partagées entre le Hero, la page /vehicules et
 * la page /booking. Stockées en chaînes plutôt qu'en Date pour être liées
 * directement à des `<input type="date">` / `<input type="time">` sans
 * conversion à chaque frappe.
 */
export interface ReservationDates {
  /** `YYYY-MM-DD` */
  pickupDate: string;
  /** `HH:mm` */
  pickupTime: string;
  /** `YYYY-MM-DD` */
  returnDate: string;
  /** `HH:mm` */
  returnTime: string;
}
