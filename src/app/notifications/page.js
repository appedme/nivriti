'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Heart, MessageCircle, UserPlus, BookOpen, Star, CheckCircle, Trash2, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useNotifications, useNotificationMutation } from '@/hooks/useApi';
import Link from 'next/link';

const getNotificationIcon = (type) => {
    switch (type) {
        case 'like':
            return <Heart className="w-4 h-4 text-red-500" />;
        case 'comment':
            return <MessageCircle className="w-4 h-4 text-blue-500" />;
        case 'follow':
            return <UserPlus className="w-4 h-4 text-green-500" />;
        case 'story':
            return <BookOpen className="w-4 h-4 text-purple-500" />;
        case 'bookmark':
            return <Star className="w-4 h-4 text-yellow-500" />;
        default:
            return <Bell className="w-4 h-4 text-gray-500" />;
    }
};

const getNotificationMessage = (notification) => {
    const { type, actor, metadata } = notification;

    switch (type) {
        case 'like':
            return `${actor.name} liked your story "${metadata?.storyTitle || 'your story'}"`;
        case 'comment':
            return `${actor.name} commented on your story "${metadata?.storyTitle || 'your story'}"`;
        case 'follow':
            return `${actor.name} started following you`;
        case 'story':
            return `${actor.name} published a new story "${metadata?.storyTitle || 'a new story'}"`;
        case 'bookmark':
            return `${actor.name} bookmarked your story "${metadata?.storyTitle || 'your story'}"`;
        default:
            return notification.message || 'New notification';
    }
};

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
};

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();

    const { data: notifications, loading, error, refetch } = useNotifications();
    const { markAsRead, markAllAsRead, deleteNotification, loading: mutationLoading } = useNotificationMutation();

    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        if (status === 'unauthenticated') {
            // Redirect to sign in or show message
        }
    }, [status]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            await refetch();
            toast({
                title: "Marked as read",
                description: "Notification has been marked as read.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark notification as read.",
                variant: "destructive"
            });
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            await refetch();
            toast({
                title: "All notifications marked as read",
                description: "All your notifications have been marked as read.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark all notifications as read.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            await refetch();
            toast({
                title: "Notification deleted",
                description: "The notification has been deleted.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete notification.",
                variant: "destructive"
            });
        }
    };

    if (status === 'loading' || loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="flex items-center justify-between mb-8">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <div className="flex items-start space-x-4">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <Card className="p-8 text-center">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view notifications</h1>
                            <p className="text-gray-600 mb-6">You need to be signed in to see your notifications.</p>
                            <Link href="/auth/signin">
                                <Button>Sign In</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    const filteredNotifications = notifications?.filter(notification => {
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'read') return notification.isRead;
        return true;
    }) || [];

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-sm">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handleMarkAllAsRead}
                                    disabled={mutationLoading}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    {mutationLoading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Mark all as read
                                </Button>
                            )}

                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex space-x-1 mb-6 bg-white/60 backdrop-blur-sm rounded-lg p-1 w-fit">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'unread', label: 'Unread' },
                            { key: 'read', label: 'Read' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === key
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {label}
                                {key === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    {error ? (
                        <Card className="p-8 text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load notifications</h2>
                            <p className="text-gray-600 mb-4">There was an error loading your notifications.</p>
                            <Button onClick={refetch}>Try Again</Button>
                        </Card>
                    ) : filteredNotifications.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {filter === 'unread' ? 'No unread notifications' :
                                    filter === 'read' ? 'No read notifications' : 'No notifications yet'}
                            </h2>
                            <p className="text-gray-600">
                                {filter === 'all'
                                    ? "When you get notifications, they'll appear here."
                                    : `You don't have any ${filter} notifications.`}
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {filteredNotifications.map((notification, index) => (
                                <div key={notification.id}>
                                    <Card
                                        className={`p-4 transition-all hover:shadow-lg cursor-pointer ${notification.isRead
                                                ? 'bg-white/60 backdrop-blur-sm border-0 shadow-md'
                                                : 'bg-white/80 backdrop-blur-sm border-0 shadow-lg border-l-4 border-l-blue-500'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                {/* Notification Icon */}
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Actor Avatar */}
                                                <Avatar className="w-10 h-10 flex-shrink-0">
                                                    <AvatarImage src={notification.actor?.image} />
                                                    <AvatarFallback>
                                                        {notification.actor?.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* Notification Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-900 text-sm leading-relaxed">
                                                        {getNotificationMessage(notification)}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-2 ml-4">
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification.id);
                                                        }}
                                                        disabled={mutationLoading}
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotification(notification.id);
                                                    }}
                                                    disabled={mutationLoading}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>

                                    {index < filteredNotifications.length - 1 && (
                                        <Separator className="my-2 bg-gray-200/50" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
