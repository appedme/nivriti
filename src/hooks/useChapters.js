'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to fetch chapters for a story
 */
export function useChapters(storyId) {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!storyId) {
      setChapters([])
      setLoading(false)
      return
    }

    async function fetchChapters() {
      try {
        setLoading(true)
        const response = await fetch(`/api/stories/${storyId}/chapters`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chapters')
        }
        
        const data = await response.json()
        
        // Sort chapters by orderIndex if available
        const sortedChapters = data.chapters.sort((a, b) => a.orderIndex - b.orderIndex)
        setChapters(sortedChapters)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching chapters:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchChapters()
  }, [storyId])

  return { chapters, loading, error }
}

/**
 * Custom hook to fetch a specific chapter
 */
export function useChapter(storyId, chapterId) {
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!storyId || !chapterId) {
      setChapter(null)
      setLoading(false)
      return
    }

    async function fetchChapter() {
      try {
        setLoading(true)
        const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chapter')
        }
        
        const data = await response.json()
        setChapter(data.chapter)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching chapter:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchChapter()
  }, [storyId, chapterId])

  return { chapter, loading, error }
}
