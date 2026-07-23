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
  url: "https://www.google.com/search?sca_esv=80e3327b61e6e700&sxsrf=APpeQnsPHP6J5umpNBCySqxzDliWwlVK-Q:1784733872139&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-__FZt0SPYSSAX-u68ldlRCZl2x0WsUrpMjqaDDhtb_BhfRN0Nwvyu9dG5CP7JDuH-gtaLdn9K0L11ySjdUsa3brwjkzqlq3S5vnUZ_9f6GrjsKtaAJFzngj-W3kuyAac9T9u2rVnZUgBDGZPCtG0UGqLqKGreTbYweaHRCCUzqPapcXgTtApZjNVr72P36w_kEDxtcTQ7Rbmt-vottRCqQ2csrT1gZ8MNvJ13HIk9YJ-l3LDsA%3D%3D&q=Location+voiture+agadir+a%C3%A9roport+/+Rental+car+agadir+airport+/+Firstlinecars+agence+de+location+voiture+agadir+a%C3%A9roport+Reviews&sa=X&ved=2ahUKEwjb793jy-aVAxXwg_0HHQbtGFAQ0bkNegQIPRAH&biw=1707&bih=793&dpr=1.13",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/firstlinecars_rental_car/",
  // Les paramètres ?_r et ?_t du lien de partage TikTok sont des jetons de
  // session qui expirent : seule l'URL de profil est stable dans le temps.
  tiktok: "https://www.tiktok.com/@firstlinecars_officiel",
  facebook: "https://www.facebook.com/p/Firstlinecars-61557114835627/",
  snapchat: "https://snapchat.com/t/5xgcH8YH",
} as const;
