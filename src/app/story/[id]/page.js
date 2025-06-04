'use client';

import { useState } from 'react';
import { ArrowLeft, Heart, Bookmark, Share2, MessageCircle, Copy, Twitter, Facebook, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

// Mock story data - replace with API call
const storyData = {
    id: 1,
    title: "Finding Peace in the Morning Light",
    content: `The first rays of sunlight filtered through my bedroom window, painting golden patterns on the wall. I had woken up before my alarm again, but for once, I didn't feel anxious about it.

Instead, I lay there for a moment, listening to the gentle sounds of the morning - birds chirping, a distant car starting, the soft rustle of leaves in the breeze. There was something magical about these quiet moments before the world fully awakens.

I thought about the meditation class I had attended last week. The instructor had said something that stuck with me: "Peace isn't found in the absence of chaos, but in our response to it." At the time, it felt like just another wellness cliché. But lying there in the morning light, I began to understand.

Yesterday had been challenging. Work deadlines, family obligations, the usual stress of modern life. But here, in this moment, none of that seemed to matter. The sunlight didn't care about my to-do list. The birds didn't sing any softer because I had bills to pay.

I got up slowly, made myself a cup of tea, and sat by the window. For the first time in months, I wasn't thinking about what I needed to do next. I was just... present.

Sometimes the most profound moments are the simplest ones.`,
    author: {
        name: "Sarah Chen",
        username: "sarahwrites",
        avatar: "/api/placeholder/40/40",
        bio: "Finding stories in everyday moments"
    },
    publishedAt: "2024-01-15",
    readTime: "3 min read",
    tags: ["mindfulness", "morning", "peace", "healing"],
    likes: 142,
    comments: 28,
    isLiked: false,
    isBookmarked: false,
    coverImage: "/api/placeholder/800/400"
};

export default function StoryPage({ params }) {
    const [story, setStory] = useState(storyData);
    const [comment, setComment] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Maya Patel",
            content: "This resonated so deeply with me. Thank you for sharing these beautiful moments.",
            timestamp: "2 hours ago",
            avatar: "/api/placeholder/32/32"
        },
        {
            id: 2,
            author: "Alex Johnson",
            content: "Your writing always reminds me to slow down and appreciate the present.",
            timestamp: "5 hours ago",
            avatar: "/api/placeholder/32/32"
        }
    ]);

    const handleLike = () => {
        setStory(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
        }));
    };

    const handleBookmark = () => {
        setStory(prev => ({
            ...prev,
            isBookmarked: !prev.isBookmarked
        }));
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `"${story.title}" by ${story.author.name} on Nivriti`;

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
        }
        setShowShareMenu(false);
    };

    const handleAddComment = () => {
        if (comment.trim()) {
            const newComment = {
                id: comments.length + 1,
                author: "You",
                content: comment,
                timestamp: "Just now",
                avatar: "/api/placeholder/32/32"
            };
            setComments([newComment, ...comments]);
            setComment('');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Back Navigation */}
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Stories
                    </Link>

                    {/* Story Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {story.title}
                        </h1>

                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                            <div className="flex items-center space-x-4">
                                <Link href={`/profile/${story.author.username}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                    <img
                                        src={story.author.avatar}
                                        alt={story.author.name}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{story.author.name}</p>
                                        <p className="text-sm text-gray-600">@{story.author.username}</p>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                <span>•</span>
                                <span>{story.readTime}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {story.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-white/70 backdrop-blur-sm text-gray-700 rounded-full text-sm border border-gray-200 hover:bg-white/90 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Story Content */}
                    <Card className="p-8 md:p-12 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        {story.coverImage && (
                            <img
                                src={story.coverImage}
                                alt={story.title}
                                className="w-full h-64 md:h-80 object-cover rounded-lg mb-8 shadow-lg"
                            />
                        )}

                        <div className="story-content prose prose-lg max-w-none">
                            {story.content.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </Card>

                    {/* Story Actions */}
                    <div className="flex items-center justify-between mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <div className="flex items-center space-x-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLike}
                                className={`flex items-center space-x-2 ${story.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}
                            >
                                <Heart className={`w-5 h-5 ${story.isLiked ? 'fill-current' : ''}`} />
                                <span>{story.likes}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBookmark}
                                className={`flex items-center space-x-2 ${story.isBookmarked ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                            >
                                <Bookmark className={`w-5 h-5 ${story.isBookmarked ? 'fill-current' : ''}`} />
                                <span>Save</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>{story.comments}</span>
                            </Button>
                        </div>

                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                            </Button>

                            {showShareMenu && (
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <Twitter className="w-4 h-4 text-blue-500" />
                                        <span>Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <Facebook className="w-4 h-4 text-blue-700" />
                                        <span>Facebook</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-gray-600" />
                                        <span>Copy Link</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>

                        {/* Add Comment */}
                        <div className="mb-8">
                            <Textarea
                                placeholder="Share your thoughts about this story..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mb-4 min-h-[100px] bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                            />
                            <Button
                                onClick={handleAddComment}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                Add Comment
                            </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-4">
                                    <img
                                        src={comment.avatar}
                                        alt={comment.author}
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-semibold text-gray-900">{comment.author}</span>
                                                <span className="text-sm text-gray-600">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-gray-800">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Related Stories */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">More from {story.author.name}</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Mock related stories */}
                            {[1, 2].map((i) => (
                                <Card key={i} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                    <h4 className="font-bold text-lg text-gray-900 mb-2">The Art of Slow Living</h4>
                                    <p className="text-gray-600 text-sm mb-4">In a world that moves at breakneck speed, I've learned to find beauty in taking things slow...</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Jan 10, 2024</span>
                                        <span>2 min read</span>
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
