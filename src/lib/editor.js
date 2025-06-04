/**
 * Utilities for working with Editor.js content
 */

/**
 * Parse Editor.js content from various formats
 * @param {string|object} content - Content to parse
 * @returns {object} - Editor.js compatible data object
 */
export function parseEditorContent(content) {
  if (!content) {
    return { blocks: [] }
  }
  
  try {
    // If content is already an object, return it
    if (typeof content === 'object') {
      return content
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(content)
    return parsed
  } catch (e) {
    // If not valid JSON, create a paragraph block with the content
    return {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: String(content)
          }
        }
      ]
    }
  }
}

/**
 * Calculate read time for Editor.js content
 * @param {string|object} content - Content to analyze
 * @returns {string} - Formatted read time
 */
export function calculateReadTime(content) {
  let wordCount = 0
  
  try {
    const contentObj = typeof content === 'string' ? JSON.parse(content) : content
    
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
    if (typeof content === 'string') {
      wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
    }
  }
  
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min read`
}

/**
 * Extract a plain text excerpt from Editor.js content
 * @param {string|object} content - Editor.js content
 * @param {number} maxLength - Maximum length for the excerpt
 * @returns {string} - Plain text excerpt
 */
export function extractExcerpt(content, maxLength = 160) {
  try {
    const contentObj = typeof content === 'string' ? JSON.parse(content) : content
    
    let excerpt = ''
    for (const block of contentObj.blocks || []) {
      if (block.type === 'paragraph' && block.data?.text) {
        // Strip HTML tags for clean text
        const plainText = block.data.text.replace(/<[^>]*>/g, ' ')
        excerpt += plainText + ' '
      }
      
      if (excerpt.length >= maxLength) {
        break
      }
    }
    
    return excerpt.length > maxLength 
      ? excerpt.substring(0, maxLength).trim() + '...'
      : excerpt.trim()
      
  } catch (e) {
    // Fallback for non-Editor.js content
    if (typeof content === 'string') {
      const plainText = content.replace(/<[^>]*>/g, ' ')
      return plainText.length > maxLength 
        ? plainText.substring(0, maxLength).trim() + '...'
        : plainText.trim()
    }
    return ''
  }
}
