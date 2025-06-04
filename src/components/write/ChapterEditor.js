'use client'

import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Grip, ChevronUp, ChevronDown, Trash2, Clock } from 'lucide-react'

export default function ChapterEditor({ 
  chapters = [], 
  onChange,
  onDelete,
  onReorder
}) {
  const [expandedChapters, setExpandedChapters] = useState({})

  const toggleChapterExpand = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters]
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    }
    onChange(updatedChapters)
  }

  const handleEditorChange = (index, data) => {
    handleChapterChange(index, 'content', JSON.stringify(data))
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    
    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    // Update order index for each chapter
    const reorderedChapters = items.map((item, index) => ({
      ...item,
      orderIndex: index
    }))
    
    onReorder(reorderedChapters)
  }

  // Calculate word count for a chapter
  const calculateWordCount = (content) => {
    try {
      if (!content) return 0
      
      if (typeof content === 'string') {
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(content)
          // Extract text from blocks
          const text = parsed.blocks
            .map(block => block.data.text || '')
            .join(' ')
          return text.trim().split(/\s+/).filter(word => word.length > 0).length
        } catch (e) {
          // If parsing fails, count words directly
          return content.trim().split(/\s+/).filter(word => word.length > 0).length
        }
      }
      return 0
    } catch (e) {
      console.error("Error calculating word count:", e)
      return 0
    }
  }

  // Estimate read time
  const estimateReadTime = (wordCount) => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {chapters.map((chapter, index) => {
              const isExpanded = expandedChapters[chapter.id]
              const wordCount = calculateWordCount(chapter.content)
              const readTime = estimateReadTime(wordCount)
              
              return (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border-2"
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab"
                            >
                              <Grip className="h-5 w-5 text-muted-foreground" />
                            </div>
                            
                            {isExpanded ? (
                              <Input
                                value={chapter.title}
                                onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                                placeholder="Chapter title"
                                className="text-lg font-medium w-full"
                              />
                            ) : (
                              <h3 className="text-lg font-medium truncate">
                                {chapter.title || `Chapter ${index + 1}`}
                              </h3>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!isExpanded && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{readTime} min</span>
                                <span>•</span>
                                <span>{wordCount} words</span>
                              </div>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onDelete(chapter.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleChapterExpand(chapter.id)}
                            >
                              {isExpanded ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="p-4 pt-0">
                          <RichTextEditor
                            initialContent={chapter.content}
                            onChange={(data) => handleEditorChange(index, data)}
                            placeholder={`Write your content for ${chapter.title || `Chapter ${index + 1}`}...`}
                          />
                          
                          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{readTime} min read</span>
                              <span>•</span>
                              <span>{wordCount} words</span>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
