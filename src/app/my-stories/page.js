'use client';

import { useState } from 'react';
import { Plus, Edit3, Eye, Trash2, Calendar, Clock, Heart, MessageCircle, MoreHorizontal, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { usePublishedStories, useDraftStories } from '@/hooks/useStories';
import { format } from 'date-fns';

export default function MyStoriesPage() {
  const [activeTab, setActiveTab] = useState('published');
  
  // Using SWR to fetch data
  const { stories: publishedStories, isLoading: publishedLoading, mutate: mutatePublished } = usePublishedStories({ limit: 20 });
  const { stories: draftStories, isLoading: draftLoading, mutate: mutateDrafts } = useDraftStories({ limit: 20 });

  const handleDeleteStory = async (storyId) => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Revalidate the data
          mutatePublished();
          mutateDrafts();
        } else {
          console.error('Failed to delete story');
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
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
        {story.isPublished && (
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

  // Loading skeletons
  const renderSkeletons = (count = 3) => (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
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
                  <p className="text-2xl font-bold text-gray-900">{publishedLoading ? '–' : publishedStories.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{draftLoading ? '–' : draftStories.length}</p>
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
                    {publishedLoading ? '–' : publishedStories.reduce((total, story) => total + (story.likes || 0), 0)}
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
                    {publishedLoading ? '–' : publishedStories.reduce((total, story) => total + (story.views || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="published" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-white/20">
              <TabsTrigger value="published">Published Stories</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            {/* Published Stories Tab */}
            <TabsContent value="published" className="mt-6">
              {publishedLoading ? (
                renderSkeletons(3)
              ) : publishedStories.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No published stories yet</h3>
                  <p className="text-gray-500 mb-6">Share your thoughts and stories with the world</p>
                  <Link href="/write">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Write Your First Story
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedStories.map((story) => (
                    <Card key={story.id} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <Link href={`/story/${story.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">{story.title}</h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>
                          
                          <div className="flex items-center flex-wrap gap-2 mb-4">
                            {story.tags?.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{format(new Date(story.publishedAt || story.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{story.readTime}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              <span>{story.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span>{story.comments}</span>
                            </div>
                          </div>
                        </div>
                        
                        <StoryActionsMenu story={story} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Drafts Tab */}
            <TabsContent value="drafts" className="mt-6">
              {draftLoading ? (
                renderSkeletons(2)
              ) : draftStories.length === 0 ? (
                <div className="text-center py-12">
                  <Edit3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No drafts yet</h3>
                  <p className="text-gray-500 mb-6">Start writing and save your ideas as drafts</p>
                  <Link href="/write">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Writing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftStories.map((story) => (
                    <Card key={story.id} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <Link href={`/write?edit=${story.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                              {story.title || "Untitled Draft"}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt || "No excerpt available..."}</p>
                          
                          <div className="flex items-center flex-wrap gap-2 mb-4">
                            {story.tags?.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center">
                              <Edit3 className="w-4 h-4 mr-1" />
                              <span>Last edited: {format(new Date(story.updatedAt || story.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <StoryActionsMenu story={story} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
