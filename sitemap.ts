import type { MetadataRoute } from "next"
import { animeAPI } from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://animeverse.vercel.app" // Replace with your actual domain

  // Get trending anime for sitemap
  const trendingAnime = await animeAPI.getTrendingAnime(1, 100)

  const animeUrls = trendingAnime.map((anime) => ({
    url: `${baseUrl}/anime/${anime.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const watchUrls = trendingAnime.map((anime) => ({
    url: `${baseUrl}/watch/${anime.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...animeUrls,
    ...watchUrls,
  ]
}
