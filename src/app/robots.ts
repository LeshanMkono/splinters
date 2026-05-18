import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/login",
          "/register",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/login", "/register", "/api/"],
        crawlDelay: 0,
      },
    ],
    sitemap: "https://splinters.co.ke/sitemap.xml",
    host: "https://splinters.co.ke",
  };
}
