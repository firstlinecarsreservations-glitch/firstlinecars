import Image from "next/image";

interface LogoProps {
  /** Hauteur de rendu en pixels. La largeur suit le ratio du fichier. */
  height?: number;
  /** Éclaircit le logo sur les fonds sombres (hero, footer). */
  onDark?: boolean;
  /** À activer uniquement pour le logo visible au chargement (header). */
  priority?: boolean;
  className?: string;
}

// Ratio réel du fichier source (4360 × 2293 px). Sert à réserver la bonne
// largeur avant chargement et à éviter tout décalage de mise en page.
const ASPECT_RATIO = 4360 / 2293;

/**
 * Logo de marque, en remplacement du texte "FirstLineCars" qui était
 * écrit en dur dans le header et dans le footer.
 *
 * Le <span> lisible par les lecteurs d'écran porte le nom : une image de
 * logo avec un alt suffirait, mais le garder en texte permet aussi aux
 * moteurs de recherche de lire le nom de l'agence dans la navigation.
 */
export function Logo({
  height = 40,
  onDark = false,
  priority = false,
  className = "",
}: LogoProps) {
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/flc_logo_nobg.png"
        alt=""
        width={width}
        height={height}
        priority={priority}
        sizes={`${width}px`}
        className={`object-contain transition-[filter] duration-500 ${
          onDark ? "brightness-0 invert" : ""
        }`}
        style={{ height, width: "auto" }}
      />
      <span className="sr-only">FirstLineCars</span>
    </span>
  );
}
