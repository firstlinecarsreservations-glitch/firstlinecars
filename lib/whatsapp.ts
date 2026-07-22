const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212700255515";

/**
 * Construit une URL wa.me avec un message pré-rempli et correctement
 * encodé, utilisée par tous les boutons WhatsApp du site.
 */
export function buildWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function buildVehicleWhatsAppMessage(
  brand: string,
  model: string,
  locale: "fr" | "en",
): string {
  if (locale === "en") {
    return `Hello FirstLineCars, I'm interested in the ${brand} ${model}. Is it available?`;
  }
  return `Bonjour FirstLineCars, je suis intéressé(e) par la ${brand} ${model}. Est-elle disponible ?`;
}
