"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

interface AutoUpdateIndicatorProps {
  lastUpdated: Date | null
  isLoading?: boolean
}

export function AutoUpdateIndicator({ lastUpdated, isLoading = false }: AutoUpdateIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    if (!lastUpdated) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdated.getTime()
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      if (minutes > 0) {
        setTimeAgo(`${minutes}m ago`)
      } else {
        setTimeAgo(`${seconds}s ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  if (!lastUpdated && !isLoading) return null

  return (
    <Badge variant="outline" className="text-xs flex items-center gap-1">
      <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Updating..." : `Updated ${timeAgo}`}
    </Badge>
  )
}
