export type Transmission = "manual" | "automatic";
export type FuelType = "diesel" | "essence" | "hybrid";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  category: string;
  pricePerDayMad: number;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  images: string[];
  features: string[];
  available: boolean;
}

export interface VehicleFilters {
  brand?: string;
  transmission?: Transmission;
  fuel?: FuelType;
}
