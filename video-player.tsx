"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import type { StreamingData } from "@/lib/api"

interface VideoPlayerProps {
  streamingData: StreamingData | null
  title: string
  episodeNumber: number
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function VideoPlayer({
  streamingData,
  title,
  episodeNumber,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [selectedQuality, setSelectedQuality] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (streamingData?.sources && streamingData.sources.length > 0) {
      setSelectedQuality(streamingData.sources[0].quality)
    }
  }, [streamingData])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("play", () => setIsPlaying(true))
    video.addEventListener("pause", () => setIsPlaying(false))

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("play", () => setIsPlaying(true))
      video.removeEventListener("pause", () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleQualityChange = (quality: string) => {
    const video = videoRef.current
    if (!video || !streamingData) return

    const source = streamingData.sources.find((s) => s.quality === quality)
    if (source) {
      const currentTime = video.currentTime
      video.src = source.url
      video.currentTime = currentTime
      setSelectedQuality(quality)
    }
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  if (!streamingData || !streamingData.sources.length) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No streaming source available</p>
      </div>
    )
  }

  const currentSource = streamingData.sources.find((s) => s.quality === selectedQuality) || streamingData.sources[0]

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group" onMouseMove={showControlsTemporarily}>
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={currentSource.url}
        onClick={togglePlay}
        onLoadStart={() => setIsPlaying(false)}
      >
        {streamingData.subtitles?.map((subtitle) => (
          <track
            key={subtitle.lang}
            kind="subtitles"
            src={subtitle.url}
            srcLang={subtitle.lang}
            label={subtitle.lang}
          />
        ))}
      </video>

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-white/70 text-sm">Episode {episodeNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedQuality} onValueChange={handleQualityChange}>
              <SelectTrigger className="w-20 h-8 bg-black/50 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {streamingData.sources.map((source) => (
                  <SelectItem key={source.quality} value={source.quality}>
                    {source.quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/30 text-white"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 fill-current" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Previous Episode */}
              {hasPrevious && (
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={onPrevious}>
                  <SkipBack className="w-4 h-4" />
                </Button>
              )}

              {/* Play/Pause */}
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </Button>

              {/* Next Episode */}
              {hasNext && (
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={onNext}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              )}

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
