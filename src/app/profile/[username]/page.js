'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Calendar, Link as LinkIcon, Twitter, Instagram, Edit3, Users, BookOpen, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import StoryCard from '@/components/stories/StoryCard';
import { useUser, useUserStories, useFollowUser } from '@/hooks/useApi';
import Link from 'next/link';

// Mock user data - replace with API call
const userData = {
    name: "Sarah Chen",
    username: "sarahwrites",
    avatar: "/api/placeholder/120/120",
    bio: "Finding stories in everyday moments. Writer, dreamer, and lover of morning coffee. Sharing tales of mindfulness and gentle living.",
    location: "San Francisco, CA",
    joinedDate: "March 2023",
    website: "https://sarahchen.blog",
    social: {
        twitter: "sarahwrites",
        instagram: "sarahchen.stories"
    },
    stats: {
        stories: 24,
        followers: 1542,
        following: 89,
        likes: 3847
    },
    isOwnProfile: false, // Set to true if viewing own profile
    isFollowing: false
};

const userStories = [
    {
        id: 1,
        title: "Finding Peace in the Morning Light",
        excerpt: "The first rays of sunlight filtered through my bedroom window, painting golden patterns on the wall...",
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
        publishedAt: "2024-01-10",
        readTime: "5 min read",
        tags: ["lifestyle", "mindfulness", "wellness"],
        likes: 89,
        comments: 15,
        coverImage: "/api/placeholder/300/200"
    },
    {
        id: 3,
        title: "Letters to My Younger Self",
        excerpt: "Dear 16-year-old me, I know you're scared about the future, but let me tell you something...",
        publishedAt: "2024-01-05",
        readTime: "4 min read",
        tags: ["reflection", "growth", "healing"],
        likes: 267,
        comments: 45,
        coverImage: "/api/placeholder/300/200"
    }
];

const readingLists = [
    {
        id: 1,
        name: "Healing Stories",
        description: "Stories that touch the soul and promote healing",
        storyCount: 12,
        isPublic: true,
        coverImages: ["/api/placeholder/60/60", "/api/placeholder/60/60", "/api/placeholder/60/60"]
    },
    {
        id: 2,
        name: "Morning Reads",
        description: "Perfect stories to start the day with",
        storyCount: 8,
        isPublic: true,
        coverImages: ["/api/placeholder/60/60", "/api/placeholder/60/60", "/api/placeholder/60/60"]
    },
    {
        id: 3,
        name: "Personal Favorites",
        description: "My all-time favorite stories",
        storyCount: 15,
        isPublic: false,
        coverImages: ["/api/placeholder/60/60", "/api/placeholder/60/60", "/api/placeholder/60/60"]
    }
];

export default function ProfilePage({ params }) {
    const { username } = params;
    const { data: session } = useSession();
    const { toast } = useToast();

    // API hooks
    const { data: user, loading: userLoading, error: userError, refetch: refetchUser } = useUser(username);
    const { data: userStories, loading: storiesLoading } = useUserStories(username);
    const { mutate: followUser, loading: followLoading } = useFollowUser();

    const [activeTab, setActiveTab] = useState('stories');

    // Check if this is the current user's profile
    const isOwnProfile = session?.user?.username === username;

    const handleFollow = async () => {
        if (!session) {
            toast({
                title: "Please sign in",
                description: "You need to be signed in to follow users.",
                variant: "destructive"
            });
            return;
        }

        try {
            await followUser(username);
            await refetchUser(); // Refresh user data to get updated follow status
            toast({
                title: user?.isFollowing ? "Unfollowed" : "Following",
                description: user?.isFollowing
                    ? `You are no longer following ${user.name}`
                    : `You are now following ${user.name}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update follow status. Please try again.",
                variant: "destructive"
            });
        }
    };

    if (userLoading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <Skeleton className="w-32 h-32 rounded-full" />
                                <div className="flex-1 space-y-4">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex space-x-8">
                                        <Skeleton className="h-16 w-24" />
                                        <Skeleton className="h-16 w-24" />
                                        <Skeleton className="h-16 w-24" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    if (userError || !user) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <Card className="p-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
                            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
                            <Link href="/">
                                <Button>Go Home</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar and Basic Info */}
                            <div className="flex-shrink-0">
                                <img
                                    src={user.image || '/api/placeholder/120/120'}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                                        <p className="text-gray-600 text-lg">@{user.username}</p>
                                    </div>

                                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                                        {isOwnProfile ? (
                                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleFollow}
                                                disabled={followLoading}
                                                className={user.isFollowing
                                                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                }
                                            >
                                                {followLoading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : null}
                                                {user.isFollowing ? 'Following' : 'Follow'}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {user.bio && (
                                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{user.bio}</p>
                                )}

                                {/* Profile Meta */}
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                                    {user.location && (
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{user.location}</span>
                                        </div>
                                    )}
                                    {user.createdAt && (
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                    {user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                                            <LinkIcon className="w-4 h-4" />
                                            <span>Website</span>
                                        </a>
                                    )}
                                </div>

                                {/* Social Links */}
                                {(user.twitterHandle || user.instagramHandle) && (
                                    <div className="flex items-center space-x-4 mb-6">
                                        {user.twitterHandle && (
                                            <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {user.instagramHandle && (
                                            <a href={`https://instagram.com/${user.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 mb-1">
                                            <BookOpen className="w-5 h-5" />
                                            <span>{user.stories?.length || 0}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">Stories</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 mb-1">
                                            <Users className="w-5 h-5" />
                                            <span>{user.followerCount || 0}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 mb-1">
                                            <Users className="w-5 h-5" />
                                            <span>{user.followingCount || 0}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">Following</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 mb-1">
                                            <Heart className="w-5 h-5" />
                                            <span>{user.totalLikes || 0}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">Likes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="stories">Stories</TabsTrigger>
                            <TabsTrigger value="lists">Reading Lists</TabsTrigger>
                            <TabsTrigger value="liked">Liked Stories</TabsTrigger>
                        </TabsList>

                        <TabsContent value="stories" className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Published Stories</h2>
                                {isOwnProfile && (
                                    <Link href="/write">
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Write New Story
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {storiesLoading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                            <Skeleton className="h-40 w-full mb-4 rounded" />
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </Card>
                                    ))}
                                </div>
                            ) : userStories && userStories.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userStories.map((story) => (
                                        <StoryCard key={story.id} story={{ ...story, author: user }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    {isOwnProfile ? (
                                        <div>
                                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
                                            <p className="text-gray-600 mb-6">Start sharing your stories with the world!</p>
                                            <Link href="/write">
                                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                                    <Edit3 className="w-4 h-4 mr-2" />
                                                    Write Your First Story
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div>
                                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories published</h3>
                                            <p className="text-gray-600">{user.name} hasn't published any stories yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="lists" className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Reading Lists</h2>
                                {user.isOwnProfile && (
                                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                        Create New List
                                    </Button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {readingLists.map((list) => (
                                    <Card key={list.id} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex -space-x-2">
                                                {list.coverImages.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${list.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {list.isPublic ? 'Public' : 'Private'}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{list.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{list.description}</p>
                                        <p className="text-gray-500 text-sm">{list.storyCount} stories</p>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="liked" className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Liked Stories</h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Mock liked stories - would typically be different from authored stories */}
                                {userStories.slice(0, 2).map((story) => (
                                    <StoryCard key={`liked-${story.id}`} story={{ ...story, author: { name: "Maya Patel", username: "mayawrites", avatar: "/api/placeholder/40/40" } }} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
