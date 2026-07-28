interface VehicleGridSkeletonProps {
  /** Nombre de cartes fantômes à afficher (idéalement = nombre de résultats). */
  count: number;
}

/**
 * Grille de cartes « fantômes » affichée pendant la simulation de rechargement
 * de la liste. Elle reprend exactement la structure d'une VehicleCard (image,
 * titre, tuiles de specs, boutons) pour que la mise en page ne saute pas quand
 * les vrais résultats reviennent.
 */
export function VehicleGridSkeleton({ count }: VehicleGridSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="shadow-card flex h-full flex-col overflow-hidden rounded-2xl bg-white"
        >
          <div className="bg-marine-100/70 aspect-4/3 w-full" />
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="bg-marine-100/70 h-7 w-32 rounded-md" />
              <div className="bg-marine-100/70 h-7 w-20 rounded-md" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <div className="bg-marine-50 h-16 rounded-xl" />
              <div className="bg-marine-50 h-16 rounded-xl" />
              <div className="bg-marine-50 h-16 rounded-xl" />
            </div>
            <div className="mt-auto flex flex-col gap-2.5 pt-6">
              <div className="bg-marine-100/70 h-11 rounded-xl" />
              <div className="bg-marine-100/70 h-11 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
