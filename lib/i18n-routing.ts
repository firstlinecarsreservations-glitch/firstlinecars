/**
 * Remplace le segment de langue dans un chemin ("/fr/vehicules" -> "/en/vehicules").
 * Gère aussi le cas racine ("/fr" -> "/en").
 */
export function replaceLocaleInPath(
  pathname: string,
  targetLocale: string,
): string {
  const segments = pathname.split("/");
  if (segments.length < 2 || !segments[1]) {
    return `/${targetLocale}`;
  }
  segments[1] = targetLocale;
  return segments.join("/") || `/${targetLocale}`;
}
