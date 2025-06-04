'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  PenTool, 
  BookOpen, 
  Heart, 
  Users, 
  Sparkles, 
  Search,
  ArrowRight 
} from 'lucide-react'

const popularTags = [
  'Healing', 'Romance', 'Fiction', 'Diary', 'Poetry', 'Life Stories', 'Adventure', 'Mystery'
]

const features = [
  {
    icon: PenTool,
    title: 'Write with Peace',
    description: 'A distraction-free writing environment designed for mindful storytelling.'
  },
  {
    icon: BookOpen,
    title: 'Discover Stories',
    description: 'Find stories that resonate with your soul and inspire your journey.'
  },
  {
    icon: Heart,
    title: 'Connect & Heal',
    description: 'Share your experiences and find comfort in others\' stories.'
  },
  {
    icon: Users,
    title: 'Gentle Community',
    description: 'Join a supportive community of writers and readers who understand.'
  }
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 calm-gradient -z-10" />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Badge variant="outline" className="text-sm px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                A place for mindful storytelling
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Where Stories
              <span className="block text-primary">Find Peace</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Share your journey, discover healing narratives, and connect with a gentle community 
              of writers and readers who understand the power of words.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for stories, authors, or topics that speak to you..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-32 text-base border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Popular Tags */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Popular topics:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  asChild
                >
                  <Link href={`/explore?tag=${encodeURIComponent(tag)}`}>
                    {tag}
                  </Link>
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild className="min-w-[160px]">
              <Link href="/write">
                <PenTool className="mr-2 h-5 w-5" />
                Start Writing
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[160px]">
              <Link href="/explore">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Stories
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Stories shared</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">5,000+</div>
                  <div className="text-sm text-muted-foreground">Writers & readers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">50,000+</div>
                  <div className="text-sm text-muted-foreground">Healing moments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
