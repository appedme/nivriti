'use client'

import { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import CodeTool from '@editorjs/code'
import InlineCode from '@editorjs/inline-code'
import Marker from '@editorjs/marker'

export default function RichTextEditor({ 
  initialContent, 
  onChange, 
  placeholder = "Start writing your story here..."
}) {
  const editorRef = useRef(null)
  const [editorInstance, setEditorInstance] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  // Parse the content if it's an EditorJS data object or use empty data
  const parseInitialData = () => {
    if (!initialContent) return {}
    
    try {
      // Check if content is already in EditorJS format
      if (typeof initialContent === 'object') {
        return initialContent
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(initialContent)
      return parsed
    } catch (e) {
      // If not JSON, create a paragraph block with the content
      return {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: initialContent
            }
          }
        ]
      }
    }
  }

  useEffect(() => {
    setIsMounted(true)
    
    return () => {
      // Cleanup editor
      if (editorInstance) {
        editorInstance.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const editor = new EditorJS({
      holder: editorRef.current,
      placeholder: placeholder,
      autofocus: true,
      inlineToolbar: ['bold', 'italic', 'marker', 'inlineCode', 'link'],
      data: parseInitialData(),
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a heading',
            levels: [2, 3, 4],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author'
          }
        },
        code: CodeTool,
        inlineCode: InlineCode,
        marker: Marker
      },
      onChange: async () => {
        const savedData = await editor.save()
        onChange && onChange(savedData)
      }
    })

    setEditorInstance(editor)

    return () => {
      editor.isReady.then(() => {
        editor.destroy()
      }).catch(e => console.error('Error destroying editor:', e))
    }
  }, [isMounted, placeholder])

  return (
    <div className="relative min-h-[300px]">
      <div id="editorjs" ref={editorRef} className="prose prose-lg max-w-none" />
    </div>
  )
}
