import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db/dev'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// GET /api/stories/[id] - Fetch a specific story
export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const { searchParams } = new URL(request.url)
        const includeChapters = searchParams.get('includeChapters') === 'true'
        
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
                isMultiChapter: schema.stories.isMultiChapter,
                chapterCount: schema.stories.chapterCount,
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

        // Get chapters if requested and if it's a multi-chapter story
        let chapters = []
        if (includeChapters && storyData.isMultiChapter) {
            chapters = await db
                .select()
                .from(schema.chapters)
                .where(eq(schema.chapters.storyId, id))
                .orderBy(schema.chapters.orderIndex)
                
            // Filter out unpublished chapters if user is not the author
            if (!session?.user || storyData.authorId !== session.user.id) {
                chapters = chapters.filter(chapter => chapter.isPublished)
            }
        }

        // Get user's like/bookmark status if authenticated
        let isLiked = false
        let isBookmarked = false
        
        if (session?.user) {
            // Check if user liked this story
            const userLike = await db
                .select()
                .from(schema.likes)
                .where(and(
                    eq(schema.likes.storyId, id),
                    eq(schema.likes.userId, session.user.id)
                ))
                .limit(1)
            
            isLiked = userLike.length > 0

            // Check if user bookmarked this story
            const userBookmark = await db
                .select()
                .from(schema.bookmarks)
                .where(and(
                    eq(schema.bookmarks.storyId, id),
                    eq(schema.bookmarks.userId, session.user.id)
                ))
                .limit(1)
            
            isBookmarked = userBookmark.length > 0
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
                views: storyData.viewCount + (storyData.isPublished ? 1 : 0),
                isPublished: storyData.isPublished,
                isMultiChapter: storyData.isMultiChapter,
                chapterCount: storyData.chapterCount,
                isLiked,
                isBookmarked,
                author: {
                    id: storyData.authorId,
                    name: storyData.authorName,
                    username: storyData.authorUsername,
                    avatar: storyData.authorAvatar,
                    bio: storyData.authorBio
                },
                ...(includeChapters && storyData.isMultiChapter && { chapters })
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
        const { title, content, excerpt, tags, coverImage, isPublished, isMultiChapter } = body

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

        // Import editor utilities
        const { calculateReadTime, extractExcerpt } = await import('@/lib/editor')

        // Calculate read time if content changed for single stories
        let readTime = existingStory[0].readTime
        let storyExcerpt = excerpt || existingStory[0].excerpt

        if (!existingStory[0].isMultiChapter && content && content !== existingStory[0].content) {
            readTime = calculateReadTime(content)
            if (!excerpt) {
                storyExcerpt = extractExcerpt(content)
            }
        }
        
        // Handle multi-chapter conversion
        if (typeof isMultiChapter === 'boolean' && isMultiChapter !== existingStory[0].isMultiChapter) {
            // Converting to multi-chapter
            if (isMultiChapter && existingStory[0].content) {
                // Create a first chapter from existing content
                const existingContent = existingStory[0].content
                const chapterReadTime = calculateReadTime(existingContent)
                
                await db
                    .insert(schema.chapters)
                    .values({
                        id: nanoid(),
                        title: 'Chapter 1',
                        content: existingContent,
                        orderIndex: 0,
                        storyId: id,
                        isPublished: existingStory[0].isPublished,
                        readTime: chapterReadTime,
                        viewCount: 0
                    })
                
                // Update chapter count
                await db
                    .update(schema.stories)
                    .set({
                        chapterCount: 1,
                        content: null  // Clear content from main story
                    })
                    .where(eq(schema.stories.id, id))
            }
            // Converting from multi-chapter to single, handled by frontend
            // as it requires choosing which chapter to use
        }

        const updatedStory = await db
            .update(schema.stories)
            .set({
                ...(title && { title }),
                ...(content && !isMultiChapter && { content }),
                ...(storyExcerpt && { excerpt: storyExcerpt }),
                ...(tags && { tags: Array.isArray(tags) ? tags.join(',') : tags }),
                ...(coverImage && { coverImage }),
                ...(typeof isPublished === 'boolean' && { isPublished }),
                ...(typeof isMultiChapter === 'boolean' && { isMultiChapter }),
                ...(readTime && !isMultiChapter && { readTime }),
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
