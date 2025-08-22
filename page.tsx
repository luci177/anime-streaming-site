import type { Metadata } from "next"
import { AnimeGrid } from "@/components/anime-grid"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Watch History",
  description: "Your anime watching history. Continue watching where you left off.",
  path: "/history",
})

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Watch History</h1>
          <p className="text-muted-foreground text-lg">
            Continue watching where you left off and track your anime viewing progress.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Recently watched</span>
            <span>•</span>
            <span>Last activity: 3 hours ago</span>
          </div>
        </div>

        <AnimeGrid endpoint="history" title="Continue Watching" showTitle={false} />
      </div>
    </div>
  )
}
