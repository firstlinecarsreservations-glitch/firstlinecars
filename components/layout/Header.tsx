"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 72);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled;

  // « Réserver maintenant » ouvre une conversation WhatsApp plutôt que la
  // flotte : c'est le canal de contact direct de l'agence.
  const bookNowHref = buildWhatsAppLink(
    locale === "en"
      ? "Hello FirstLineCars, I'd like to book a car."
      : "Bonjour FirstLineCars, je souhaite réserver une voiture.",
  );

  const navItems = [
    { href: `/${locale}/vehicules`, label: dict.nav.vehicles },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
        transparent
          ? "bg-transparent"
          : "border-marine-100 border-b bg-white/95 backdrop-blur-md"
      }`}
    >
      {/* py-6/py-7 : le header respire davantage qu'avant (py-4), et le
         changement de hauteur au scroll (py-7 -> py-4) est ce qui donne
         l'impression de "resserrement" élégant plutôt qu'un simple
         changement de couleur brutal. */}
      <div
        className={`mx-auto flex max-w-360 items-center justify-between px-6 transition-[padding] duration-500 sm:px-10 ${
          transparent ? "py-7" : "py-4"
        }`}
      >
        <Link href={`/${locale}`} className="flex items-center">
          <Logo height={40} onDark={transparent} priority />
        </Link>

        <nav className="hidden items-center gap-11 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative py-1 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors ${
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-ink-soft hover:text-marine-900"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                  transparent ? "bg-white" : "bg-amber-500"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2.5 sm:flex">
            <LanguageSwitcher currentLocale={locale} light={transparent} />
            <CurrencySwitcher light={transparent} />
          </div>
          <Button
            href={bookNowHref}
            variant="primary"
            className="hidden sm:inline-flex"
          >
            {dict.nav.bookNow}
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className={`-mr-2 rounded-lg p-2 lg:hidden ${transparent ? "text-white" : "text-marine-900"}`}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-marine-100 border-t bg-white px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink-soft text-sm font-medium tracking-wide uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center gap-2.5">
            <LanguageSwitcher currentLocale={locale} />
            <CurrencySwitcher />
          </div>
          <Button href={bookNowHref} variant="primary" className="mt-6 w-full">
            {dict.nav.bookNow}
          </Button>
        </div>
      )}
    </header>
  );
}
