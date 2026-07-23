import { z } from "zod";
import vehiclesData from "@/data/vehicles.json";
import type { Vehicle, VehicleFilters } from "@/types/vehicle";

const vehicleSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  category: z.string(),
  pricePerDayMad: z.number().positive(),
  transmission: z.enum(["manual", "automatic"]),
  fuel: z.enum(["diesel", "essence", "hybrid"]),
  seats: z.number().int().positive(),
  images: z.array(z.string()).min(1),
  available: z.boolean(),
});

/**
 * Le JSON est validé une seule fois au chargement du module, pas à chaque
 * appel : les données sont statiques, et getAllVehicles() était appelé
 * plusieurs fois par requête (dont une fois par getVehicleById), ce qui
 * re-parsait tout le catalogue à travers zod à chaque fois. Un JSON
 * invalide fait maintenant échouer le build plutôt que la requête.
 */
const VEHICLES: readonly Vehicle[] = z
  .array(vehicleSchema)
  .parse(vehiclesData);

const VEHICLES_BY_ID = new Map(VEHICLES.map((vehicle) => [vehicle.id, vehicle]));

export function getAllVehicles(): Vehicle[] {
  return [...VEHICLES];
}

/**
 * Remplace getVehicleBySlug : il n'y a plus de page détail, mais l'id
 * reste nécessaire pour résoudre le véhicule sélectionné sur /booking
 * (query param carId) et pour le message WhatsApp pré-rempli.
 */
export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLES_BY_ID.get(id);
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters,
): Vehicle[] {
  // Normalisé une seule fois hors de la boucle plutôt qu'à chaque
  // véhicule. Les accents sont retirés pour que "Peugeot" réponde à
  // "peugeot" comme à "peugéot".
  const query = filters.search?.trim() ? normalise(filters.search) : null;

  return vehicles.filter((vehicle) => {
    if (filters.brand && vehicle.brand !== filters.brand) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission)
      return false;
    if (filters.fuel && vehicle.fuel !== filters.fuel) return false;
    if (query && !normalise(`${vehicle.brand} ${vehicle.model}`).includes(query))
      return false;
    return true;
  });
}

/**
 * Minuscules sans accents, pour que "Peugeot" réponde aussi bien à
 * "peugeot" qu'à "peugéot". \p{Diacritic} évite d'écrire une plage de
 * caractères combinants en clair dans le fichier.
 */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getAvailableBrands(vehicles: Vehicle[]): string[] {
  return Array.from(new Set(vehicles.map((vehicle) => vehicle.brand))).sort();
}
