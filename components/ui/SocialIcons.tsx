/**
 * Icônes sociales dessinées à la main : lucide-react a retiré ses icônes
 * de marques (Instagram, Twitter, Facebook...) des versions récentes pour
 * des raisons de droits d'usage — l'import `Instagram` depuis
 * "lucide-react" casse donc le build. Ce sont de simples pictogrammes
 * géométriques (carré arrondi + objectif + point), pas le logo Instagram
 * officiel, dans le même esprit que l'ancienne icône "feather-icons".
 */
interface IconProps {
  className?: string;
}

export function InstagramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2-2.68V9.4a5.8 5.8 0 1 0 5 5.75V8.9a7.6 7.6 0 0 0 4.5 1.47V7.3A4.7 4.7 0 0 1 16.5 2z" />
    </svg>
  );
}
