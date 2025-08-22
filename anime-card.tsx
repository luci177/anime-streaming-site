import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Clock, Calendar } from "lucide-react"
import type { AnimeInfo } from "@/lib/api"

interface AnimeCardProps {
  anime: AnimeInfo
  showPlayButton?: boolean
}

export function AnimeCard({ anime, showPlayButton = true }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null

  return (
    <Card className="group relative overflow-hidden bg-card hover:bg-accent/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 border-border/50 hover:border-primary/20">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.coverImage.large || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Play button with enhanced animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          {showPlayButton && (
            <Link
              href={`/anime/${anime.id}`}
              className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-4 transform scale-50 group-hover:scale-100 transition-all duration-500 backdrop-blur-sm shadow-lg hover:shadow-primary/25"
            >
              <Play className="w-6 h-6 fill-current" />
            </Link>
          )}
        </div>

        {/* Enhanced score badge */}
        {score && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-white">{score}</span>
          </div>
        )}

        {/* Enhanced status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={anime.status === "RELEASING" ? "default" : "secondary"}
            className={`text-xs font-medium px-2.5 py-1 ${
              anime.status === "RELEASING"
                ? "bg-green-500/90 text-white border-green-400/50"
                : "bg-gray-500/90 text-white border-gray-400/50"
            } backdrop-blur-sm`}
          >
            {anime.status === "RELEASING" ? "Ongoing" : "Completed"}
          </Badge>
        </div>

        {/* Episode count indicator */}
        {anime.episodes && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-xs font-medium text-white">{anime.episodes}</span>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <Link href={`/anime/${anime.id}`}>
          <h3 className="font-serif font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Enhanced metadata section */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{anime.seasonYear || "N/A"}</span>
          </div>
          {anime.episodes && <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">{anime.episodes} eps</span>}
        </div>

        {/* Enhanced genres section */}
        <div className="flex flex-wrap gap-1.5">
          {anime.genres.slice(0, 3).map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="text-xs px-2.5 py-0.5 hover:bg-primary/10 hover:border-primary/30 transition-colors duration-300 cursor-pointer"
            >
              {genre}
            </Badge>
          ))}
          {anime.genres.length > 3 && (
            <Badge variant="outline" className="text-xs px-2.5 py-0.5 text-muted-foreground">
              +{anime.genres.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
