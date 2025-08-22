"use client"

import { useState } from "react"
import { AnimeCard } from "./anime-card"
import { LoadingSpinner } from "./loading-spinner"
import { EmptyState } from "./empty-state"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { AnimeInfo } from "@/lib/api"

interface AnimeGridProps {
  anime?: AnimeInfo[]
  title?: string
  showTitle?: boolean
  endpoint?: string
  isLoading?: boolean
  error?: string
}

export function AnimeGrid({ anime = [], title, showTitle = true, endpoint, isLoading = false, error }: AnimeGridProps) {
  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    // This would trigger a refetch in the parent component
    window.location.reload()
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        {showTitle && title && (
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-foreground">{title}</h2>
          </div>
        )}
        <LoadingSpinner size="lg" text="Loading anime..." />
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        {showTitle && title && (
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-foreground">{title}</h2>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <RefreshCw className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  if (anime.length === 0) {
    const emptyStateType = endpoint?.includes("watchlist")
      ? "watchlist"
      : endpoint?.includes("favorites")
        ? "favorites"
        : endpoint?.includes("search")
          ? "search"
          : "general"

    return (
      <section className="space-y-6">
        {showTitle && title && (
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-foreground">{title}</h2>
          </div>
        )}
        <EmptyState type={emptyStateType} />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {showTitle && title && (
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-2xl text-foreground">{title}</h2>
          <div className="text-sm text-muted-foreground">
            {anime.length} {anime.length === 1 ? "anime" : "anime"}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {anime.map((item, index) => (
          <div
            key={item.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <AnimeCard anime={item} />
          </div>
        ))}
      </div>

      {anime.length > 0 && anime.length % 20 === 0 && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" size="lg" className="min-w-32 bg-transparent">
            Load More
          </Button>
        </div>
      )}
    </section>
  )
}
