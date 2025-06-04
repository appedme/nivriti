'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_PREFERENCES,
  getReadingPreferences,
  saveReadingPreferences,
  getReadingStyleProperties,
  updateLastReadPosition,
  getLastReadPosition
} from '@/lib/reading-preferences'

export function useReadingPreferences() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [styleProperties, setStyleProperties] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on client-side
  useEffect(() => {
    const userPrefs = getReadingPreferences()
    setPreferences(userPrefs)
    setStyleProperties(getReadingStyleProperties(userPrefs))
    setIsLoaded(true)
  }, [])

  // Update preferences
  const updatePreferences = (newPrefs) => {
    const updated = {
      ...preferences,
      ...newPrefs
    }
    
    setPreferences(updated)
    setStyleProperties(getReadingStyleProperties(updated))
    saveReadingPreferences(newPrefs)
    
    return updated
  }

  // Save reading position for the current story
  const savePosition = (storyId, chapterId, position) => {
    updateLastReadPosition(storyId, chapterId, position)
    
    // Also update local state
    setPreferences(prev => ({
      ...prev,
      lastReadPositions: {
        ...prev.lastReadPositions,
        [storyId]: { chapterId, position }
      }
    }))
  }

  // Get last position for a story
  const getLastPosition = (storyId) => {
    if (!isLoaded) return null
    
    // Check in-memory state first
    if (preferences.lastReadPositions?.[storyId]) {
      return preferences.lastReadPositions[storyId]
    }
    
    // Fall back to localStorage
    return getLastReadPosition(storyId)
  }

  return {
    preferences,
    styleProperties,
    isLoaded,
    updatePreferences,
    savePosition,
    getLastPosition
  }
}
