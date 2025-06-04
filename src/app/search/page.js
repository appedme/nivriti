'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import StoryCard from '@/components/stories/StoryCard';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Mock search results
const searchResults = {
  stories: [
    {
      id: 1,
      title: "Finding Peace in the Morning Light",
      excerpt: "The first rays of sunlight filtered through my bedroom window, painting golden patterns on the wall...",
      author: {
        name: "Sarah Chen",
        username: "sarahwrites",
        avatar: "/api/placeholder/40/40"
      },
      publishedAt: "2024-01-15",
      readTime: "3 min read",
      tags: ["mindfulness", "morning", "peace"],
      likes: 142,
      comments: 28,
      coverImage: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "The Art of Slow Living",
      excerpt: "In a world that moves at breakneck speed, I've learned to find beauty in taking things slow...",
      author: {
        name: "Maya Patel",
        username: "mayawrites",
        avatar: "/api/placeholder/40/40"
      },
      publishedAt: "2024-01-10",
      readTime: "5 min read",
      tags: ["lifestyle", "mindfulness", "wellness"],
      likes: 89,
      comments: 15,
      coverImage: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Peaceful Moments in Chaos",
      excerpt: "Sometimes the most profound peace comes not from silence, but from finding calm within the storm...",
      author: {
        name: "Alex Johnson",
        username: "alexreflections",
        avatar: "/api/placeholder/40/40"
      },
      publishedAt: "2024-01-08",
      readTime: "4 min read",
      tags: ["peace", "mindfulness", "growth"],
      likes: 156,
      comments: 32,
      coverImage: "/api/placeholder/300/200"
    }
  ],
  authors: [
    {
      name: "Sarah Chen",
      username: "sarahwrites",
      avatar: "/api/placeholder/60/60",
      bio: "Finding stories in everyday moments",
      followers: 1542,
      storiesCount: 24
    },
    {
      name: "Maya Patel",
      username: "mayawrites",
      avatar: "/api/placeholder/60/60",
      bio: "Wellness writer and mindfulness advocate",
      followers: 987,
      storiesCount: 18
    },
    {
      name: "Alex Johnson",
      username: "alexreflections",
      avatar: "/api/placeholder/60/60",
      bio: "Sharing thoughts on growth and healing",
      followers: 743,
      storiesCount: 15
    }
  ]
};

const popularTags = [
  { name: "mindfulness", count: 1247 },
  { name: "peace", count: 892 },
  { name: "healing", count: 734 },
  { name: "morning", count: 456 },
  { name: "wellness", count: 623 },
  { name: "growth", count: 789 },
  { name: "reflection", count: 567 },
  { name: "lifestyle", count: 445 }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('stories');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredStories = searchResults.stories.filter(story => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => story.tags.includes(tag));
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case 'oldest':
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0; // relevance (keep original order)
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search stories, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-300 rounded-xl"
              />
            </div>
            
            {searchQuery && (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-gray-600">
                  Search results for <span className="font-semibold text-gray-900">"{searchQuery}"</span>
                  <span className="ml-2 text-sm">({searchResults.stories.length + searchResults.authors.length} results)</span>
                </p>
                
                <div className="flex items-center space-x-4">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 bg-white/80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="stories" className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Stories ({searchResults.stories.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="authors" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Authors ({searchResults.authors.length})</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="stories" className="space-y-6">
                  {sortedStories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedStories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No stories found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                      <Button variant="outline" onClick={() => setSelectedTags([])}>
                        Clear Filters
                      </Button>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="authors" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.authors.map((author) => (
                      <Card key={author.username} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <Link href={`/profile/${author.username}`} className="block">
                          <div className="flex items-center space-x-4 mb-4">
                            <img 
                              src={author.avatar} 
                              alt={author.name}
                              className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                            />
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{author.name}</h3>
                              <p className="text-gray-600">@{author.username}</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-4">{author.bio}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{author.followers} followers</span>
                            <span>{author.storiesCount} stories</span>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Popular Tags */}
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag.name)
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      #{tag.name} ({tag.count})
                    </button>
                  ))}
                </div>
              </Card>

              {/* Recent Searches */}
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {['mindfulness', 'morning routine', 'healing stories', 'self care'].map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Search Tips */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Search Tips</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Use quotes for exact phrases: "morning peace"</p>
                  <p>• Search by tags: #mindfulness #healing</p>
                  <p>• Find authors: @username</p>
                  <p>• Combine terms: meditation AND wellness</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
