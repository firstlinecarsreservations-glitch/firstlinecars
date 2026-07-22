/**
 * data/vehicles.json stocke des CLÉS d'équipement ("ac", "bluetooth"...)
 * et non du texte affichable. C'est ce qui manquait : auparavant le JSON
 * contenait directement le libellé français ("Climatisation"), affiché
 * tel quel même sur la version anglaise du site — d'où l'impression que
 * "la langue ne change pas dans la page" (le header traduit, mais ce
 * texte venant des données restait figé en français).
 */
export const FEATURE_LABELS: Record<string, { fr: string; en: string }> = {
  ac: { fr: "Climatisation", en: "Air conditioning" },
  autoClimate: {
    fr: "Climatisation automatique",
    en: "Automatic climate control",
  },
  bluetooth: { fr: "Bluetooth", en: "Bluetooth" },
  cruiseControl: { fr: "Régulateur de vitesse", en: "Cruise control" },
  sevenSeats: { fr: "7 places", en: "7 seats" },
  bigTrunk: { fr: "Grand coffre", en: "Large boot" },
  fourByTwo: { fr: "4x2", en: "4x2" },
  rearCamera: { fr: "Caméra de recul", en: "Rear camera" },
  lowConsumption: { fr: "Faible consommation", en: "Low fuel consumption" },
  automatic: { fr: "Automatique", en: "Automatic" },
  panoramicRoof: { fr: "Toit panoramique", en: "Panoramic roof" },
  parkAssist: { fr: "Aide au stationnement", en: "Parking assist" },
  touchscreen: { fr: "Écran tactile", en: "Touchscreen" },
};

export function translateFeature(key: string, locale: "fr" | "en"): string {
  return FEATURE_LABELS[key]?.[locale] ?? key;
}
