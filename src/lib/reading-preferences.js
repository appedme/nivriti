/**
 * Default reading preferences
 */
export const DEFAULT_PREFERENCES = {
  fontSize: 'medium', // small, medium, large, xlarge
  theme: 'light', // light, dark, sepia
  lineSpacing: 'normal', // tight, normal, relaxed
  fontFamily: 'serif', // serif, sans-serif, monospace
  alignment: 'left', // left, justify
  marginSize: 'medium', // small, medium, large
  lastReadPositions: {}, // { storyId: { chapterId, position } }
}

/**
 * Load reading preferences from localStorage (client-side only)
 */
export function getReadingPreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  
  try {
    const savedPrefs = localStorage.getItem('reading-preferences')
    if (!savedPrefs) return DEFAULT_PREFERENCES
    
    const prefs = JSON.parse(savedPrefs)
    return {
      ...DEFAULT_PREFERENCES,
      ...prefs
    }
  } catch (err) {
    console.error('Error loading reading preferences:', err)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Save reading preferences to localStorage (client-side only)
 */
export function saveReadingPreferences(preferences) {
  if (typeof window === 'undefined') return
  
  try {
    const prefs = {
      ...getReadingPreferences(),
      ...preferences
    }
    
    localStorage.setItem('reading-preferences', JSON.stringify(prefs))
    return prefs
  } catch (err) {
    console.error('Error saving reading preferences:', err)
  }
}

/**
 * Update last read position for a story
 */
export function updateLastReadPosition(storyId, chapterId, position) {
  if (typeof window === 'undefined') return
  
  const prefs = getReadingPreferences()
  const lastReadPositions = {
    ...prefs.lastReadPositions,
    [storyId]: { chapterId, position }
  }
  
  saveReadingPreferences({
    lastReadPositions
  })
}

/**
 * Get last read position for a story
 */
export function getLastReadPosition(storyId) {
  const prefs = getReadingPreferences()
  return prefs.lastReadPositions[storyId] || null
}

/**
 * Get CSS properties for current preferences
 */
export function getReadingStyleProperties(preferences = null) {
  const prefs = preferences || getReadingPreferences()
  
  const fontSizes = {
    small: '1rem',
    medium: '1.125rem',
    large: '1.25rem',
    xlarge: '1.5rem'
  }
  
  const lineSpacings = {
    tight: '1.4',
    normal: '1.6',
    relaxed: '2'
  }
  
  const fontFamilies = {
    serif: 'Georgia, Times, serif',
    'sans-serif': 'system-ui, -apple-system, sans-serif',
    monospace: 'monospace'
  }
  
  const marginSizes = {
    small: '1rem',
    medium: '2rem',
    large: '4rem'
  }
  
  const themes = {
    light: {
      background: '#ffffff',
      text: '#333333',
      muted: '#6b7280',
    },
    dark: {
      background: '#1a1a1a',
      text: '#e5e5e5',
      muted: '#9ca3af',
    },
    sepia: {
      background: '#f5efdc',
      text: '#5f4b32',
      muted: '#78716c',
    }
  }
  
  return {
    fontSize: fontSizes[prefs.fontSize] || fontSizes.medium,
    lineHeight: lineSpacings[prefs.lineSpacing] || lineSpacings.normal,
    fontFamily: fontFamilies[prefs.fontFamily] || fontFamilies.serif,
    textAlign: prefs.alignment || 'left',
    margin: marginSizes[prefs.marginSize] || marginSizes.medium,
    background: themes[prefs.theme]?.background || themes.light.background,
    color: themes[prefs.theme]?.text || themes.light.text,
    mutedColor: themes[prefs.theme]?.muted || themes.light.muted,
  }
}
