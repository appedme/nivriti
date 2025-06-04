import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and, not } from 'drizzle-orm'

// POST /api/stories/[id]/chapters/bulk - Bulk update chapters (reordering or publishing)
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
    const { action, chapterIds, isPublished } = body

    if (!['reorder', 'publish'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "reorder" or "publish"' },
        { status: 400 }
      )
    }

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

    // Bulk reorder chapters
    if (action === 'reorder' && Array.isArray(chapterIds)) {
      // Get all chapters for this story
      const storyChapters = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.storyId, id))

      // Validate that all chapterIds belong to this story
      const storyChapterIds = storyChapters.map(chapter => chapter.id)
      const allChaptersExist = chapterIds.every(id => storyChapterIds.includes(id))
      
      if (!allChaptersExist || chapterIds.length !== storyChapters.length) {
        return NextResponse.json(
          { error: 'Invalid chapter IDs provided' },
          { status: 400 }
        )
      }

      // Update order for each chapter
      const updates = chapterIds.map((chapterId, index) => 
        db
          .update(schema.chapters)
          .set({ orderIndex: index })
          .where(and(
            eq(schema.chapters.id, chapterId),
            eq(schema.chapters.storyId, id)
          ))
      )
      
      await Promise.all(updates)

      // Get the updated chapters
      const updatedChapters = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.storyId, id))
        .orderBy(schema.chapters.orderIndex)

      return NextResponse.json({
        message: 'Chapters reordered successfully',
        chapters: updatedChapters
      })
    }

    // Bulk publish/unpublish chapters
    if (action === 'publish' && typeof isPublished === 'boolean') {
      // If specific chapterIds are provided, update only those
      if (Array.isArray(chapterIds) && chapterIds.length > 0) {
        await db
          .update(schema.chapters)
          .set({ isPublished })
          .where(and(
            eq(schema.chapters.storyId, id),
            not(eq(schema.chapters.id, chapterIds))
          ))
      } 
      // Otherwise update all chapters
      else {
        await db
          .update(schema.chapters)
          .set({ isPublished })
          .where(eq(schema.chapters.storyId, id))
      }

      // Update the story published status as well if all chapters are published
      if (isPublished) {
        await db
          .update(schema.stories)
          .set({ isPublished: true })
          .where(eq(schema.stories.id, id))
      }

      return NextResponse.json({
        message: `Chapters ${isPublished ? 'published' : 'unpublished'} successfully`
      })
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in bulk chapter operation:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk operation' },
      { status: 500 }
    )
  }
}
