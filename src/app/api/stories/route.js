import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, desc, and, like, or } from 'drizzle-orm'

// GET /api/stories - Fetch stories with pagination and filters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const tag = searchParams.get('tag')
        const author = searchParams.get('author')
        const search = searchParams.get('search')
        const offset = (page - 1) * limit

        const db = getDB()

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
            .where(eq(schema.stories.isPublished, true))
            .orderBy(desc(schema.stories.createdAt))
            .limit(limit)
            .offset(offset)

        // Apply filters
        const conditions = [eq(schema.stories.isPublished, true)]

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
        const { title, content, excerpt, tags, coverImage, isPublished = false } = body

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            )
        }

        const db = getDB()

        // Calculate read time (approximately 200 words per minute)
        const wordCount = content.split(/\s+/).length
        const readTime = Math.ceil(wordCount / 200)

        const newStory = await db.insert(schema.stories).values({
            title,
            content,
            excerpt: excerpt || content.substring(0, 200) + '...',
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            coverImage,
            readTime,
            authorId: session.user.id,
            isPublished,
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
