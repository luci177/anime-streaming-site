import { Search, Film, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  type?: "search" | "watchlist" | "favorites" | "general"
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ type = "general", title, description, actionLabel, actionHref }: EmptyStateProps) {
  const configs = {
    search: {
      icon: Search,
      title: "No anime found",
      description: "Try adjusting your search terms or browse our categories",
      actionLabel: "Browse Trending",
      actionHref: "/trending",
    },
    watchlist: {
      icon: Film,
      title: "Your watchlist is empty",
      description: "Start adding anime you want to watch to keep track of them",
      actionLabel: "Discover Anime",
      actionHref: "/trending",
    },
    favorites: {
      icon: Heart,
      title: "No favorites yet",
      description: "Mark anime as favorites to easily find them later",
      actionLabel: "Browse Popular",
      actionHref: "/popular",
    },
    general: {
      icon: Film,
      title: "Nothing here yet",
      description: "Check back later for more content",
      actionLabel: "Go Home",
      actionHref: "/",
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title || config.title}</h3>

      <p className="text-muted-foreground mb-6 max-w-md">{description || config.description}</p>

      {(actionLabel || config.actionLabel) && (actionHref || config.actionHref) && (
        <Button asChild>
          <Link href={actionHref || config.actionHref}>{actionLabel || config.actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
