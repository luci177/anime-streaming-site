"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Info, Star, ChevronLeft, ChevronRight, Pause, PlayIcon } from "lucide-react"
import type { AnimeInfo } from "@/lib/api"

interface HeroSectionProps {
  featuredAnime: AnimeInfo[]
}

export function HeroSection({ featuredAnime }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying || featuredAnime.length <= 1) return

    const interval = setInterval(() => {
      handleNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredAnime.length, currentIndex])

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % featuredAnime.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  if (featuredAnime.length === 0) return null

  const currentAnime = featuredAnime[currentIndex]
  const title = currentAnime.title.english || currentAnime.title.romaji
  const score = currentAnime.averageScore ? (currentAnime.averageScore / 10).toFixed(1) : null

  return (
    <section className="relative h-[75vh] min-h-[600px] overflow-hidden group">
      {/* Background Image with enhanced transitions */}
      <div className="absolute inset-0">
        <Image
          src={currentAnime.bannerImage || currentAnime.coverImage.large}
          alt={title}
          fill
          className={`object-cover transition-all duration-700 ${isTransitioning ? "scale-110 blur-sm" : "scale-105"}`}
          priority
        />
        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      </div>

      {/* Navigation arrows */}
      {featuredAnime.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Content with enhanced animations */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div
            className={`max-w-2xl space-y-6 transition-all duration-700 ${isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}`}
          >
            {/* Enhanced badges section */}
            <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-700">
              <Badge
                variant={currentAnime.status === "RELEASING" ? "default" : "secondary"}
                className="text-sm font-semibold px-3 py-1.5 shadow-lg"
              >
                {currentAnime.status === "RELEASING" ? "🔴 Ongoing" : "✅ Completed"}
              </Badge>
              {score && (
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">{score}</span>
                </div>
              )}
              {currentAnime.seasonYear && (
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  {currentAnime.seasonYear}
                </Badge>
              )}
            </div>

            {/* Enhanced title with better typography */}
            <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight animate-in slide-in-from-left-6 duration-700 delay-100">
              {title}
            </h1>

            {/* Enhanced description */}
            {currentAnime.description && (
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed line-clamp-3 max-w-2xl animate-in slide-in-from-left-8 duration-700 delay-200">
                {currentAnime.description.replace(/<[^>]*>/g, "")}
              </p>
            )}

            {/* Enhanced genres */}
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-left-10 duration-700 delay-300">
              {currentAnime.genres.slice(0, 4).map((genre, index) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="text-sm bg-white/5 border-white/20 text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Enhanced action buttons */}
            <div className="flex items-center gap-4 animate-in slide-in-from-left-12 duration-700 delay-400">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
              >
                <Link href={`/anime/${currentAnime.id}`}>
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link href={`/anime/${currentAnime.id}`}>
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced carousel controls */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          {/* Play/Pause button */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 text-white" /> : <PlayIcon className="w-4 h-4 text-white" />}
          </button>

          {/* Enhanced indicators */}
          <div className="flex gap-2">
            {featuredAnime.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-3 bg-primary shadow-lg shadow-primary/50"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress bar for auto-play */}
      {isAutoPlaying && featuredAnime.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % 6000) / 6000) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  )
}
