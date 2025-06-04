'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Heart, Bookmark, Share2, MessageCircle, Copy, Twitter, Facebook, Link2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { useStory, useComments, useApiMutation } from '@/hooks/useApi';
import Link from 'next/link';

import { use } from 'react';

export default function StoryPage({ params }) {
    const resolvedParams = use(params);
    const { data: session } = useSession();
    const { data: storyData, loading: storyLoading, error: storyError } = useStory(resolvedParams.id);
    const { data: commentsData, loading: commentsLoading, refetch: refetchComments } = useComments(resolvedParams.id);
    const { mutate } = useApiMutation();

    const [comment, setComment] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    // Initialize state when story data is loaded
    useEffect(() => {
        if (storyData?.story) {
            setIsLiked(storyData.story.isLiked || false);
            setIsBookmarked(storyData.story.isBookmarked || false);
            setLikeCount(storyData.story.likes || 0);
            setCommentCount(storyData.story.comments || 0);
        }
    }, [storyData]);

    // Persist state to localStorage for non-authenticated users
    useEffect(() => {
        if (!session && storyData?.story) {
            const storyId = storyData.story.id;
            
            // Get state from localStorage
            const savedState = localStorage.getItem(`story_${storyId}_state`);
            if (savedState) {
                try {
                    const parsedState = JSON.parse(savedState);
                    setIsLiked(parsedState.isLiked || false);
                    setIsBookmarked(parsedState.isBookmarked || false);
                } catch (e) {
                    console.error('Error parsing saved state:', e);
                }
            }
        }
    }, [session, storyData]);

    // Save state to localStorage when it changes
    useEffect(() => {
        if (!session && storyData?.story) {
            const storyId = storyData.story.id;
            const stateToSave = { isLiked, isBookmarked };
            localStorage.setItem(`story_${storyId}_state`, JSON.stringify(stateToSave));
        }
    }, [isLiked, isBookmarked, session, storyData]);

    const story = storyData?.story;
    const comments = commentsData?.comments || [];

    // Parse and render story content (Editor.js JSON format)
    const renderStoryContent = (content) => {
        try {
            if (typeof content === 'string') {
                const parsedContent = JSON.parse(content);
                if (!parsedContent.blocks) {
                    // If not Editor.js format, treat as plain text
                    return content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                            {paragraph}
                        </p>
                    ));
                }
                
                return parsedContent.blocks.map((block, index) => {
                    if (!block.data) return null;
                    
                    switch (block.type) {
                        case 'header':
                            const HeadingTag = `h${block.data.level}`;
                            return React.createElement(HeadingTag, { 
                                key: index, 
                                className: `text-${4-block.data.level}xl font-bold mb-4` 
                            }, block.data.text);
                        
                        case 'paragraph':
                            return (
                                <p key={index} className="mb-6 text-gray-800 leading-relaxed" 
                                   dangerouslySetInnerHTML={{ __html: block.data.text }} />
                            );
                        
                        case 'list':
                            if (block.data.style === 'ordered') {
                                return (
                                    <ol key={index} className="mb-6 pl-6 list-decimal">
                                        {block.data.items.map((item, i) => (
                                            <li key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ol>
                                );
                            } else {
                                return (
                                    <ul key={index} className="mb-6 pl-6 list-disc">
                                        {block.data.items.map((item, i) => (
                                            <li key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                );
                            }
                        
                        case 'quote':
                            return (
                                <blockquote key={index} className="mb-6 pl-4 border-l-4 border-gray-300 italic">
                                    <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                                    {block.data.caption && <cite className="block mt-2 text-sm text-gray-600">— {block.data.caption}</cite>}
                                </blockquote>
                            );
                        
                        case 'code':
                            return (
                                <pre key={index} className="mb-6 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                                    <code>{block.data.code}</code>
                                </pre>
                            );
                        
                        default:
                            return (
                                <p key={index} className="mb-6 text-gray-800 leading-relaxed" 
                                   dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
                            );
                    }
                });
            }
            
            // Fallback to plain text
            return content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                    {paragraph}
                </p>
            ));
        } catch (e) {
            console.error("Error rendering content:", e);
            // Fallback to plain text
            return content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                    {paragraph}
                </p>
            ));
        }
    };

    // Loading state
    if (storyLoading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="animate-pulse">
                            <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
                            <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
                            <div className="h-64 bg-gray-200 rounded mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Error state
    if (storyError || !story) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h1>
                            <p className="text-gray-600 mb-8">The story you're looking for doesn't exist or has been removed.</p>
                            <Link href="/" className="text-blue-600 hover:text-blue-700">
                                ← Back to Stories
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

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

                        {story.isMultiChapter ? (
                            <div className="text-center space-y-6 py-4">
                                <div className="flex items-center justify-center gap-2 text-gray-700">
                                    <BookOpen className="h-6 w-6" />
                                    <h3 className="text-xl font-medium">Multi-Chapter Book</h3>
                                </div>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    {story.excerpt || "This story is presented as a book with multiple chapters for an immersive reading experience."}
                                </p>
                                <Button 
                                    asChild
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    size="lg"
                                >
                                    <Link href={`/story/${story.id}/read`}>
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        Start Reading
                                    </Link>
                                </Button>
                                <p className="text-sm text-gray-500">{story.chapterCount || 0} chapters • {story.readTime}</p>
                            </div>
                        ) : (
                            <div className="story-content prose prose-lg max-w-none">
                                {renderStoryContent(story.content)}
                            </div>
                        )}
                    </Card>

                    {/* Story Actions */}
                    <div className="flex items-center justify-between mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <div className="flex items-center space-x-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLike}
                                className={`flex items-center space-x-2 ${isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span>{likeCount}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBookmark}
                                className={`flex items-center space-x-2 ${isBookmarked ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                                <span>Save</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>{commentCount}</span>
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
                            {commentsLoading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-4">
                                        <img
                                            src={comment.author?.avatar || comment.authorAvatar || "/api/placeholder/32/32"}
                                            alt={comment.author?.name || comment.authorName || 'User'}
                                            className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="font-semibold text-gray-900">
                                                        {comment.author?.name || comment.authorName || 'Anonymous'}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : comment.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-gray-800">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
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
