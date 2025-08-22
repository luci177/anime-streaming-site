import { animeAPI } from "./api"
import { dataCache } from "./cache"

class AutoUpdater {
  private intervals = new Map<string, NodeJS.Timeout>()
  private updateCallbacks = new Map<string, Set<() => void>>()

  // Start auto-updating trending anime
  startTrendingUpdates(callback?: () => void): void {
    const key = "trending-auto-update"

    // Clear existing interval
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key))
    }

    // Add callback
    if (callback) {
      if (!this.updateCallbacks.has(key)) {
        this.updateCallbacks.set(key, new Set())
      }
      this.updateCallbacks.get(key)!.add(callback)
    }

    // Update immediately
    this.updateTrendingAnime()

    // Set up interval for updates every 10 minutes
    const interval = setInterval(
      () => {
        this.updateTrendingAnime()
      },
      10 * 60 * 1000,
    )

    this.intervals.set(key, interval)
  }

  // Start auto-updating anime details
  startAnimeDetailsUpdates(animeId: number, callback?: () => void): void {
    const key = `anime-details-${animeId}`

    // Clear existing interval
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key))
    }

    // Add callback
    if (callback) {
      if (!this.updateCallbacks.has(key)) {
        this.updateCallbacks.set(key, new Set())
      }
      this.updateCallbacks.get(key)!.add(callback)
    }

    // Update immediately if data is stale
    if (dataCache.isStale(`anime-details-${animeId}`)) {
      this.updateAnimeDetails(animeId)
    }

    // Set up interval for updates every 30 minutes
    const interval = setInterval(
      () => {
        this.updateAnimeDetails(animeId)
      },
      30 * 60 * 1000,
    )

    this.intervals.set(key, interval)
  }

  // Start auto-updating episodes
  startEpisodesUpdates(animeId: string, callback?: () => void): void {
    const key = `episodes-${animeId}`

    // Clear existing interval
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key))
    }

    // Add callback
    if (callback) {
      if (!this.updateCallbacks.has(key)) {
        this.updateCallbacks.set(key, new Set())
      }
      this.updateCallbacks.get(key)!.add(callback)
    }

    // Update immediately if data is stale
    if (dataCache.isStale(`episodes-${animeId}`)) {
      this.updateEpisodes(animeId)
    }

    // Set up interval for updates every 5 minutes for ongoing anime
    const interval = setInterval(
      () => {
        this.updateEpisodes(animeId)
      },
      5 * 60 * 1000,
    )

    this.intervals.set(key, interval)
  }

  private async updateTrendingAnime(): Promise<void> {
    try {
      console.log("[AutoUpdater] Updating trending anime...")
      const trendingAnime = await animeAPI.getTrendingAnime(1, 24)

      // Cache the data
      dataCache.set("trending-anime", trendingAnime, dataCache.getTTL("trending"))

      // Notify callbacks
      const callbacks = this.updateCallbacks.get("trending-auto-update")
      if (callbacks) {
        callbacks.forEach((callback) => callback())
      }

      console.log("[AutoUpdater] Trending anime updated successfully")
    } catch (error) {
      console.error("[AutoUpdater] Failed to update trending anime:", error)
    }
  }

  private async updateAnimeDetails(animeId: number): Promise<void> {
    try {
      console.log(`[AutoUpdater] Updating anime details for ${animeId}...`)
      const animeDetails = await animeAPI.getAnimeDetails(animeId)

      if (animeDetails) {
        // Cache the data
        dataCache.set(`anime-details-${animeId}`, animeDetails, dataCache.getTTL("details"))

        // Notify callbacks
        const callbacks = this.updateCallbacks.get(`anime-details-${animeId}`)
        if (callbacks) {
          callbacks.forEach((callback) => callback())
        }

        console.log(`[AutoUpdater] Anime details updated successfully for ${animeId}`)
      }
    } catch (error) {
      console.error(`[AutoUpdater] Failed to update anime details for ${animeId}:`, error)
    }
  }

  private async updateEpisodes(animeId: string): Promise<void> {
    try {
      console.log(`[AutoUpdater] Updating episodes for ${animeId}...`)
      const episodes = await animeAPI.getAnimeEpisodes(animeId)

      // Cache the data
      dataCache.set(`episodes-${animeId}`, episodes, dataCache.getTTL("episodes"))

      // Notify callbacks
      const callbacks = this.updateCallbacks.get(`episodes-${animeId}`)
      if (callbacks) {
        callbacks.forEach((callback) => callback())
      }

      console.log(`[AutoUpdater] Episodes updated successfully for ${animeId}`)
    } catch (error) {
      console.error(`[AutoUpdater] Failed to update episodes for ${animeId}:`, error)
    }
  }

  // Stop specific auto-update
  stop(key: string): void {
    const interval = this.intervals.get(key)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(key)
    }

    this.updateCallbacks.delete(key)
  }

  // Stop all auto-updates
  stopAll(): void {
    for (const [key, interval] of this.intervals) {
      clearInterval(interval)
    }
    this.intervals.clear()
    this.updateCallbacks.clear()
  }

  // Remove callback
  removeCallback(key: string, callback: () => void): void {
    const callbacks = this.updateCallbacks.get(key)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }
}

export const autoUpdater = new AutoUpdater()

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    autoUpdater.stopAll()
  })
}
