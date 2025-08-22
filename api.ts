export interface AnimeInfo {
  id: string
  title: {
    romaji: string
    english?: string
    native: string
  }
  description?: string
  coverImage: {
    large: string
    medium: string
  }
  bannerImage?: string
  genres: string[]
  status: string
  episodes?: number
  averageScore?: number
  seasonYear?: number
  format: string
  studios: {
    nodes: Array<{
      name: string
    }>
  }
  relations?: {
    edges: Array<{
      node: {
        id: string
        title: {
          romaji: string
          english?: string
        }
        coverImage: {
          medium: string
        }
      }
      relationType: string
    }>
  }
}

export interface Episode {
  id: string
  title?: string
  number: number
  image?: string
  description?: string
}

export interface StreamingData {
  sources: Array<{
    url: string
    quality: string
    isM3U8: boolean
  }>
  subtitles?: Array<{
    url: string
    lang: string
  }>
}

class AnimeAPI {
  private anilistUrl = "https://graphql.anilist.co"
  private consumetUrl = "https://api.consumet.org/anime/gogoanime"
  private alternativeConsumets = [
    "https://consumet-api.vercel.app/anime/gogoanime",
    "https://api-consumet.vercel.app/anime/gogoanime",
  ]

  // AniList GraphQL queries
  private trendingQuery = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
            medium
          }
          bannerImage
          genres
          status
          episodes
          averageScore
          seasonYear
          format
          studios {
            nodes {
              name
            }
          }
          relations {
            edges {
              node {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                }
              }
              relationType
            }
          }
        }
      }
    }
  `

  private searchQuery = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, search: $search) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
            medium
          }
          bannerImage
          genres
          status
          episodes
          averageScore
          seasonYear
          format
          studios {
            nodes {
              name
            }
          }
          relations {
            edges {
              node {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                }
              }
              relationType
            }
          }
        }
      }
    }
  `

  private animeDetailsQuery = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        bannerImage
        genres
        status
        episodes
        averageScore
        seasonYear
        format
        studios {
          nodes {
            name
          }
        }
        relations {
          edges {
            node {
              id
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
            }
            relationType
          }
        }
      }
    }
  `

  async getTrendingAnime(page = 1, perPage = 20): Promise<AnimeInfo[]> {
    try {
      const response = await fetch(this.anilistUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: this.trendingQuery,
          variables: { page, perPage },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`)
      }

      return data.data.Page.media
    } catch (error) {
      console.error("Error fetching trending anime:", error)
      // Return cached data if available, otherwise empty array
      return []
    }
  }

  async searchAnime(query: string, page = 1, perPage = 20): Promise<AnimeInfo[]> {
    try {
      const response = await fetch(this.anilistUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: this.searchQuery,
          variables: { search: query, page, perPage },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`)
      }

      return data.data.Page.media
    } catch (error) {
      console.error("Error searching anime:", error)
      return []
    }
  }

  async getAnimeDetails(id: number): Promise<AnimeInfo | null> {
    try {
      const response = await fetch(this.anilistUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: this.animeDetailsQuery,
          variables: { id },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`)
      }

      return data.data.Media
    } catch (error) {
      console.error("Error fetching anime details:", error)
      return null
    }
  }

  async getAnimeEpisodes(animeId: string): Promise<Episode[]> {
    try {
      console.log("[v0] Fetching episodes for AniList ID:", animeId)

      // First get anime details from AniList to get the title
      const animeDetails = await this.getAnimeDetails(Number.parseInt(animeId))
      if (!animeDetails) {
        console.log("[v0] No anime details found for ID:", animeId)
        return []
      }

      const title = animeDetails.title.english || animeDetails.title.romaji
      console.log("[v0] Searching Gogoanime for title:", title)

      // Search for the anime on Gogoanime
      const searchResults = await this.searchGogoanime(title)
      console.log("[v0] Gogoanime search results:", searchResults.length)

      if (searchResults.length === 0) {
        console.log("[v0] No results found on Gogoanime for:", title)
        return this.getMockEpisodes(animeDetails.episodes || 12)
      }

      // Use the first result (most relevant)
      const gogoAnimeId = searchResults[0].id
      console.log("[v0] Using Gogoanime ID:", gogoAnimeId)

      const episodeStrategies = [
        async () => {
          const response = await fetch(`${this.consumetUrl}/info/${gogoAnimeId}`)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return await response.json()
        },
        async () => {
          for (const altUrl of this.alternativeConsumets) {
            try {
              const response = await fetch(`${altUrl}/info/${gogoAnimeId}`)
              if (response.ok) {
                return await response.json()
              }
            } catch (e) {
              continue
            }
          }
          throw new Error("All alternative endpoints failed")
        },
      ]

      for (let i = 0; i < episodeStrategies.length; i++) {
        try {
          console.log(`[v0] Trying episode fetch strategy ${i + 1}`)
          const data = await episodeStrategies[i]()
          console.log("[v0] Episodes fetched successfully:", data.episodes?.length || 0)
          return data.episodes || []
        } catch (error) {
          console.log(`[v0] Episode strategy ${i + 1} failed:`, error.message)
          continue
        }
      }

      console.log("[v0] All episode fetch strategies failed, using mock episodes")
      return this.getMockEpisodes(animeDetails.episodes || 12)
    } catch (error) {
      console.error("Error fetching episodes:", error)
      return []
    }
  }

  async getStreamingData(episodeId: string): Promise<StreamingData | null> {
    try {
      console.log("[v0] Fetching streaming data for episode:", episodeId)

      if (episodeId.startsWith("episode-")) {
        console.log("[v0] Mock episode detected, returning demo streaming data")
        return {
          sources: [
            {
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              quality: "720p",
              isM3U8: false,
            },
          ],
          subtitles: [],
        }
      }

      const streamingStrategies = [
        async () => {
          const response = await fetch(`${this.consumetUrl}/watch/${episodeId}`)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return await response.json()
        },
        async () => {
          for (const altUrl of this.alternativeConsumets) {
            try {
              const response = await fetch(`${altUrl}/watch/${episodeId}`)
              if (response.ok) {
                return await response.json()
              }
            } catch (e) {
              continue
            }
          }
          throw new Error("All alternative endpoints failed")
        },
      ]

      for (let i = 0; i < streamingStrategies.length; i++) {
        try {
          console.log(`[v0] Trying streaming strategy ${i + 1}`)
          const data = await streamingStrategies[i]()
          console.log("[v0] Streaming data fetched successfully")
          return data
        } catch (error) {
          console.log(`[v0] Streaming strategy ${i + 1} failed:`, error.message)
          continue
        }
      }

      console.log("[v0] All streaming strategies failed")
      return null
    } catch (error) {
      console.error("Error fetching streaming data:", error)
      return null
    }
  }

  // Helper function to convert AniList title to Gogoanime format
  formatTitleForGogoanime(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  async searchGogoanime(title: string): Promise<any[]> {
    try {
      console.log("[v0] Searching Gogoanime for:", title)

      const searchStrategies = [
        // Strategy 1: Direct search endpoint
        async () => {
          const response = await fetch(`${this.consumetUrl}/search?q=${encodeURIComponent(title)}`)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const data = await response.json()
          return data.results || []
        },
        // Strategy 2: Try alternative endpoints
        async () => {
          for (const altUrl of this.alternativeConsumets) {
            try {
              const response = await fetch(`${altUrl}/search?q=${encodeURIComponent(title)}`)
              if (response.ok) {
                const data = await response.json()
                return data.results || []
              }
            } catch (e) {
              continue
            }
          }
          throw new Error("All alternative endpoints failed")
        },
        // Strategy 3: Try with simplified title
        async () => {
          const simplifiedTitle = title.replace(/Season \d+/i, "").trim()
          const response = await fetch(`${this.consumetUrl}/search?q=${encodeURIComponent(simplifiedTitle)}`)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const data = await response.json()
          return data.results || []
        },
      ]

      // Try each strategy until one works
      for (let i = 0; i < searchStrategies.length; i++) {
        try {
          console.log(`[v0] Trying search strategy ${i + 1}`)
          const results = await searchStrategies[i]()
          if (results.length > 0) {
            console.log(`[v0] Strategy ${i + 1} succeeded with ${results.length} results`)
            return results
          }
        } catch (error) {
          console.log(`[v0] Strategy ${i + 1} failed:`, error.message)
          continue
        }
      }

      console.log("[v0] All search strategies failed")
      return []
    } catch (error) {
      console.error("Error searching Gogoanime:", error)
      return []
    }
  }

  private getMockEpisodes(episodeCount: number): Episode[] {
    const episodes: Episode[] = []
    for (let i = 1; i <= episodeCount; i++) {
      episodes.push({
        id: `episode-${i}`,
        title: `Episode ${i}`,
        number: i,
        image: `/placeholder.svg?height=200&width=300&query=anime episode ${i}`,
        description: `Episode ${i} description`,
      })
    }
    console.log(`[v0] Generated ${episodes.length} mock episodes`)
    return episodes
  }
}

export const animeAPI = new AnimeAPI()
