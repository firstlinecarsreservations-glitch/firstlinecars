import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";

/**
 * Ordre de priorité : préférence explicite de l'utilisateur (cookie posé
 * par le sélecteur de langue), puis la langue du navigateur, puis le
 * français.
 */
function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLocale = acceptLanguage.split(",")[0]?.trim().slice(0, 2);
  if (preferredLocale && isValidLocale(preferredLocale)) {
    return preferredLocale;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname}`;
  return NextResponse.redirect(url);
}

// Les routes techniques et les fichiers (tout chemin contenant un point)
// sont écartés ici plutôt que re-testés dans la fonction : le matcher est
// évalué avant le middleware, donc les re-vérifier était du code mort.
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
