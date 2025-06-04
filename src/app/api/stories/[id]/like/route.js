import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// POST /api/stories/[id]/like - Like/unlike a story
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

        // Check if user already liked this story
        const existingLike = await db
            .select()
            .from(schema.likes)
            .where(and(
                eq(schema.likes.storyId, id),
                eq(schema.likes.userId, session.user.id)
            ))
            .limit(1)

        if (existingLike.length > 0) {
            // Unlike the story
            await db
                .delete(schema.likes)
                .where(and(
                    eq(schema.likes.storyId, id),
                    eq(schema.likes.userId, session.user.id)
                ))

            // Decrement like count
            await db
                .update(schema.stories)
                .set({ likeCount: story[0].likeCount - 1 })
                .where(eq(schema.stories.id, id))

            return NextResponse.json({
                liked: false,
                likeCount: story[0].likeCount - 1,
                message: 'Story unliked'
            })
        } else {
            // Like the story
            await db.insert(schema.likes).values({
                storyId: id,
                userId: session.user.id
            })

            // Increment like count
            await db
                .update(schema.stories)
                .set({ likeCount: story[0].likeCount + 1 })
                .where(eq(schema.stories.id, id))

            return NextResponse.json({
                liked: true,
                likeCount: story[0].likeCount + 1,
                message: 'Story liked'
            })
        }

    } catch (error) {
        console.error('Error toggling like:', error)
        return NextResponse.json(
            { error: 'Failed to process like' },
            { status: 500 }
        )
    }
}
