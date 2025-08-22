"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { animeAPI } from "@/lib/api"
import { dataCache } from "@/lib/cache"
import { autoUpdater } from "@/lib/auto-updater"
import type { AnimeInfo, Episode } from "@/lib/api"

export function useTrendingAnime() {
  const [anime, setAnime] = useState<AnimeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const callbackRef = useRef<() => void>()

  const refreshData = useCallback(async () => {
    try {
      // Check cache first
      const cached = dataCache.get<AnimeInfo[]>("trending-anime")
      if (cached) {
        setAnime(cached)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const trendingAnime = await animeAPI.getTrendingAnime(1, 24)
      setAnime(trendingAnime)

      // Cache the data
      dataCache.set("trending-anime", trendingAnime, dataCache.getTTL("trending"))
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching trending anime:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Create callback for auto-updates
    callbackRef.current = () => {
      const cached = dataCache.get<AnimeInfo[]>("trending-anime")
      if (cached) {
        setAnime(cached)
        setLastUpdated(new Date())
      }
    }

    // Initial load
    refreshData()

    // Start auto-updates
    autoUpdater.startTrendingUpdates(callbackRef.current)

    return () => {
      if (callbackRef.current) {
        autoUpdater.removeCallback("trending-auto-update", callbackRef.current)
      }
    }
  }, [refreshData])

  return { anime, loading, lastUpdated, refresh: refreshData }
}

export function useAnimeDetails(animeId: number) {
  const [anime, setAnime] = useState<AnimeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const callbackRef = useRef<() => void>()

  const refreshData = useCallback(async () => {
    try {
      // Check cache first
      const cached = dataCache.get<AnimeInfo>(`anime-details-${animeId}`)
      if (cached) {
        setAnime(cached)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const animeDetails = await animeAPI.getAnimeDetails(animeId)
      setAnime(animeDetails)

      // Cache the data
      if (animeDetails) {
        dataCache.set(`anime-details-${animeId}`, animeDetails, dataCache.getTTL("details"))
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching anime details:", error)
    } finally {
      setLoading(false)
    }
  }, [animeId])

  useEffect(() => {
    // Create callback for auto-updates
    callbackRef.current = () => {
      const cached = dataCache.get<AnimeInfo>(`anime-details-${animeId}`)
      if (cached) {
        setAnime(cached)
        setLastUpdated(new Date())
      }
    }

    // Initial load
    refreshData()

    // Start auto-updates
    autoUpdater.startAnimeDetailsUpdates(animeId, callbackRef.current)

    return () => {
      if (callbackRef.current) {
        autoUpdater.removeCallback(`anime-details-${animeId}`, callbackRef.current)
      }
    }
  }, [animeId, refreshData])

  return { anime, loading, lastUpdated, refresh: refreshData }
}

export function useAnimeEpisodes(animeId: string) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const callbackRef = useRef<() => void>()

  const refreshData = useCallback(async () => {
    try {
      // Check cache first
      const cached = dataCache.get<Episode[]>(`episodes-${animeId}`)
      if (cached) {
        setEpisodes(cached)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const episodeList = await animeAPI.getAnimeEpisodes(animeId)
      setEpisodes(episodeList)

      // Cache the data
      dataCache.set(`episodes-${animeId}`, episodeList, dataCache.getTTL("episodes"))
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching episodes:", error)
    } finally {
      setLoading(false)
    }
  }, [animeId])

  useEffect(() => {
    // Create callback for auto-updates
    callbackRef.current = () => {
      const cached = dataCache.get<Episode[]>(`episodes-${animeId}`)
      if (cached) {
        setEpisodes(cached)
        setLastUpdated(new Date())
      }
    }

    // Initial load
    refreshData()

    // Start auto-updates
    autoUpdater.startEpisodesUpdates(animeId, callbackRef.current)

    return () => {
      if (callbackRef.current) {
        autoUpdater.removeCallback(`episodes-${animeId}`, callbackRef.current)
      }
    }
  }, [animeId, refreshData])

  return { episodes, loading, lastUpdated, refresh: refreshData }
}
