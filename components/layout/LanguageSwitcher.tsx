"use client";

import { usePathname, useRouter } from "next/navigation";
import { replaceLocaleInPath } from "@/lib/i18n-routing";
import type { Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  light?: boolean;
}

export function LanguageSwitcher({
  currentLocale,
  light = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    if (locale === currentLocale) return;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    router.push(replaceLocaleInPath(pathname, locale));
    // Filet de sécurité : force le re-rendu des Server Components avec
    // les nouvelles données de langue si jamais la navigation seule ne
    // suffit pas à invalider le cache de route existant.
    router.refresh();
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-full p-1 text-xs font-semibold ${
        light ? "bg-white/15 backdrop-blur" : "bg-marine-50"
      }`}
    >
      {(["fr", "en"] as const).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={currentLocale === locale}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            currentLocale === locale
              ? light
                ? "text-marine-900 bg-white"
                : "bg-marine-700 text-white"
              : light
                ? "text-white/80 hover:text-white"
                : "text-marine-700 hover:bg-marine-100"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
