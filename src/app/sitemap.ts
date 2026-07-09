import { MetadataRoute } from "next";

const BASE = "https://splinters.co.ke";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,             priority: 1.0,  freq: "weekly" as const },
    { url: `${BASE}/courts`, priority: 0.95, freq: "daily"  as const },
  ].map(({ url, priority, freq }) => ({
    url,
    lastModified: NOW,
    changeFrequency: freq,
    priority,
  }));

  return staticPages;
}
