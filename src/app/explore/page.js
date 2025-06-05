'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import StoryCard from '@/components/stories/StoryCard'
import { useStories, useTrendingStories, useFeaturedStories, useStoriesByTag } from '@/hooks/useStories'
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

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch stories based on search and filters
  const { stories: allStories, isLoading: allStoriesLoading } = useStories({ 
    search: debouncedQuery,
    tag: selectedGenre !== 'All' ? selectedGenre : null,
    limit: 30
  });
  
  const { stories: trendingStories, isLoading: trendingLoading } = useTrendingStories({ limit: 10 });
  const { stories: featuredStories, isLoading: featuredLoading } = useFeaturedStories({ limit: 5 });
  
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  // Render skeletons while loading
  const renderStorySkeletons = (count) => {
    return Array(count).fill(0).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="relative">
          <Skeleton className="w-full h-48" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <Skeleton className="h-6 w-3/4 bg-gray-200/50 mb-2" />
            <Skeleton className="h-4 w-1/2 bg-gray-200/50" />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex space-x-2 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Stories</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thoughtful stories from writers around the world. Find inspiration, healing, and connection.
            </p>
            
            <div className="max-w-lg mx-auto relative">
              <Input
                placeholder="Search stories..."
                className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500 h-12 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </section>
          
          {/* Genre filters */}
          <section className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {genres.map((genre, i) => (
                <Badge
                  key={i}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  className={`px-4 py-1.5 cursor-pointer text-sm font-medium ${
                    selectedGenre === genre 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </section>
          
          {/* Featured Stories */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" /> 
                Featured Stories
              </h2>
            </div>
            
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {renderStorySkeletons(5)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {(featuredStories?.length > 0 ? featuredStories : allStories.slice(0, 5)).map((story) => (
                  <StoryCard key={story.id} story={story} layout="vertical" />
                ))}
              </div>
            )}
          </section>
          
          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="all">All Stories</TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allStoriesLoading ? (
                  renderStorySkeletons(9)
                ) : allStories.length > 0 ? (
                  allStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No stories found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <Button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingLoading ? (
                  renderStorySkeletons(9)
                ) : trendingStories.length > 0 ? (
                  trendingStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No trending stories</h3>
                    <p className="text-gray-500">Check back soon for trending content</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
