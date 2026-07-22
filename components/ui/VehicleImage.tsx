"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "lucide-react";

interface VehicleImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
}

/**
 * Wrapper autour de next/image avec repli visuel propre. Tant que les
 * vraies photos de la flotte ne sont pas déposées dans
 * /public/images/vehicles, cet écran gris cassé (voir capture) apparaît
 * pour CHAQUE véhicule — ce composant remplace ça par un fond de marque
 * + icône voiture, plutôt qu'une image manquante visible par le client.
 * Dès que de vraies photos sont ajoutées au même chemin, ce composant
 * les affiche normalement sans rien changer côté appelant.
 */
export function VehicleImage({
  src,
  alt,
  sizes,
  priority = false,
  imageClassName = "object-cover",
}: VehicleImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="from-marine-50 to-marine-100 absolute inset-0 flex items-center justify-center bg-linear-to-br">
        <Car
          className="text-marine-300 h-10 w-10"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClassName}
      onError={() => setErrored(true)}
    />
  );
}
