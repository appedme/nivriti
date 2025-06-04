'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStories } from '@/hooks/useApi';
import Layout from '@/components/layout/Layout';
import StoryCard from '@/components/stories/StoryCard';
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [activeTab, setActiveTab] = useState('stories');
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortBy, setSortBy] = useState('relevance');

    // API calls
    const { data: storiesData, loading: storiesLoading } = useStories({
        search: searchQuery,
        tag: selectedTag,
        limit: 20
    });

    const stories = storiesData?.stories || [];

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleTagClick = (tagName) => {
        setSelectedTag(selectedTag === tagName ? null : tagName);
    };

    // Popular tags for search suggestions
    const popularTags = [
        { name: "mindfulness", count: 1247 },
        { name: "peace", count: 892 },
        { name: "healing", count: 734 },
        { name: "morning", count: 456 },
        { name: "wellness", count: 623 },
        { name: "growth", count: 789 },
        { name: "reflection", count: 567 },
        { name: "nature", count: 443 },
        { name: "lifestyle", count: 445 }
    ];

    const sortedStories = [...stories].sort((a, b) => {
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
                        <form onSubmit={handleSearch} className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search stories, authors, or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-3 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-300 rounded-xl"
                            />
                        </form>
                        
                        {searchQuery && (
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <p className="text-gray-600">
                                    Search results for <span className="font-semibold text-gray-900">"{searchQuery}"</span>
                                    <span className="ml-2 text-sm">({stories.length} results)</span>
                                </p>
                                
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-blue-300"
                                    >
                                        <option value="relevance">Most Relevant</option>
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Popular Tags */}
                    {!searchQuery && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Topics</h2>
                            <div className="flex flex-wrap gap-3">
                                {popularTags.map((tag) => (
                                    <button
                                        key={tag.name}
                                        onClick={() => handleTagClick(tag.name)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedTag === tag.name
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200'
                                        }`}
                                    >
                                        #{tag.name} ({tag.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results or Default Content */}
                    {searchQuery || selectedTag ? (
                        <div>
                            {/* Active Filters */}
                            {selectedTag && (
                                <div className="mb-6 flex items-center space-x-2">
                                    <span className="text-gray-600">Filtered by:</span>
                                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center space-x-2">
                                        <span>#{selectedTag}</span>
                                        <button
                                            onClick={() => setSelectedTag(null)}
                                            className="ml-2 hover:bg-blue-700 rounded"
                                        >
                                            ×
                                        </button>
                                    </span>
                                </div>
                            )}

                            {/* Stories Results */}
                            {storiesLoading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="animate-pulse">
                                            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : sortedStories.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortedStories.map((story) => (
                                        <StoryCard key={story.id} story={story} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your search terms or browse popular topics above.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedTag(null);
                                            router.push('/search');
                                        }}
                                        variant="outline"
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Amazing Stories</h3>
                            <p className="text-gray-600 mb-6">
                                Search for stories, authors, or explore popular topics to find your next great read.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link href="/explore">
                                    <Button>
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Explore Trending
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Latest Stories
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
