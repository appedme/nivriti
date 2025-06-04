import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, desc, and } from 'drizzle-orm'

// GET /api/stories/[id]/comments - Fetch comments for a story
export async function GET(request, { params }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = getDB()

    const comments = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        createdAt: schema.comments.createdAt,
        updatedAt: schema.comments.updatedAt,
        parentId: schema.comments.parentId,
        likeCount: schema.comments.likeCount,
        authorId: schema.comments.authorId,
        authorName: schema.users.name,
        authorUsername: schema.users.username,
        authorAvatar: schema.users.image,
      })
      .from(schema.comments)
      .leftJoin(schema.users, eq(schema.comments.authorId, schema.users.id))
      .where(eq(schema.comments.storyId, id))
      .orderBy(desc(schema.comments.createdAt))
      .limit(limit)
      .offset(offset)

    // Get user's likes on comments if authenticated
    let userLikes = []
    const session = await auth()
    if (session?.user) {
      const commentIds = comments.map(c => c.id)
      if (commentIds.length > 0) {
        userLikes = await db
          .select({ commentId: schema.commentLikes.commentId })
          .from(schema.commentLikes)
          .where(and(
            eq(schema.commentLikes.userId, session.user.id),
            // TODO: Add proper IN clause when available
          ))
      }
    }

    const userLikedComments = new Set(userLikes.map(l => l.commentId))

    return NextResponse.json({
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentId: comment.parentId,
        likes: comment.likeCount,
        isLiked: userLikedComments.has(comment.id),
        author: {
          id: comment.authorId,
          name: comment.authorName,
          username: comment.authorUsername,
          avatar: comment.authorAvatar
        }
      })),
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/stories/[id]/comments - Create a new comment
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
    const body = await request.json()
    const { content, parentId } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

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

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await db
        .select()
        .from(schema.comments)
        .where(and(
          eq(schema.comments.id, parentId),
          eq(schema.comments.storyId, id)
        ))
        .limit(1)

      if (!parentComment.length) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    const newComment = await db.insert(schema.comments).values({
      content: content.trim(),
      storyId: id,
      authorId: session.user.id,
      parentId: parentId || null,
      likeCount: 0
    }).returning()

    // Increment comment count on story
    await db
      .update(schema.stories)
      .set({ commentCount: story[0].commentCount + 1 })
      .where(eq(schema.stories.id, id))

    // Fetch user details for response
    const user = await db
      .select({
        name: schema.users.name,
        username: schema.users.username,
        image: schema.users.image
      })
      .from(schema.users)
      .where(eq(schema.users.id, session.user.id))
      .limit(1)

    return NextResponse.json({
      comment: {
        id: newComment[0].id,
        content: newComment[0].content,
        createdAt: newComment[0].createdAt,
        parentId: newComment[0].parentId,
        likes: 0,
        isLiked: false,
        author: {
          id: session.user.id,
          name: user[0]?.name,
          username: user[0]?.username,
          avatar: user[0]?.image
        }
      },
      message: 'Comment created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
