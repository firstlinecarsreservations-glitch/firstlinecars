import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Server Component : simple lien <a>, aucune interactivité React requise.
 */
export function WhatsAppButton({
  message,
  label,
  variant = "secondary",
  className = "",
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message);

  const variantClasses =
    variant === "primary"
      ? "bg-[#25D366] text-white hover:bg-[#1ebe5a]"
      : "border border-marine-300 text-marine-700 hover:bg-marine-50";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-display inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200 ${variantClasses} ${className}`}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
