import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db/dev'
import { eq, and, asc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// GET /api/stories/[id]/chapters - Get all chapters for a story
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const db = getDB()

    // Check if story exists and if it's published or the user is the author
    const story = await db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.id, id))
      .limit(1)

    if (!story.length) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    const storyData = story[0]

    // If story is not published, check if user is the author
    if (!storyData.isPublished) {
      const session = await auth()
      if (!session?.user || storyData.authorId !== session.user.id) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        )
      }
    }

    // Get chapters ordered by orderIndex
    const chapters = await db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.storyId, id))
      .orderBy(asc(schema.chapters.orderIndex))

    return NextResponse.json({
      storyId: id,
      chapters: chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        orderIndex: chapter.orderIndex,
        isPublished: chapter.isPublished,
        readTime: chapter.readTime,
        viewCount: chapter.viewCount,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    )
  }
}

// POST /api/stories/[id]/chapters - Create a new chapter
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
    const { title, content, orderIndex, isPublished = false } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
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

    // Calculate read time (approximately 200 words per minute)
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
    
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read'

    // Get next orderIndex if not provided
    let nextOrderIndex = orderIndex
    if (nextOrderIndex === undefined) {
      const lastChapter = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.storyId, id))
        .orderBy(asc(schema.chapters.orderIndex))

      nextOrderIndex = lastChapter.length ? lastChapter.length : 0
    }

    // Create the new chapter
    const newChapter = await db
      .insert(schema.chapters)
      .values({
        id: nanoid(),
        title,
        content,
        orderIndex: nextOrderIndex,
        storyId: id,
        isPublished,
        readTime,
        viewCount: 0
      })
      .returning()

    // Update the story's chapterCount and isMultiChapter flags
    await db
      .update(schema.stories)
      .set({ 
        chapterCount: story[0].chapterCount + 1,
        isMultiChapter: true
      })
      .where(eq(schema.stories.id, id))

    return NextResponse.json({
      chapter: newChapter[0],
      message: 'Chapter created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
