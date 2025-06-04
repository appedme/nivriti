'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    BookOpen,
    Star,
    Share2,
    CheckCircle,
    Settings,
    MoreHorizontal
} from 'lucide-react'

const mockNotifications = [
    {
        id: '1',
        type: 'like',
        title: 'Sarah liked your story',
        message: '"The Art of Letting Go" received a new like',
        actor: {
            name: 'Sarah Chen',
            username: 'sarah_chen',
            avatar: '/api/placeholder/40/40'
        },
        createdAt: '2 minutes ago',
        isRead: false,
        actionUrl: '/story/art-of-letting-go',
        metadata: {
            storyTitle: 'The Art of Letting Go'
        }
    },
    {
        id: '2',
        type: 'comment',
        title: 'New comment on your story',
        message: 'Alex commented: "This really resonated with me. Thank you for sharing..."',
        actor: {
            name: 'Alex River',
            username: 'alexr',
            avatar: '/api/placeholder/40/40'
        },
        createdAt: '1 hour ago',
        isRead: false,
        actionUrl: '/story/midnight-thoughts#comments',
        metadata: {
            storyTitle: 'Midnight Thoughts',
            commentPreview: 'This really resonated with me. Thank you for sharing...'
        }
    },
    {
        id: '3',
        type: 'follow',
        title: 'Maya started following you',
        message: 'Maya Patel is now following your stories',
        actor: {
            name: 'Maya Patel',
            username: 'maya_writes',
            avatar: '/api/placeholder/40/40'
        },
        createdAt: '3 hours ago',
        isRead: true,
        actionUrl: '/profile/maya_writes'
    },
    {
        id: '4',
        type: 'story',
        title: 'Featured story',
        message: '"Daily Rituals" was featured in today\'s curated collection',
        createdAt: '1 day ago',
        isRead: true,
        actionUrl: '/story/daily-rituals',
        metadata: {
            storyTitle: 'Daily Rituals',
            collection: 'Mindful Living'
        }
    },
    {
        id: '5',
        type: 'milestone',
        title: 'Story milestone reached',
        message: '"The Art of Letting Go" reached 100 likes!',
        createdAt: '2 days ago',
        isRead: true,
        actionUrl: '/story/art-of-letting-go',
        metadata: {
            storyTitle: 'The Art of Letting Go',
            milestone: '100 likes'
        }
    }
]

const notificationIcons = {
    like: Heart,
    comment: MessageCircle,
    follow: UserPlus,
    story: BookOpen,
    milestone: Star,
    share: Share2
}

export default function NotificationCenter({ user }) {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [isOpen, setIsOpen] = useState(false)

    const unreadCount = notifications.filter(n => !n.isRead).length

    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, isRead: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, isRead: true }))
        )
    }

    const deleteNotification = (notificationId) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== notificationId)
        )
    }

    const NotificationItem = ({ notification }) => {
        const IconComponent = notificationIcons[notification.type] || Bell
        
        return (
            <div 
                className={`relative p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 ${
                    notification.isRead ? 'border-transparent' : 'border-primary'
                }`}
                onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                    }
                }}
            >
                <div className="flex items-start space-x-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                        {notification.actor ? (
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                                <AvatarFallback>{notification.actor.name[0]}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                                    {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {notification.createdAt}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        {!notification.isRead && (
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                markAsRead(notification.id)
                                            }}>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Mark as read
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteNotification(notification.id)
                                            }}
                                            className="text-destructive"
                                        >
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Metadata badges */}
                        {notification.metadata && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {notification.metadata.storyTitle && (
                                    <Badge variant="secondary" className="text-xs">
                                        {notification.metadata.storyTitle}
                                    </Badge>
                                )}
                                {notification.metadata.collection && (
                                    <Badge variant="outline" className="text-xs">
                                        {notification.metadata.collection}
                                    </Badge>
                                )}
                                {notification.metadata.milestone && (
                                    <Badge variant="default" className="text-xs">
                                        {notification.metadata.milestone}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
                )}
            </div>
        )
    }

    if (!user) return null

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-80 p-0">
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs h-6"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Settings className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="max-h-96">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">
                                No notifications yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                When you get likes, comments, or followers, they&apos;ll appear here
                            </p>
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t">
                        <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
