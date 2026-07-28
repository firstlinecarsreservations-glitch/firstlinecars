import { z } from "zod";
import vehiclesData from "@/data/vehicles.json";
import type { Vehicle } from "@/types/vehicle";

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
