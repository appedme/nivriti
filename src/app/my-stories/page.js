'use client';

import { useState } from 'react';
import { Plus, Edit3, Eye, Trash2, Calendar, Clock, Heart, MessageCircle, MoreHorizontal, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

// Mock user stories data
const userStoriesData = {
  published: [
    {
      id: 1,
      title: "Finding Peace in the Morning Light",
      excerpt: "The first rays of sunlight filtered through my bedroom window, painting golden patterns on the wall...",
      publishedAt: "2024-01-15",
      lastEditedAt: "2024-01-15",
      readTime: "3 min read",
      tags: ["mindfulness", "morning", "peace"],
      likes: 142,
      comments: 28,
      views: 856,
      status: "published",
      coverImage: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "The Art of Slow Living",
      excerpt: "In a world that moves at breakneck speed, I've learned to find beauty in taking things slow...",
      publishedAt: "2024-01-10",
      lastEditedAt: "2024-01-12",
      readTime: "5 min read",
      tags: ["lifestyle", "mindfulness", "wellness"],
      likes: 89,
      comments: 15,
      views: 432,
      status: "published",
      coverImage: "/api/placeholder/300/200"
    }
  ],
  drafts: [
    {
      id: 3,
      title: "Untitled Draft",
      excerpt: "Sometimes the most profound moments come in the silence between thoughts...",
      createdAt: "2024-01-18",
      lastEditedAt: "2024-01-18",
      wordCount: 487,
      status: "draft",
      tags: ["reflection", "mindfulness"]
    },
    {
      id: 4,
      title: "Journey to Self-Discovery",
      excerpt: "The path to understanding ourselves is never linear. It winds through valleys of doubt...",
      createdAt: "2024-01-16",
      lastEditedAt: "2024-01-17",
      wordCount: 1234,
      status: "draft",
      tags: ["growth", "healing", "journey"]
    }
  ]
};

export default function MyStoriesPage() {
  const [stories] = useState(userStoriesData);
  const [activeTab, setActiveTab] = useState('published');

  const handleDeleteStory = (storyId) => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      // Delete story logic here
      console.log('Deleting story:', storyId);
    }
  };

  const handleShareStory = (story) => {
    const shareUrl = `${window.location.origin}/story/${story.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Story link copied to clipboard!');
  };

  const StoryActionsMenu = ({ story }) => (
    <div className="relative group">
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/write?edit=${story.id}`} className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
          <Edit3 className="w-4 h-4" />
          <span>Edit</span>
        </Link>
        {story.status === 'published' && (
          <Link href={`/story/${story.id}`} className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>
        )}
        <button
          onClick={() => handleShareStory(story)}
          className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
        >
          <Heart className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button
          onClick={() => handleDeleteStory(story.id)}
          className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors text-left"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stories</h1>
              <p className="text-gray-600">Manage your published stories and drafts</p>
            </div>
            
            <Link href="/write">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Write New Story
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stories.published.length}</p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Edit3 className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stories.drafts.length}</p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stories.published.reduce((total, story) => total + story.likes, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stories.published.reduce((total, story) => total + story.views, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stories Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="published">Published ({stories.published.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({stories.drafts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="space-y-6">
              {stories.published.length > 0 ? (
                <div className="space-y-4">
                  {stories.published.map((story) => (
                    <Card key={story.id} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Link href={`/story/${story.id}`} className="hover:text-blue-600 transition-colors">
                              <h3 className="text-xl font-bold text-gray-900">{story.title}</h3>
                            </Link>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Published
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Published {new Date(story.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{story.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{story.likes} likes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{story.comments} comments</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{story.views} views</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {story.coverImage && (
                          <div className="ml-6 flex-shrink-0">
                            <img 
                              src={story.coverImage} 
                              alt={story.title}
                              className="w-24 h-24 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        )}
                        
                        <StoryActionsMenu story={story} />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No published stories yet</h3>
                  <p className="text-gray-600 mb-6">Share your first story with the world</p>
                  <Link href="/write">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Write Your First Story
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-6">
              {stories.drafts.length > 0 ? (
                <div className="space-y-4">
                  {stories.drafts.map((story) => (
                    <Card key={story.id} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Link href={`/write?edit=${story.id}`} className="hover:text-blue-600 transition-colors">
                              <h3 className="text-xl font-bold text-gray-900">{story.title}</h3>
                            </Link>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Draft
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created {new Date(story.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Edit3 className="w-4 h-4" />
                              <span>Last edited {new Date(story.lastEditedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{story.wordCount} words</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/write?edit=${story.id}`}>
                            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Continue Writing
                            </Button>
                          </Link>
                          <StoryActionsMenu story={story} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <Edit3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts saved</h3>
                  <p className="text-gray-600 mb-6">Start writing and your drafts will appear here</p>
                  <Link href="/write">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Start Writing
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
