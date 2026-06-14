import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://beit-ha-lev-ten.vercel.app";

  return [
    { url: `${base}/`,       changeFrequency: "weekly",  priority: 1   },
    { url: `${base}/torah`,  changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/shidduch`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/auth/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/auth/login`,    changeFrequency: "monthly", priority: 0.3 },
  ];
}
