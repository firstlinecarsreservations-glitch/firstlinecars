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

export function FacebookIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.28 3.5c-2.4 0-4.03 1.46-4.03 4.15V9.9H7.5V13h2.75v8z" />
    </svg>
  );
}

export function SnapchatIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.4c2.6 0 4.3 1.9 4.3 4.5 0 .7-.05 1.4-.1 2 .3.15.65.2 1 .1.5-.15.95.15 1.05.55.1.4-.15.8-.6 1-.35.15-1.1.4-1.35.65-.2.2-.15.5.15 1.05.55 1 1.6 2.05 2.9 2.45.35.1.55.45.45.8-.15.55-1.1.9-2.25 1.1-.15.25-.2.6-.3.95-.05.3-.3.5-.65.45-.5-.05-1.15-.2-1.95-.05-.75.15-1.5.95-2.65.95s-1.9-.8-2.65-.95c-.8-.15-1.45 0-1.95.05-.35.05-.6-.15-.65-.45-.1-.35-.15-.7-.3-.95-1.15-.2-2.1-.55-2.25-1.1-.1-.35.1-.7.45-.8 1.3-.4 2.35-1.45 2.9-2.45.3-.55.35-.85.15-1.05-.25-.25-1-.5-1.35-.65-.45-.2-.7-.6-.6-1 .1-.4.55-.7 1.05-.55.35.1.7.05 1-.1-.05-.6-.1-1.3-.1-2C7.7 4.3 9.4 2.4 12 2.4z" />
    </svg>
  );
}
