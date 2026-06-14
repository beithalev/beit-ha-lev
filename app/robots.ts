import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://beit-ha-lev-ten.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/shidduch/matches", "/torah/create"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
