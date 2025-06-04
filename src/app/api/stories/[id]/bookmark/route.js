import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// POST /api/stories/[id]/bookmark - Bookmark/unbookmark a story
export async function POST(request, { params }) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { id } = params
        const db = getDB()

        // Check if story exists and is published
        const story = await db
            .select()
            .from(schema.stories)
            .where(and(
                eq(schema.stories.id, id),
                eq(schema.stories.isPublished, true)
            ))
            .limit(1)

        if (!story.length) {
            return NextResponse.json(
                { error: 'Story not found' },
                { status: 404 }
            )
        }

        // Check if user already bookmarked this story
        const existingBookmark = await db
            .select()
            .from(schema.bookmarks)
            .where(and(
                eq(schema.bookmarks.storyId, id),
                eq(schema.bookmarks.userId, session.user.id)
            ))
            .limit(1)

        if (existingBookmark.length > 0) {
            // Remove bookmark
            await db
                .delete(schema.bookmarks)
                .where(and(
                    eq(schema.bookmarks.storyId, id),
                    eq(schema.bookmarks.userId, session.user.id)
                ))

            return NextResponse.json({
                success: true,
                bookmarked: false,
                message: 'Bookmark removed'
            })
        } else {
            // Add bookmark
            await db
                .insert(schema.bookmarks)
                .values({
                    storyId: id,
                    userId: session.user.id,
                    createdAt: new Date()
                })

            return NextResponse.json({
                success: true,
                bookmarked: true,
                message: 'Story bookmarked'
            })
        }
    } catch (error) {
        console.error('Bookmark error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
