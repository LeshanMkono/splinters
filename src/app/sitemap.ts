import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://splinters.co.ke";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,             priority: 1.0,  freq: "weekly" as const },
    { url: `${BASE}/courts`, priority: 0.95, freq: "daily"  as const },
    { url: `${BASE}/blog`,   priority: 0.8,  freq: "daily"  as const },
  ].map(({ url, priority, freq }) => ({
    url,
    lastModified: NOW,
    changeFrequency: freq,
    priority,
  }));

  const blogPosts = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : NOW,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}
