import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// GET /api/stories/[id] - Fetch a specific story
export async function GET(request, { params }) {
    try {
        const { id } = params
        const db = getDB()

        const story = await db
            .select({
                id: schema.stories.id,
                title: schema.stories.title,
                content: schema.stories.content,
                excerpt: schema.stories.excerpt,
                coverImage: schema.stories.coverImage,
                tags: schema.stories.tags,
                createdAt: schema.stories.createdAt,
                updatedAt: schema.stories.updatedAt,
                readTime: schema.stories.readTime,
                likeCount: schema.stories.likeCount,
                commentCount: schema.stories.commentCount,
                viewCount: schema.stories.viewCount,
                isPublished: schema.stories.isPublished,
                authorId: schema.stories.authorId,
                authorName: schema.users.name,
                authorUsername: schema.users.username,
                authorAvatar: schema.users.image,
                authorBio: schema.users.bio,
            })
            .from(schema.stories)
            .leftJoin(schema.users, eq(schema.stories.authorId, schema.users.id))
            .where(eq(schema.stories.id, id))
            .limit(1)

        if (!story.length) {
            return NextResponse.json(
                { error: 'Story not found' },
                { status: 404 }
            )
        }

        const storyData = story[0]

        // Check if story is published or user is the author
        const session = await auth()
        if (!storyData.isPublished && storyData.authorId !== session?.user?.id) {
            return NextResponse.json(
                { error: 'Story not found' },
                { status: 404 }
            )
        }

        // Increment view count if story is published
        if (storyData.isPublished) {
            await db
                .update(schema.stories)
                .set({ viewCount: storyData.viewCount + 1 })
                .where(eq(schema.stories.id, id))
        }

        return NextResponse.json({
            story: {
                id: storyData.id,
                title: storyData.title,
                content: storyData.content,
                excerpt: storyData.excerpt,
                coverImage: storyData.coverImage,
                tags: storyData.tags ? storyData.tags.split(',') : [],
                publishedAt: storyData.createdAt,
                updatedAt: storyData.updatedAt,
                readTime: storyData.readTime,
                likes: storyData.likeCount,
                comments: storyData.commentCount,
                views: storyData.viewCount + 1,
                isPublished: storyData.isPublished,
                author: {
                    id: storyData.authorId,
                    name: storyData.authorName,
                    username: storyData.authorUsername,
                    avatar: storyData.authorAvatar,
                    bio: storyData.authorBio
                }
            }
        })
    } catch (error) {
        console.error('Error fetching story:', error)
        return NextResponse.json(
            { error: 'Failed to fetch story' },
            { status: 500 }
        )
    }
}

// PUT /api/stories/[id] - Update a story
export async function PUT(request, { params }) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { id } = params
        const body = await request.json()
        const { title, content, excerpt, tags, coverImage, isPublished } = body

        const db = getDB()

        // Check if user owns the story
        const existingStory = await db
            .select()
            .from(schema.stories)
            .where(and(
                eq(schema.stories.id, id),
                eq(schema.stories.authorId, session.user.id)
            ))
            .limit(1)

        if (!existingStory.length) {
            return NextResponse.json(
                { error: 'Story not found or unauthorized' },
                { status: 404 }
            )
        }

        // Calculate read time if content changed
        let readTime = existingStory[0].readTime
        if (content && content !== existingStory[0].content) {
            const wordCount = content.split(/\s+/).length
            readTime = Math.ceil(wordCount / 200)
        }

        const updatedStory = await db
            .update(schema.stories)
            .set({
                ...(title && { title }),
                ...(content && { content }),
                ...(excerpt && { excerpt }),
                ...(tags && { tags: Array.isArray(tags) ? tags.join(',') : tags }),
                ...(coverImage && { coverImage }),
                ...(typeof isPublished === 'boolean' && { isPublished }),
                ...(content && { readTime }),
                updatedAt: new Date()
            })
            .where(eq(schema.stories.id, id))
            .returning()

        return NextResponse.json({
            story: updatedStory[0],
            message: 'Story updated successfully'
        })

    } catch (error) {
        console.error('Error updating story:', error)
        return NextResponse.json(
            { error: 'Failed to update story' },
            { status: 500 }
        )
    }
}

// DELETE /api/stories/[id] - Delete a story
export async function DELETE(request, { params }) {
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

        // Check if user owns the story
        const existingStory = await db
            .select()
            .from(schema.stories)
            .where(and(
                eq(schema.stories.id, id),
                eq(schema.stories.authorId, session.user.id)
            ))
            .limit(1)

        if (!existingStory.length) {
            return NextResponse.json(
                { error: 'Story not found or unauthorized' },
                { status: 404 }
            )
        }

        await db
            .delete(schema.stories)
            .where(eq(schema.stories.id, id))

        return NextResponse.json({
            message: 'Story deleted successfully'
        })

    } catch (error) {
        console.error('Error deleting story:', error)
        return NextResponse.json(
            { error: 'Failed to delete story' },
            { status: 500 }
        )
    }
}
