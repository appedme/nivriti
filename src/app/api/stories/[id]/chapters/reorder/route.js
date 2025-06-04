import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// POST /api/stories/[id]/chapters/reorder - Reorder chapters
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
    const { chapterIds } = body

    if (!Array.isArray(chapterIds)) {
      return NextResponse.json(
        { error: 'Chapter IDs array is required' },
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

  } catch (error) {
    console.error('Error reordering chapters:', error)
    return NextResponse.json(
      { error: 'Failed to reorder chapters' },
      { status: 500 }
    )
  }
}
