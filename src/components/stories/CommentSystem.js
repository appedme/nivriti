'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Heart,
    MessageCircle,
    MoreVertical,
    Reply,
    Flag,
    Edit,
    Trash2,
    Send
} from 'lucide-react'

// Mock reactions data
const reactions = [
    { emoji: '❤️', label: 'Felt this', count: 12 },
    { emoji: '✨', label: 'Beautiful', count: 8 },
    { emoji: '🤗', label: 'Comforting', count: 6 },
    { emoji: '💭', label: 'Thoughtful', count: 4 },
    { emoji: '🌱', label: 'Inspiring', count: 3 }
]

const mockComments = [
    {
        id: '1',
        content: 'This story really resonated with me. Thank you for sharing something so personal and healing.',
        author: {
            name: 'Maya Patel',
            username: 'maya_writes',
            avatar: '/api/placeholder/40/40'
        },
        createdAt: '2 hours ago',
        likeCount: 5,
        isLiked: false,
        replies: [
            {
                id: '1-1',
                content: 'I felt the same way! Stories like this are why I love this community.',
                author: {
                    name: 'Alex River',
                    username: 'alexr',
                    avatar: '/api/placeholder/40/40'
                },
                createdAt: '1 hour ago',
                likeCount: 2,
                isLiked: true
            }
        ]
    },
    {
        id: '2',
        content: 'Beautiful writing. The imagery in the third paragraph gave me chills.',
        author: {
            name: 'Jordan Kim',
            username: 'jordanwrites',
            avatar: '/api/placeholder/40/40'
        },
        createdAt: '4 hours ago',
        likeCount: 8,
        isLiked: true,
        replies: []
    }
]

export default function CommentSystem({ storyId, user }) {
    const [comments, setComments] = useState(mockComments)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        setIsSubmitting(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const comment = {
            id: Date.now().toString(),
            content: newComment,
            author: {
                name: user.name,
                username: user.username,
                avatar: user.avatar
            },
            createdAt: 'just now',
            likeCount: 0,
            isLiked: false,
            replies: []
        }
        
        setComments([comment, ...comments])
        setNewComment('')
        setIsSubmitting(false)
    }

    const handleSubmitReply = async (commentId) => {
        if (!replyContent.trim() || !user) return

        setIsSubmitting(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const reply = {
            id: `${commentId}-${Date.now()}`,
            content: replyContent,
            author: {
                name: user.name,
                username: user.username,
                avatar: user.avatar
            },
            createdAt: 'just now',
            likeCount: 0,
            isLiked: false
        }
        
        setComments(comments.map(comment => 
            comment.id === commentId 
                ? { ...comment, replies: [...comment.replies, reply] }
                : comment
        ))
        
        setReplyContent('')
        setReplyingTo(null)
        setIsSubmitting(false)
    }

    const handleLikeComment = (commentId, isReply = false, parentId = null) => {
        if (!user) return

        if (isReply && parentId) {
            setComments(comments.map(comment => 
                comment.id === parentId
                    ? {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply.id === commentId
                                ? {
                                    ...reply,
                                    isLiked: !reply.isLiked,
                                    likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1
                                }
                                : reply
                        )
                    }
                    : comment
            ))
        } else {
            setComments(comments.map(comment => 
                comment.id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
                    }
                    : comment
            ))
        }
    }

    const CommentItem = ({ comment, isReply = false, parentId = null }) => (
        <div className={`flex space-x-3 ${isReply ? 'ml-12 mt-3' : ''}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                {user?.username === comment.author.username ? (
                                    <>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem>
                                        <Flag className="mr-2 h-4 w-4" />
                                        Report
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => handleLikeComment(comment.id, isReply, parentId)}
                        disabled={!user}
                    >
                        <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {comment.likeCount}
                    </Button>
                    
                    {!isReply && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            disabled={!user}
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                        </Button>
                    )}
                </div>

                {/* Reply form */}
                {!isReply && replyingTo === comment.id && user && (
                    <div className="ml-12 mt-3">
                        <div className="flex space-x-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Write a reply..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="min-h-[60px] text-sm resize-none"
                                />
                                <div className="mt-2 flex justify-end space-x-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                            setReplyingTo(null)
                                            setReplyContent('')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => handleSubmitReply(comment.id)}
                                        disabled={!replyContent.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="h-3 w-3 mr-1" />
                                                Reply
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Replies */}
                {!isReply && comment.replies.length > 0 && (
                    <div className="space-y-3">
                        {comment.replies.map((reply) => (
                            <CommentItem 
                                key={reply.id} 
                                comment={reply} 
                                isReply={true} 
                                parentId={comment.id} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Reactions */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Reactions</h3>
                <div className="flex flex-wrap gap-2">
                    {reactions.map((reaction) => (
                        <Button
                            key={reaction.emoji}
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 space-x-1"
                        >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                        Comments ({comments.length})
                    </h3>
                </div>

                {/* Comment form */}
                {user ? (
                    <Card>
                        <CardContent className="p-4">
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <div className="flex space-x-3">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Share your thoughts about this story..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="min-h-[80px] resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={!newComment.trim() || isSubmitting}
                                        size="sm"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground mb-4">
                                Sign in to join the conversation
                            </p>
                            <Button asChild>
                                <a href="/auth/signin">Sign In</a>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Comments list */}
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>

                {comments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
