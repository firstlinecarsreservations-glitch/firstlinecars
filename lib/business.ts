/**
 * Source unique des informations réelles de l'agence.
 *
 * Ces valeurs étaient auparavant dispersées et parfois inventées : un
 * numéro de téléphone fictif ("+212 6 00 00 00 00") sur la page contact
 * alors que le vrai numéro vivait dans lib/whatsapp.ts, une note de
 * "5.0/5 sur 65+ avis" affichée sur la page À propos, un "+65 avis 5
 * étoiles" dans le hero, et une moyenne recalculée à partir des avis de
 * démonstration. Tout ce qui est affiché comme un fait doit venir d'ici.
 */

export const BUSINESS = {
  name: "FirstLineCars",
  address: "Talborjt, N°13 Rue Ifni, Agadir 80000, Maroc",
  city: "Agadir",
  region: "Souss-Massa",
  country: "MA",
  postalCode: "80000",
  /** Format international, sans espaces — utilisable en href tel:. */
  phone: "+212700255515",
  phoneDisplay: "+212 700 255 515",
  email: "firstlinecars2024@gmail.com",
  openingHours: { opens: "08:00", closes: "22:00" },
} as const;

/**
 * Chiffres réels de la fiche Google Business, communiqués par le client.
 * À ne PAS recalculer depuis data/reviews.json : ce fichier ne contient
 * pour l'instant que des avis de démonstration, et en dériver la moyenne
 * affichait une note fabriquée.
 */
export const GOOGLE_REVIEWS = {
  rating: 4.7,
  count: 50,
  /**
   * TODO : remplacer par l'URL canonique de la fiche (Google Maps >
   * Partager > Copier le lien). Ce lien de recherche atterrit sur la
   * bonne fiche mais n'est pas permanent.
   */
  url: "https://www.google.com/maps/search/?api=1&query=FirstLineCars+Agadir",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/firstlinecars",
  tiktok: "https://www.tiktok.com/@firstlinecars",
  facebook: "https://www.facebook.com/people/Firstlinecars/61557114835627/",
} as const;
