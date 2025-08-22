import type { Metadata } from "next"
import type { AnimeInfo } from "./api"

export function generateSEOMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
}): Metadata {
  const fullTitle = `${title} - AnimeVerse`
  const url = `https://animeverse.app${path}`

  const defaultKeywords = ["anime", "watch online", "free anime", "streaming", "AnimeVerse"]

  const allKeywords = keywords ? [...keywords, ...defaultKeywords] : defaultKeywords

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(", "),
    authors: [{ name: "AnimeVerse" }],
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url,
      siteName: "AnimeVerse",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateAnimeMetadata(anime: AnimeInfo): Metadata {
  const title = anime.title.english || anime.title.romaji
  const description = anime.description
    ? anime.description.replace(/<[^>]*>/g, "").slice(0, 160) + "..."
    : `Watch ${title} online for free. ${anime.genres.join(", ")} anime from ${anime.seasonYear || "N/A"}.`

  const keywords = [
    title,
    anime.title.romaji,
    anime.title.english,
    ...anime.genres,
    "anime",
    "watch online",
    "free anime",
    "streaming",
    anime.seasonYear?.toString(),
    anime.studios.nodes[0]?.name,
  ].filter(Boolean)

  return {
    title: `Watch ${title} Online Free - AnimeVerse`,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "AnimeVerse" }],
    openGraph: {
      title: `${title} - Watch Online Free`,
      description,
      type: "video.tv_show",
      images: [
        {
          url: anime.coverImage.large,
          width: 460,
          height: 644,
          alt: title,
        },
        ...(anime.bannerImage
          ? [
              {
                url: anime.bannerImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : []),
      ],
      siteName: "AnimeVerse",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Watch Online Free`,
      description,
      images: [anime.coverImage.large],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function generateWatchMetadata(anime: AnimeInfo, episodeNumber?: number): Metadata {
  const title = anime.title.english || anime.title.romaji
  const episodeTitle = episodeNumber ? ` Episode ${episodeNumber}` : ""
  const description = episodeNumber
    ? `Watch ${title} Episode ${episodeNumber} online for free in HD quality. Stream the latest episodes of ${title} with English subtitles.`
    : `Watch ${title} online for free. All episodes available in HD quality with English subtitles.`

  const keywords = [
    title,
    anime.title.romaji,
    anime.title.english,
    ...anime.genres,
    "anime",
    "watch online",
    "free anime",
    "streaming",
    "episode",
    episodeNumber?.toString(),
    "HD",
    "subtitles",
  ].filter(Boolean)

  return {
    title: `Watch ${title}${episodeTitle} Online Free - AnimeVerse`,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "AnimeVerse" }],
    openGraph: {
      title: `${title}${episodeTitle} - Watch Online Free`,
      description,
      type: "video.episode",
      images: [
        {
          url: anime.coverImage.large,
          width: 460,
          height: 644,
          alt: `${title}${episodeTitle}`,
        },
        ...(anime.bannerImage
          ? [
              {
                url: anime.bannerImage,
                width: 1200,
                height: 630,
                alt: `${title}${episodeTitle}`,
              },
            ]
          : []),
      ],
      siteName: "AnimeVerse",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${episodeTitle} - Watch Online Free`,
      description,
      images: [anime.coverImage.large],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function generateSearchMetadata(query: string, resultCount: number): Metadata {
  const title = `Search Results for "${query}" - AnimeVerse`
  const description = `Found ${resultCount} anime results for "${query}". Watch your favorite anime online for free in HD quality.`

  return {
    title,
    description,
    robots: {
      index: resultCount > 0,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "AnimeVerse",
    },
  }
}

export function generateAnimeStructuredData(anime: AnimeInfo) {
  const title = anime.title.english || anime.title.romaji

  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: title,
    alternateName: [anime.title.romaji, anime.title.english, anime.title.native].filter(Boolean),
    description: anime.description?.replace(/<[^>]*>/g, ""),
    image: anime.coverImage.large,
    genre: anime.genres,
    datePublished: anime.seasonYear?.toString(),
    numberOfEpisodes: anime.episodes,
    aggregateRating: anime.averageScore
      ? {
          "@type": "AggregateRating",
          ratingValue: anime.averageScore / 10,
          ratingCount: 1000, // Placeholder
          bestRating: 10,
          worstRating: 1,
        }
      : undefined,
    productionCompany: anime.studios.nodes.map((studio) => ({
      "@type": "Organization",
      name: studio.name,
    })),
    inLanguage: "ja",
    subtitleLanguage: ["en", "ja"],
  }
}

export function generateEpisodeStructuredData(anime: AnimeInfo, episodeNumber: number) {
  const title = anime.title.english || anime.title.romaji

  return {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: `${title} Episode ${episodeNumber}`,
    episodeNumber,
    partOfSeries: {
      "@type": "TVSeries",
      name: title,
    },
    description: `Watch ${title} Episode ${episodeNumber} online for free in HD quality.`,
    image: anime.coverImage.large,
    inLanguage: "ja",
    subtitleLanguage: ["en", "ja"],
  }
}
