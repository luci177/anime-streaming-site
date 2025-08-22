"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RatingSystemProps {
  animeId: string
  initialRating?: number
  totalRatings?: number
  averageRating?: number
}

export function RatingSystem({ animeId, initialRating = 0, totalRatings = 0, averageRating = 0 }: RatingSystemProps) {
  const [userRating, setUserRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // Here you would typically save to localStorage or send to API
    console.log(`[v0] User rated anime ${animeId} with ${rating} stars`)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(star)}
            >
              <Star
                className={`w-5 h-5 ${
                  star <= (hoverRating || userRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            </Button>
          ))}
        </div>
        {userRating > 0 && <span className="text-sm text-muted-foreground">You rated: {userRating}/5</span>}
      </div>

      {totalRatings > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{averageRating.toFixed(1)}/5</span>
          <span className="ml-2">({totalRatings.toLocaleString()} ratings)</span>
        </div>
      )}
    </div>
  )
}
