'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StoryCard from '@/components/stories/StoryCard'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Heart, 
  Users, 
  BookOpen,
  Calendar,
  Star
} from 'lucide-react'

const genres = [
  'All', 'Healing', 'Romance', 'Fiction', 'Poetry', 'Life Stories', 
  'Mindfulness', 'Adventure', 'Mystery', 'Self Discovery', 'Love Letters'
]

const mockStories = [
  {
    id: '1',
    title: 'The Art of Letting Go',
    excerpt: 'Sometimes the most beautiful thing we can do is release what no longer serves us...',
    author: { name: 'Luna Martinez', avatar: '/api/placeholder/40/40' },
    coverImage: '/api/placeholder/400/200',
    tags: ['Healing', 'Mindfulness'],
    publishedAt: '3 hours ago',
    readTime: 7,
    likeCount: 89,
    commentCount: 23,
    viewCount: 445,
    isLiked: false,
    isBookmarked: false
  },
  // Add more mock stories...
]

const featuredAuthors = [
  {
    id: '1',
    name: 'Sarah Chen',
    bio: 'Writing about mindfulness and daily magic',
    avatar: '/api/placeholder/60/60',
    followers: '3.2k',
    stories: 24,
    tags: ['Mindfulness', 'Daily Life']
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    bio: 'Stories of healing and hope',
    avatar: '/api/placeholder/60/60',
    followers: '2.8k',
    stories: 18,
    tags: ['Healing', 'Life Stories']
  },
  {
    id: '3',
    name: 'Zoe Kim',
    bio: 'Poetry for the wandering soul',
    avatar: '/api/placeholder/60/60',
    followers: '4.1k',
    stories: 32,
    tags: ['Poetry', 'Self Discovery']
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [activeTab, setActiveTab] = useState('stories')

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">
                Explore Stories
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover meaningful stories from writers around the world
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search stories, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-12 pr-4 text-base"
                  />
                </div>
              </form>

              {/* Genre Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "secondary"}
                    className="cursor-pointer transition-colors px-4 py-2"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 mb-8">
                  <TabsTrigger value="stories" className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Stories
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="authors" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Authors
                  </TabsTrigger>
                </TabsList>

                {/* Stories Tab */}
                <TabsContent value="stories" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Latest Stories</h2>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {mockStories.map((story) => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>

                  <div className="text-center pt-8">
                    <Button variant="outline" size="lg">
                      Load More Stories
                    </Button>
                  </div>
                </TabsContent>

                {/* Trending Tab */}
                <TabsContent value="trending" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Trending This Week</h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Updated hourly</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {mockStories
                      .sort((a, b) => b.likeCount - a.likeCount)
                      .map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                  </div>
                </TabsContent>

                {/* Authors Tab */}
                <TabsContent value="authors" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Featured Authors</h2>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Top Rated
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredAuthors.map((author) => (
                      <Card key={author.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={author.avatar} alt={author.name} />
                              <AvatarFallback>{author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg">{author.name}</h3>
                                <p className="text-sm text-muted-foreground">{author.bio}</p>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{author.followers} followers</span>
                                <span>•</span>
                                <span>{author.stories} stories</span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {author.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <Button size="sm" className="w-full">
                                <Heart className="h-4 w-4 mr-2" />
                                Follow
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Community Stats</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stories today</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active writers</span>
                      <span className="font-semibold">2,341</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stories liked</span>
                      <span className="font-semibold">8,456</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Trending Topics</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { topic: 'Self Care Sunday', count: 89 },
                        { topic: 'Evening Reflections', count: 67 },
                        { topic: 'City Life', count: 54 },
                        { topic: 'Finding Joy', count: 43 },
                        { topic: 'Quiet Moments', count: 38 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">#{item.topic}</span>
                          <span className="text-xs text-muted-foreground">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reading Challenge */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <h3 className="font-semibold">Reading Challenge</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Join our monthly reading challenge and discover new perspectives.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>7/20 stories</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
