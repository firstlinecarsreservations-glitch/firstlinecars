import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

const dictionaries = { fr, en } satisfies Record<Locale, typeof fr>;

export type Dictionary = typeof fr;

/**
 * Retourne le dictionnaire de traduction complet pour une langue donnée.
 * Utilisé côté serveur (Server Components) et injecté dans le
 * TranslationProvider pour les Client Components qui en ont besoin.
 */
export function getDictionary(locale: string): Dictionary {
  if (locale === "en") return dictionaries.en;
  return dictionaries.fr;
}

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}
