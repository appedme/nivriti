'use client';

import { useState } from 'react';
import { Plus, BookOpen, Lock, Globe, Heart, Share2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/layout/Layout';
import StoryCard from '@/components/stories/StoryCard';
import Link from 'next/link';

// Mock reading lists data
const readingListsData = [
  {
    id: 1,
    name: "Healing Stories",
    description: "Stories that touch the soul and promote healing. A collection of narratives about overcoming challenges and finding peace.",
    storyCount: 12,
    isPublic: true,
    createdAt: "2024-01-15",
    coverImages: ["/api/placeholder/80/80", "/api/placeholder/80/80", "/api/placeholder/80/80"],
    stories: [
      {
        id: 1,
        title: "Finding Peace in the Morning Light",
        excerpt: "The first rays of sunlight filtered through my bedroom window...",
        author: { name: "Sarah Chen", username: "sarahwrites", avatar: "/api/placeholder/40/40" },
        publishedAt: "2024-01-15",
        readTime: "3 min read",
        tags: ["mindfulness", "morning", "peace"],
        likes: 142,
        comments: 28,
        coverImage: "/api/placeholder/300/200"
      },
      {
        id: 2,
        title: "The Art of Letting Go",
        excerpt: "Sometimes the hardest thing is knowing when to release what no longer serves us...",
        author: { name: "Maya Patel", username: "mayawrites", avatar: "/api/placeholder/40/40" },
        publishedAt: "2024-01-12",
        readTime: "4 min read",
        tags: ["healing", "growth", "mindfulness"],
        likes: 98,
        comments: 23,
        coverImage: "/api/placeholder/300/200"
      }
    ]
  },
  {
    id: 2,
    name: "Morning Reads",
    description: "Perfect stories to start the day with positivity and mindfulness.",
    storyCount: 8,
    isPublic: true,
    createdAt: "2024-01-10",
    coverImages: ["/api/placeholder/80/80", "/api/placeholder/80/80", "/api/placeholder/80/80"],
    stories: []
  },
  {
    id: 3,
    name: "Personal Favorites",
    description: "My all-time favorite stories that I return to again and again.",
    storyCount: 15,
    isPublic: false,
    createdAt: "2024-01-05",
    coverImages: ["/api/placeholder/80/80", "/api/placeholder/80/80", "/api/placeholder/80/80"],
    stories: []
  }
];

export default function ReadingListsPage() {
  const [readingLists, setReadingLists] = useState(readingListsData);
  const [selectedList, setSelectedList] = useState(readingLists[0]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  const handleCreateList = () => {
    if (newList.name.trim()) {
      const newListData = {
        id: readingLists.length + 1,
        ...newList,
        storyCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        coverImages: [],
        stories: []
      };
      setReadingLists([...readingLists, newListData]);
      setNewList({ name: '', description: '', isPublic: true });
      setShowCreateDialog(false);
    }
  };

  const handleDeleteList = (listId) => {
    if (confirm('Are you sure you want to delete this reading list? This action cannot be undone.')) {
      setReadingLists(prev => prev.filter(list => list.id !== listId));
      if (selectedList.id === listId) {
        setSelectedList(readingLists[0]);
      }
    }
  };

  const handleShareList = (list) => {
    const shareUrl = `${window.location.origin}/lists/${list.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('List link copied to clipboard!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reading Lists</h1>
              <p className="text-gray-600">Organize and save your favorite stories in custom collections</p>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New List
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Reading List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">List Name</label>
                    <Input
                      placeholder="e.g., Weekend Reads"
                      value={newList.name}
                      onChange={(e) => setNewList(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <Textarea
                      placeholder="What kind of stories will you collect here?"
                      value={newList.description}
                      onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Make Public</p>
                      <p className="text-sm text-gray-600">Allow others to discover this list</p>
                    </div>
                    <Switch
                      checked={newList.isPublic}
                      onCheckedChange={(value) => setNewList(prev => ({ ...prev, isPublic: value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateList} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Create List
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Reading Lists */}
            <div className="lg:w-80">
              <div className="space-y-4">
                {readingLists.map((list) => (
                  <Card 
                    key={list.id} 
                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedList.id === list.id 
                        ? 'bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg' 
                        : 'bg-white/70 backdrop-blur-sm border-gray-200'
                    }`}
                    onClick={() => setSelectedList(list)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-1">
                          {list.coverImages.slice(0, 3).map((img, index) => (
                            <img 
                              key={index} 
                              src={img} 
                              alt=""
                              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                            />
                          ))}
                          {list.coverImages.length === 0 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {list.isPublic ? (
                            <Globe className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-1">{list.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{list.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{list.storyCount} stories</span>
                      <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content - Selected List */}
            <div className="flex-1">
              {selectedList && (
                <>
                  {/* List Header */}
                  <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-3xl font-bold text-gray-900">{selectedList.name}</h1>
                          <div className="flex items-center space-x-2">
                            {selectedList.isPublic ? (
                              <span className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </span>
                            ) : (
                              <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{selectedList.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {selectedList.storyCount} stories
                          </span>
                          <span>Created {new Date(selectedList.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareList(selectedList)}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteList(selectedList.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Stories in List */}
                  {selectedList.stories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedList.stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
                      <p className="text-gray-600 mb-6">Start building your collection by adding stories you love</p>
                      <Link href="/explore">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          Discover Stories
                        </Button>
                      </Link>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Popular Public Lists */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Public Lists</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((j) => (
                        <img 
                          key={j} 
                          src={`/api/placeholder/40/40`} 
                          alt=""
                          className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>24</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Mindful Mornings</h3>
                  <p className="text-gray-600 text-sm mb-4">Stories to start your day with peace and intention</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src="/api/placeholder/24/24" alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-gray-600">by Maya Patel</span>
                    </div>
                    <span className="text-sm text-gray-500">12 stories</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
