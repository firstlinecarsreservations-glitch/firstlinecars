export type Currency = "MAD" | "EUR";

export const SUPPORTED_CURRENCIES = ["MAD", "EUR"] as const;
// Devise affichée au premier chargement, tant que le visiteur n'a pas
// choisi via le sélecteur (son choix est ensuite mémorisé en cookie). La
// clientèle est majoritairement européenne, d'où l'euro par défaut.
export const DEFAULT_CURRENCY: Currency = "EUR";

/**
 * La devise est stockée dans un cookie plutôt qu'en localStorage : c'est le
 * seul emplacement lisible à la fois par le serveur (rendu initial) et par
 * le client. Sans ça, le serveur rendait toujours en MAD puis le client
 * basculait en EUR après hydratation — d'où un flash de prix erroné à
 * chaque chargement de page. Même mécanisme que NEXT_LOCALE pour la langue.
 */
export const CURRENCY_COOKIE = "flc_currency";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Taux fixe, configurable via variable d'environnement. Suffisant pour un
// site vitrine sans moteur de change temps réel.
const EUR_MAD_RATE = Number(
  process.env.NEXT_PUBLIC_EUR_MAD_EXCHANGE_RATE ?? 10.9,
);

export function isCurrency(value: unknown): value is Currency {
  return value === "MAD" || value === "EUR";
}

/** Normalise une valeur inconnue (cookie, query…) en devise sûre. */
export function parseCurrency(value: unknown): Currency {
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}

export function currencyCookieAttributes(currency: Currency): string {
  return `${CURRENCY_COOKIE}=${currency}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Convertit un prix exprimé en MAD vers la devise demandée et le formate
 * pour l'affichage (ex: "300 MAD" ou "28 €").
 *
 * Les deux devises sont arrondies à l'unité : sur une location, un prix
 * "27,52 €" donne une fausse impression de précision alors que le taux
 * lui-même est approximatif.
 */
export function formatPrice(priceMad: number, currency: Currency): string {
  if (currency === "MAD") {
    return `${Math.round(priceMad)} MAD`;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceMad / EUR_MAD_RATE);
}
