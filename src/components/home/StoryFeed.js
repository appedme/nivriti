'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TrendingUp, Clock, Heart, Filter } from 'lucide-react'
import StoryCard from '../stories/StoryCard'

// Mock data - replace with real data
const mockStories = [
  {
    id: '1',
    title: 'Finding Peace in Morning Rituals',
    excerpt: 'How a simple cup of tea changed my perspective on mindfulness and presence. In the quiet moments of dawn, I discovered something profound about the art of being still...',
    author: {
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40'
    },
    coverImage: '/api/placeholder/400/200',
    tags: ['Healing', 'Mindfulness', 'Daily Life'],
    publishedAt: '2 hours ago',
    readTime: 5,
    likeCount: 24,
    commentCount: 8,
    viewCount: 156,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Letters to My Younger Self',
    excerpt: 'A collection of gentle words I wish someone had told me when I was learning to navigate this beautiful, complex world of emotions and dreams...',
    author: {
      name: 'Marcus Johnson',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['Life Stories', 'Healing', 'Reflection'],
    publishedAt: '5 hours ago',
    readTime: 8,
    likeCount: 42,
    commentCount: 15,
    viewCount: 289,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'The Garden That Taught Me Patience',
    excerpt: 'Through seasons of planting, waiting, and harvesting, I learned that growth happens in its own time. Here\'s what my garden taught me about life...',
    author: {
      name: 'Elena Rodriguez',
      avatar: '/api/placeholder/40/40'
    },
    coverImage: '/api/placeholder/400/200',
    tags: ['Nature', 'Life Lessons', 'Poetry'],
    publishedAt: '1 day ago',
    readTime: 6,
    likeCount: 18,
    commentCount: 12,
    viewCount: 203,
    isLiked: false,
    isBookmarked: false
  }
]

const featuredTags = [
  'Healing', 'Romance', 'Fiction', 'Poetry', 'Life Stories', 'Mindfulness', 'Adventure', 'Mystery'
]

export default function StoryFeed() {
  const [activeTab, setActiveTab] = useState('recent')
  const [selectedTags, setSelectedTags] = useState([])

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Section Header */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Discover Stories</h2>
              
              {/* Feed Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
                  <TabsTrigger value="recent" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Following
                  </TabsTrigger>
                </TabsList>

                {/* Story Lists */}
                <TabsContent value="recent" className="mt-6 space-y-6">
                  {mockStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </TabsContent>

                <TabsContent value="trending" className="mt-6 space-y-6">
                  {mockStories
                    .sort((a, b) => b.likeCount - a.likeCount)
                    .map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </TabsContent>

                <TabsContent value="following" className="mt-6 space-y-6">
                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <Heart className="h-12 w-12 text-muted-foreground/50" />
                      <div className="space-y-2">
                        <h3 className="font-semibold">Follow authors to see their stories here</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Start following writers whose stories resonate with you to create a personalized feed.
                        </p>
                      </div>
                      <Button asChild>
                        <a href="/explore">Discover Authors</a>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button variant="outline" size="lg">
                Load More Stories
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Filter by Tags */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filter by Topics</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {featuredTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="mt-3 w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Trending This Week</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag: 'Mental Health', count: 128 },
                    { tag: 'Self Discovery', count: 94 },
                    { tag: 'Love Letters', count: 87 },
                    { tag: 'Night Thoughts', count: 76 },
                    { tag: 'Small Victories', count: 62 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.tag}</span>
                      <span className="text-xs text-muted-foreground">{item.count} stories</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Authors */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Authors to Follow</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Maya Patel', bio: 'Writing about healing and hope', followers: '2.3k' },
                    { name: 'James Wright', bio: 'Stories from the heart', followers: '1.8k' },
                    { name: 'Zoe Kim', bio: 'Poetry and prose for the soul', followers: '1.5k' }
                  ].map((author, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{author.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{author.bio}</p>
                        <p className="text-xs text-muted-foreground">{author.followers} followers</p>
                      </div>
                      <Button size="sm" variant="outline">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
