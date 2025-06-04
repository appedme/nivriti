'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useNotifications, useNotificationMutation } from '@/hooks/useApi'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const getNotificationIcon = (type) => {
    switch (type) {
        case 'like':
            return <Heart className="w-4 h-4 text-red-500" />
        case 'comment':
            return <MessageCircle className="w-4 h-4 text-blue-500" />
        case 'follow':
            return <UserPlus className="w-4 h-4 text-green-500" />
        case 'story':
            return <BookOpen className="w-4 h-4 text-purple-500" />
        case 'bookmark':
            return <Star className="w-4 h-4 text-yellow-500" />
        case 'milestone':
            return <Star className="w-4 h-4 text-orange-500" />
        case 'share':
            return <Share2 className="w-4 h-4 text-blue-400" />
        default:
            return <Bell className="w-4 h-4 text-gray-500" />
    }
}

const getNotificationMessage = (notification) => {
    const { type, actor, metadata } = notification;

    switch (type) {
        case 'like':
            return `${actor?.name || 'Someone'} liked your story "${metadata?.storyTitle || 'your story'}"`;
        case 'comment':
            return `${actor?.name || 'Someone'} commented on "${metadata?.storyTitle || 'your story'}"`;
        case 'follow':
            return `${actor?.name || 'Someone'} started following you`;
        case 'story':
            return `${actor?.name || 'Someone'} published a new story "${metadata?.storyTitle || 'a new story'}"`;
        case 'bookmark':
            return `${actor?.name || 'Someone'} bookmarked your story "${metadata?.storyTitle || 'your story'}"`;
        case 'milestone':
            return `Your story "${metadata?.storyTitle || 'your story'}" reached ${metadata?.milestone || 'a milestone'}!`;
        case 'share':
            return `${actor?.name || 'Someone'} shared your story "${metadata?.storyTitle || 'your story'}"`;
        default:
            return notification.message || 'New notification';
    }
}

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
}

const notificationIcons = {
    like: Heart,
    comment: MessageCircle,
    follow: UserPlus,
    story: BookOpen,
    milestone: Star,
    share: Share2
}

export default function NotificationCenter() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)

    //user
    const user = session?.user || null;

    // API hooks
    const { data: notifications, loading, error, refetch } = useNotifications()
    const { markAsRead, markAllAsRead, deleteNotification, loading: mutationLoading } = useNotificationMutation()

    const unreadCount = 2//notifications?.filter(n => !n.isRead).length || 0

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId)
            await refetch()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark notification as read.",
                variant: "destructive"
            })
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead()
            await refetch()
            toast({
                title: "All notifications marked as read",
                description: "All your notifications have been marked as read.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark all notifications as read.",
                variant: "destructive"
            })
        }
    }

    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId)
            await refetch()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete notification.",
                variant: "destructive"
            })
        }
    }

    const NotificationItem = ({ notification }) => {
        const IconComponent = notificationIcons[notification.type] || Bell

        return (
            <div
                className={`relative p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 ${notification.isRead ? 'border-transparent' : 'border-primary'
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
                    {notifications?.length > 0 ? (
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
                {notifications?.length > 0 && (
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
