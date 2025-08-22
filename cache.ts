interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly TRENDING_TTL = 10 * 60 * 1000 // 10 minutes for trending
  private readonly ANIME_DETAILS_TTL = 30 * 60 * 1000 // 30 minutes for anime details

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.DEFAULT_TTL)

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  isStale(key: string, staleTime = 2 * 60 * 1000): boolean {
    const item = this.cache.get(key)
    if (!item) return true

    return Date.now() - item.timestamp > staleTime
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  getTTL(type: "trending" | "details" | "episodes" | "default"): number {
    switch (type) {
      case "trending":
        return this.TRENDING_TTL
      case "details":
        return this.ANIME_DETAILS_TTL
      case "episodes":
        return this.DEFAULT_TTL
      default:
        return this.DEFAULT_TTL
    }
  }
}

export const dataCache = new DataCache()
