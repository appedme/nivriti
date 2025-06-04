'use client'

import { use } from 'react'
import { useStory } from '@/hooks/useApi'
import { useChapters } from '@/hooks/useChapters'
import BookReader from '@/components/stories/BookReader'

export default function ReadPage({ params }) {
  const resolvedParams = use(params);
  const { data: storyData, loading: storyLoading, error: storyError } = useStory(resolvedParams.id)
  const { chapters, loading: chaptersLoading, error: chaptersError } = useChapters(resolvedParams.id)
  
  if (storyLoading || chaptersLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading book...</p>
      </div>
    )
  }
  
  if (storyError || !storyData) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Book</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't load this book. It may have been removed or you don't have permission to view it.
        </p>
        <div className="mt-8">
          <a href="/" className="text-primary hover:underline">
            Return to homepage
          </a>
        </div>
      </div>
    )
  }
  
  if (chaptersError) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Chapters</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't load the chapters for this book. Please try again later.
        </p>
        <div className="mt-8">
          <a href={`/story/${params.id}`} className="text-primary hover:underline">
            Return to story page
          </a>
        </div>
      </div>
    )
  }
  
  if (!storyData.story.isMultiChapter) {
    // Redirect to regular story page if not a multi-chapter book
    window.location.href = `/story/${params.id}`
    return null
  }
  
  // Check if we have at least one chapter
  if (chapters.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">No Chapters Found</h1>
        <p className="text-muted-foreground">
          This book appears to have no chapters yet. Please check back later.
        </p>
        <div className="mt-8">
          <a href={`/story/${params.id}`} className="text-primary hover:underline">
            Return to story page
          </a>
        </div>
      </div>
    )
  }
  
  return <BookReader story={storyData.story} chapters={chapters} />
}
