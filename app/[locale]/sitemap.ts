import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://firstlinecars.ma";

export default function sitemap(): MetadataRoute.Sitemap {
  // /booking est volontairement absent : la page est en noindex.
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/vehicules", priority: 0.9 },
    { path: "/a-propos", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
  ];

  const lastModified = new Date();

  return SUPPORTED_LOCALES.flatMap((locale) =>
    staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      priority,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((alt) => [alt, `${SITE_URL}/${alt}${path}`]),
        ),
      },
    })),
  );
}
