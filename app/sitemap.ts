import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://footballiq-analytics.github.io/football-iq";
  return [
    "",
    "/today",
    "/predictions",
    "/statistics",
    "/leagues/super-lig",
    "/leagues/champions-league",
    "/teams/fenerbahce",
  ].map((path) => ({ url: `${base}${path}` }));
}
