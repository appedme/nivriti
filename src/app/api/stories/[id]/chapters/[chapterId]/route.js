import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// GET /api/stories/[storyId]/chapters/[chapterId] - Get a specific chapter
export async function GET(request, { params }) {
  try {
    const { storyId, chapterId } = params
    const db = getDB()

    // Get the chapter
    const chapter = await db
      .select()
      .from(schema.chapters)
      .where(and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.storyId, storyId)
      ))
      .limit(1)

    if (!chapter.length) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    const chapterData = chapter[0]

    // If chapter is not published, check if user is the author
    if (!chapterData.isPublished) {
      // Get the story to check the author
      const story = await db
        .select()
        .from(schema.stories)
        .where(eq(schema.stories.id, storyId))
        .limit(1)

      if (!story.length) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        )
      }

      const session = await auth()
      if (!session?.user || story[0].authorId !== session.user.id) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        )
      }
    }

    // Increment view count if chapter is published
    if (chapterData.isPublished) {
      await db
        .update(schema.chapters)
        .set({ viewCount: chapterData.viewCount + 1 })
        .where(eq(schema.chapters.id, chapterId))
    }

    return NextResponse.json({
      chapter: {
        id: chapterData.id,
        title: chapterData.title,
        content: chapterData.content,
        orderIndex: chapterData.orderIndex,
        storyId: chapterData.storyId,
        isPublished: chapterData.isPublished,
        readTime: chapterData.readTime,
        viewCount: chapterData.viewCount + (chapterData.isPublished ? 1 : 0),
        createdAt: chapterData.createdAt,
        updatedAt: chapterData.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}

// PUT /api/stories/[storyId]/chapters/[chapterId] - Update a chapter
export async function PUT(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { storyId, chapterId } = params
    const body = await request.json()
    const { title, content, orderIndex, isPublished } = body

    const db = getDB()

    // Check if user owns the story
    const story = await db
      .select()
      .from(schema.stories)
      .where(and(
        eq(schema.stories.id, storyId),
        eq(schema.stories.authorId, session.user.id)
      ))
      .limit(1)

    if (!story.length) {
      return NextResponse.json(
        { error: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if chapter exists
    const existingChapter = await db
      .select()
      .from(schema.chapters)
      .where(and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.storyId, storyId)
      ))
      .limit(1)

    if (!existingChapter.length) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Calculate read time if content changed
    let readTime = existingChapter[0].readTime
    if (content && content !== existingChapter[0].content) {
      let wordCount = 0
      try {
        const contentObj = JSON.parse(content)
        contentObj.blocks?.forEach(block => {
          if (block.data?.text) {
            // Strip HTML tags for accurate word counting
            const plainText = block.data.text.replace(/<[^>]*>/g, ' ')
            wordCount += plainText.split(/\s+/).filter(Boolean).length
          }
          // Count list items
          if (block.data?.items) {
            block.data.items.forEach(item => {
              const plainText = item.replace(/<[^>]*>/g, ' ')
              wordCount += plainText.split(/\s+/).filter(Boolean).length
            })
          }
        })
      } catch (e) {
        // If content can't be parsed, do a basic count
        wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
      }
      
      readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read'
    }

    // Update the chapter
    const updatedChapter = await db
      .update(schema.chapters)
      .set({
        ...(title && { title }),
        ...(content && { content }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(typeof isPublished === 'boolean' && { isPublished }),
        ...(content && { readTime }),
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.storyId, storyId)
      ))
      .returning()

    return NextResponse.json({
      chapter: updatedChapter[0],
      message: 'Chapter updated successfully'
    })

  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

// DELETE /api/stories/[storyId]/chapters/[chapterId] - Delete a chapter
export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { storyId, chapterId } = params
    const db = getDB()

    // Check if user owns the story
    const story = await db
      .select()
      .from(schema.stories)
      .where(and(
        eq(schema.stories.id, storyId),
        eq(schema.stories.authorId, session.user.id)
      ))
      .limit(1)

    if (!story.length) {
      return NextResponse.json(
        { error: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if chapter exists
    const existingChapter = await db
      .select()
      .from(schema.chapters)
      .where(and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.storyId, storyId)
      ))
      .limit(1)

    if (!existingChapter.length) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Delete the chapter
    await db
      .delete(schema.chapters)
      .where(and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.storyId, storyId)
      ))

    // Update the story's chapterCount
    const chapterCount = story[0].chapterCount - 1
    await db
      .update(schema.stories)
      .set({ 
        chapterCount,
        isMultiChapter: chapterCount > 0
      })
      .where(eq(schema.stories.id, storyId))

    return NextResponse.json({
      message: 'Chapter deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
