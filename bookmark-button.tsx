"use client"

import { useState } from "react"
import { Bookmark, BookmarkCheck, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BookmarkButtonProps {
  animeId: string
  title: string
  isBookmarked?: boolean
  isFavorited?: boolean
  isInWatchlist?: boolean
}

export function BookmarkButton({
  animeId,
  title,
  isBookmarked = false,
  isFavorited = false,
  isInWatchlist = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [favorited, setFavorited] = useState(isFavorited)
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist)

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    console.log(`[v0] ${bookmarked ? "Removed" : "Added"} ${title} to bookmarks`)
  }

  const handleFavorite = () => {
    setFavorited(!favorited)
    console.log(`[v0] ${favorited ? "Removed" : "Added"} ${title} to favorites`)
  }

  const handleWatchlist = () => {
    setInWatchlist(!inWatchlist)
    console.log(`[v0] ${inWatchlist ? "Removed" : "Added"} ${title} to watchlist`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add to List
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleBookmark}>
          {bookmarked ? <BookmarkCheck className="w-4 h-4 mr-2 text-primary" /> : <Bookmark className="w-4 h-4 mr-2" />}
          {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFavorite}>
          <Heart className={`w-4 h-4 mr-2 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
          {favorited ? "Remove from Favorites" : "Add to Favorites"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleWatchlist}>
          <Plus className="w-4 h-4 mr-2" />
          {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
