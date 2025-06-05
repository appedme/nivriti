import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db/dev'
import { eq, desc, and, like, or } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// GET /api/stories - Fetch stories with pagination and filters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const tag = searchParams.get('tag')
        const author = searchParams.get('author')
        const search = searchParams.get('search')
        const myStories = searchParams.get('myStories') === 'true'
        const status = searchParams.get('status') // published, draft, all
        const offset = (page - 1) * limit

        const db = getDB()
        let session = null
        
        if (myStories) {
            session = await auth()
            if (!session?.user) {
                return new Response("Unauthorized", { status: 401 })
            }
        }

        let query = db
            .select({
                id: schema.stories.id,
                title: schema.stories.title,
                excerpt: schema.stories.excerpt,
                content: schema.stories.content,
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
            })
            .from(schema.stories)
            .leftJoin(schema.users, eq(schema.stories.authorId, schema.users.id))
            .orderBy(desc(schema.stories.createdAt))
            .limit(limit)
            .offset(offset)

        // Apply filters
        const conditions = []
        
        if (myStories && session?.user) {
            conditions.push(eq(schema.stories.authorId, session.user.id))
        } else if (!myStories) {
            // Only show published stories for public feeds
            conditions.push(eq(schema.stories.isPublished, true))
        }
        
        // Filter by status if specified
        if (status && myStories) {
            if (status === 'published') {
                conditions.push(eq(schema.stories.isPublished, true))
            } else if (status === 'draft') {
                conditions.push(eq(schema.stories.isPublished, false))
            }
        }

        if (tag) {
            conditions.push(like(schema.stories.tags, `%${tag}%`))
        }

        if (author) {
            conditions.push(eq(schema.users.username, author))
        }

        if (search) {
            conditions.push(
                or(
                    like(schema.stories.title, `%${search}%`),
                    like(schema.stories.content, `%${search}%`),
                    like(schema.users.name, `%${search}%`)
                )
            )
        }

        if (conditions.length > 1) {
            query = query.where(and(...conditions))
        }

        const stories = await query

        // Get total count for pagination
        const totalCount = await db
            .select({ count: schema.stories.id })
            .from(schema.stories)
            .where(eq(schema.stories.isPublished, true))

        return NextResponse.json({
            stories: stories.map(story => ({
                id: story.id,
                title: story.title,
                excerpt: story.excerpt,
                coverImage: story.coverImage,
                tags: story.tags ? story.tags.split(',') : [],
                publishedAt: story.createdAt,
                readTime: story.readTime,
                likes: story.likeCount,
                comments: story.commentCount,
                views: story.viewCount,
                author: {
                    id: story.authorId,
                    name: story.authorName,
                    username: story.authorUsername,
                    avatar: story.authorAvatar
                }
            })),
            pagination: {
                page,
                limit,
                total: totalCount.length,
                totalPages: Math.ceil(totalCount.length / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching stories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stories' },
            { status: 500 }
        )
    }
}

// POST /api/stories - Create a new story
export async function POST(request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            title,
            content,
            excerpt,
            tags,
            coverImage,
            isPublished = false,
            isMultiChapter = false
        } = body

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        // For single stories, content is required
        if (!isMultiChapter && !content) {
            return NextResponse.json(
                { error: 'Content is required for single stories' },
                { status: 400 }
            )
        }

        const db = getDB()

        // Check if user exists in database
        const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, session.user.id))
            .limit(1)

        if (existingUser.length === 0) {
            // Create user if doesn't exist
            console.log('Creating user:', session.user)
            try {
                await db.insert(schema.users).values({
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                    username: session.user.email?.split('@')[0] || `user_${session.user.id.slice(0, 8)}`,
                })
            } catch (userError) {
                console.error('Error creating user:', userError)
                return NextResponse.json(
                    { error: 'Failed to create user account' },
                    { status: 500 }
                )
            }
        }

        // Import editor utilities
        const { calculateReadTime, extractExcerpt } = await import('@/lib/editor')

        // Calculate read time and excerpt for single stories
        let readTime = null
        let storyExcerpt = excerpt

        if (!isMultiChapter && content) {
            readTime = calculateReadTime(content)
            if (!storyExcerpt) {
                storyExcerpt = extractExcerpt(content)
            }
        }

        const newStory = await db.insert(schema.stories).values({
            id: nanoid(), // Ensure you import nanoid
            title,
            content: isMultiChapter ? null : content,
            excerpt: storyExcerpt,
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            coverImage,
            readTime,
            authorId: session.user.id,
            isPublished,
            isMultiChapter,
            chapterCount: 0,
            likeCount: 0,
            commentCount: 0,
            viewCount: 0
        }).returning()

        return NextResponse.json({
            story: newStory[0],
            message: 'Story created successfully'
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating story:', error)
        return NextResponse.json(
            { error: 'Failed to create story' },
            { status: 500 }
        )
    }
}
