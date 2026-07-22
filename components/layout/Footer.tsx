import Link from "next/link";
import { MapPin } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { BUSINESS, SOCIAL } from "@/lib/business";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  // /avis et /faq ne sont pas des pages du site : le contenu vit dans les
  // sections correspondantes de la page d'accueil.
  const quickLinks = [
    { href: `/${locale}`, label: dict.footer.home },
    { href: `/${locale}/vehicules`, label: dict.nav.vehicles },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-marine-100 bg-marine-900 text-marine-100 border-t">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-14 sm:px-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-white">
            First<span className="text-amber-400">Line</span>Cars
          </p>
          <p className="text-marine-300 mt-3 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {BUSINESS.address}
          </p>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-marine-300 mt-2 inline-block text-sm hover:text-white"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </div>

        <div>
          <p className="font-display text-sm font-semibold tracking-wide text-amber-400 uppercase">
            {dict.footer.quickLinks}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-marine-300 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold tracking-wide text-amber-400 uppercase">
            Instagram / TikTok
          </p>
          <div className="mt-3 flex gap-3">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram FirstLineCars"
              className="bg-marine-700 hover:bg-marine-600 rounded-full p-2.5 transition-colors"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok FirstLineCars"
              className="bg-marine-700 hover:bg-marine-600 rounded-full p-2.5 transition-colors"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-marine-700 text-marine-400 border-t py-4 text-center text-xs">
        © 2026 FirstLineCars. {dict.footer.rightsReserved}
      </div>
    </footer>
  );
}
