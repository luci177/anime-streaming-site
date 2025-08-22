"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Calendar, Star, Eye } from "lucide-react"

interface UserStats {
  totalWatched: number
  totalEpisodes: number
  averageRating: number
  favoriteGenres: string[]
  joinDate: string
  watchTime: string
}

interface UserProfileProps {
  username: string
  avatar?: string
  stats: UserStats
}

export function UserProfile({ username, avatar, stats }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
              <AvatarFallback className="text-lg">{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{username}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {stats.joinDate}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalWatched}</div>
            <div className="text-sm text-muted-foreground">Anime Watched</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{stats.totalEpisodes}</div>
            <div className="text-sm text-muted-foreground">Episodes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{stats.watchTime}</div>
            <div className="text-sm text-muted-foreground">Watch Time</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteGenres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
