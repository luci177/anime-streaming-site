"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import type { Episode } from "@/lib/api"

interface EpisodeListProps {
  episodes: Episode[]
  currentEpisode?: number
  onEpisodeSelect: (episode: Episode) => void
  animeTitle: string
}

export function EpisodeList({ episodes, currentEpisode, onEpisodeSelect, animeTitle }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No episodes available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Episodes ({episodes.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50 ${
                currentEpisode === episode.number ? "bg-accent border-primary" : "border-border"
              }`}
              onClick={() => onEpisodeSelect(episode)}
            >
              {/* Episode Image */}
              {episode.image && (
                <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={episode.image || "/placeholder.svg"}
                    alt={`Episode ${episode.number}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    EP {episode.number}
                  </Badge>
                  {currentEpisode === episode.number && (
                    <Badge variant="default" className="text-xs">
                      Now Playing
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm line-clamp-1">
                  {episode.title || `${animeTitle} Episode ${episode.number}`}
                </h4>
                {episode.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{episode.description}</p>
                )}
              </div>

              {/* Play Button */}
              <Button
                size="sm"
                variant={currentEpisode === episode.number ? "default" : "ghost"}
                className="flex-shrink-0"
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
