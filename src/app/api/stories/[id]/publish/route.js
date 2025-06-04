import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// POST /api/stories/[id]/publish - Publish/unpublish a story and optionally all its chapters
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
    const { publish = true, publishChapters = true } = body

    const db = getDB()

    // Check if user owns the story
    const story = await db
      .select()
      .from(schema.stories)
      .where(and(
        eq(schema.stories.id, id),
        eq(schema.stories.authorId, session.user.id)
      ))
      .limit(1)

    if (!story.length) {
      return NextResponse.json(
        { error: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    const storyData = story[0]
    
    // For multi-chapter stories, ensure there are chapters before publishing
    if (publish && storyData.isMultiChapter && storyData.chapterCount === 0) {
      return NextResponse.json(
        { error: 'Cannot publish a multi-chapter story with no chapters' },
        { status: 400 }
      )
    }

    // Update story published status
    await db
      .update(schema.stories)
      .set({ isPublished: publish })
      .where(eq(schema.stories.id, id))

    // For multi-chapter stories, also update all chapters if requested
    if (storyData.isMultiChapter && publishChapters) {
      await db
        .update(schema.chapters)
        .set({ isPublished: publish })
        .where(eq(schema.chapters.storyId, id))
    }

    return NextResponse.json({
      message: `Story ${publish ? 'published' : 'unpublished'} successfully`,
      storyId: id,
      isPublished: publish
    })

  } catch (error) {
    console.error('Error publishing story:', error)
    return NextResponse.json(
      { error: 'Failed to update publication status' },
      { status: 500 }
    )
  }
}
