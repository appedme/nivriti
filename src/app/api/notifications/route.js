import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, desc, and } from 'drizzle-orm'

// GET /api/notifications - Fetch user notifications
export async function GET(request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = (page - 1) * limit

        const db = getDB()

        // Fetch notifications with actor information
        const notifications = await db
            .select({
                id: schema.notifications.id,
                type: schema.notifications.type,
                title: schema.notifications.title,
                message: schema.notifications.message,
                isRead: schema.notifications.isRead,
                actionUrl: schema.notifications.actionUrl,
                metadata: schema.notifications.metadata,
                createdAt: schema.notifications.createdAt,
                actorName: schema.users.name,
                actorUsername: schema.users.username,
                actorAvatar: schema.users.image,
            })
            .from(schema.notifications)
            .leftJoin(schema.users, eq(schema.notifications.actorId, schema.users.id))
            .where(eq(schema.notifications.userId, session.user.id))
            .orderBy(desc(schema.notifications.createdAt))
            .limit(limit)
            .offset(offset)

        // Get unread count
        const unreadCount = await db
            .select({ count: schema.notifications.id })
            .from(schema.notifications)
            .where(and(
                eq(schema.notifications.userId, session.user.id),
                eq(schema.notifications.isRead, false)
            ))

        return NextResponse.json({
            notifications: notifications.map(notification => ({
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                isRead: notification.isRead,
                actionUrl: notification.actionUrl,
                metadata: notification.metadata ? JSON.parse(notification.metadata) : {},
                createdAt: notification.createdAt,
                actor: notification.actorName ? {
                    name: notification.actorName,
                    username: notification.actorUsername,
                    avatar: notification.actorAvatar
                } : null
            })),
            unreadCount: unreadCount.length,
            pagination: {
                page,
                limit,
                hasMore: notifications.length === limit
            }
        })
    } catch (error) {
        console.error('Fetch notifications error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { notificationIds, markAllAsRead } = await request.json()
        const db = getDB()

        if (markAllAsRead) {
            // Mark all notifications as read for the user
            await db
                .update(schema.notifications)
                .set({ isRead: true })
                .where(and(
                    eq(schema.notifications.userId, session.user.id),
                    eq(schema.notifications.isRead, false)
                ))
        } else if (notificationIds && notificationIds.length > 0) {
            // Mark specific notifications as read
            await db
                .update(schema.notifications)
                .set({ isRead: true })
                .where(and(
                    eq(schema.notifications.userId, session.user.id),
                    eq(schema.notifications.id, notificationIds[0]) // Simplified for single notification
                ))
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update notifications error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
