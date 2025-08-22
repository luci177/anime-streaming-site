"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trending", label: "Trending" },
    { href: "/popular", label: "Popular" },
    { href: "/genres", label: "Genres" },
  ]

  const browseCategories = [
    { href: "/ongoing", label: "Currently Airing" },
    { href: "/completed", label: "Completed" },
    { href: "/recent", label: "Recent Episodes" },
    { href: "/popular", label: "Most Popular" },
    { href: "/trending", label: "Trending Now" },
  ]

  const userMenuItems = [
    { href: "/profile", label: "Profile" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/favorites", label: "Favorites" },
    { href: "/history", label: "Watch History" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-serif font-bold text-xl text-foreground">AnimeVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary font-medium">
                  Browse <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {browseCategories.map((category) => (
                  <DropdownMenuItem key={category.href} asChild>
                    <Link href={category.href} className="w-full">
                      {category.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
            </form>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary"
                />
              </form>

              {/* Mobile Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Browse Categories</p>
                {browseCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Account</p>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
