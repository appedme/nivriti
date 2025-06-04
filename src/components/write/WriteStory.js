'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import RichTextEditor from './RichTextEditor'
import ChapterEditor from './ChapterEditor'
import { 
  Save, 
  Eye, 
  Send, 
  Image, 
  Tag, 
  X, 
  Plus,
  FileText,
  Clock,
  Sparkles,
  Loader2,
  BookOpen,
  Layout,
  ListOrdered
} from 'lucide-react'
import { useCreateStory, useUpdateStory } from '@/hooks/useApi'
import { toast } from 'sonner'

const popularTags = [
  'Healing', 'Romance', 'Fiction', 'Poetry', 'Life Stories', 'Mindfulness', 
  'Adventure', 'Mystery', 'Self Discovery', 'Love Letters', 'Daily Life'
]

export default function WriteStory({ storyId = null, initialData = null }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [editorContent, setEditorContent] = useState({})
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [tags, setTags] = useState(initialData?.tags ? (typeof initialData.tags === 'string' ? initialData.tags.split(',') : initialData.tags) : [])
  const [newTag, setNewTag] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isMultiChapter, setIsMultiChapter] = useState(initialData?.isMultiChapter || false)
  const [chapters, setChapters] = useState([])
  
  useEffect(() => {
    if (initialData?.isMultiChapter && initialData?.content) {
      try {
        // Try to parse content as chapter array
        const parsedChapters = JSON.parse(initialData.content)
        if (Array.isArray(parsedChapters)) {
          setChapters(parsedChapters)
        }
      } catch (e) {
        console.error("Error parsing chapters:", e)
      }
    }
  }, [initialData])

  const { createStory, loading: createLoading } = useCreateStory()
  const { updateStory, loading: updateLoading } = useUpdateStory()
  const isLoading = createLoading || updateLoading

  const handleContentChange = (e) => {
    const text = e.target.value
    setContent(text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
    
    // Auto-generate excerpt if not set
    if (!excerpt && text.length > 50) {
      setExcerpt(text.substring(0, 200) + '...')
    }
  }
  
  const handleEditorContentChange = (data) => {
    setEditorContent(data)
    
    // Count words in editor content
    let totalWords = 0
    if (data && data.blocks) {
      const text = data.blocks
        .map(block => {
          if (block.data && block.data.text) {
            return block.data.text
          }
          return ''
        })
        .join(' ')
      
      totalWords = text.trim().split(/\s+/).filter(word => word.length > 0).length
    }
    
    setWordCount(totalWords)
    
    // Auto-generate excerpt if not set
    if (!excerpt && totalWords > 0) {
      // Extract text from first few blocks
      let excerptText = ''
      if (data && data.blocks) {
        for (let i = 0; i < Math.min(3, data.blocks.length); i++) {
          if (data.blocks[i].data && data.blocks[i].data.text) {
            excerptText += data.blocks[i].data.text + ' '
            if (excerptText.length > 150) break
          }
        }
      }
      
      if (excerptText.length > 0) {
        excerptText = excerptText.substring(0, 200).trim() + '...'
        setExcerpt(excerptText)
      }
    }
  }
  
  const handleChaptersChange = (updatedChapters) => {
    setChapters(updatedChapters)
    
    // Count total words across all chapters
    let totalWords = 0
    updatedChapters.forEach(chapter => {
      if (chapter.content) {
        try {
          const parsedContent = JSON.parse(chapter.content)
          if (parsedContent && parsedContent.blocks) {
            const text = parsedContent.blocks
              .map(block => block.data && block.data.text ? block.data.text : '')
              .join(' ')
            
            totalWords += text.trim().split(/\s+/).filter(word => word.length > 0).length
          }
        } catch (e) {
          // If not JSON, count directly
          const text = chapter.content.toString()
          totalWords += text.trim().split(/\s+/).filter(word => word.length > 0).length
        }
      }
    })
    
    setWordCount(totalWords)
  }
  
  const addNewChapter = () => {
    const newChapter = {
      id: `chapter-${Date.now()}`,
      title: `Chapter ${chapters.length + 1}`,
      content: JSON.stringify({
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: ''
            }
          }
        ]
      }),
      orderIndex: chapters.length,
      isPublished: false,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    }
    
    setChapters([...chapters, newChapter])
  }
  
  const deleteChapter = (chapterId) => {
    const updatedChapters = chapters.filter(ch => ch.id !== chapterId)
    // Update orderIndex for remaining chapters
    const reorderedChapters = updatedChapters.map((ch, idx) => ({
      ...ch,
      orderIndex: idx
    }))
    setChapters(reorderedChapters)
  }
  
  const handleChaptersReorder = (reorderedChapters) => {
    setChapters(reorderedChapters)
  }

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSaveDraft = async () => {
    if (!session) {
      toast.error('Please sign in to save your story')
      return
    }

    if (!title.trim()) {
      toast.error('Please add a title')
      return
    }

    try {
      let storyContent
      
      if (isMultiChapter) {
        if (chapters.length === 0) {
          toast.error('Please add at least one chapter before saving')
          return
        }
        storyContent = JSON.stringify(chapters)
      } else {
        // Use EditorJS content if available, otherwise fall back to plain text
        storyContent = Object.keys(editorContent).length > 0 
          ? JSON.stringify(editorContent)
          : content.trim()
      }
      
      const storyData = {
        title: title.trim(),
        content: storyContent,
        excerpt: excerpt.trim() || (content ? content.substring(0, 200) + '...' : ''),
        tags: tags.join(','),
        isPublished: false,
        isMultiChapter,
        chapterCount: isMultiChapter ? chapters.length : 0
      }

      if (storyId) {
        await updateStory(storyId, storyData)
        toast.success('Draft saved successfully!')
      } else {
        const result = await createStory(storyData)
        toast.success('Draft saved successfully!')
        // Redirect to edit the newly created story
        router.push(`/write/${result.story.id}`)
      }
    } catch (error) {
      toast.error('Failed to save draft')
      console.error('Error saving draft:', error)
    }
  }

  const handlePublish = async () => {
    if (!session) {
      toast.error('Please sign in to publish your story')
      return
    }

    if (!title.trim()) {
      toast.error('Please add a title before publishing')
      return
    }
    
    let contentValid = false
    if (isMultiChapter) {
      if (chapters.length === 0) {
        toast.error('Please add at least one chapter before publishing')
        return
      }
      contentValid = true
    } else {
      contentValid = Object.keys(editorContent).length > 0 || content.trim().length > 0
    }
    
    if (!contentValid) {
      toast.error('Please add content before publishing')
      return
    }

    try {
      let storyContent
      
      if (isMultiChapter) {
        // Mark all chapters as published
        const publishedChapters = chapters.map(chapter => ({
          ...chapter,
          isPublished: true,
          updatedAt: new Date().getTime()
        }))
        storyContent = JSON.stringify(publishedChapters)
      } else {
        storyContent = Object.keys(editorContent).length > 0 
          ? JSON.stringify(editorContent)
          : content.trim()
      }
      
      const storyData = {
        title: title.trim(),
        content: storyContent,
        excerpt: excerpt.trim() || (content ? content.substring(0, 200) + '...' : ''),
        tags: tags.join(','),
        isPublished: true,
        isMultiChapter,
        chapterCount: isMultiChapter ? chapters.length : 0
      }

      let result
      if (storyId) {
        result = await updateStory(storyId, storyData)
      } else {
        result = await createStory(storyData)
      }

      toast.success('Story published successfully!')
      router.push(`/story/${result.story.id}`)
    } catch (error) {
      toast.error('Failed to publish story')
      console.error('Error publishing story:', error)
    }
  }

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass-effect">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/">← Back to Stories</a>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{wordCount} words</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{estimatedReadTime} min read</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Story Preview</DialogTitle>
                    <DialogDescription>
                      See how your story will look to readers
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="mt-4 max-h-[60vh]">
                    <div className="space-y-4">
                      <h1 className="text-3xl font-bold">{title || 'Untitled Story'}</h1>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <div className="story-content whitespace-pre-wrap">
                        {content || 'Your story content will appear here...'}
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Input */}
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Give your story a beautiful title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold border-0 p-0 h-auto bg-transparent placeholder:text-muted-foreground/60 focus-visible:ring-0"
            />
          </div>

          {/* Excerpt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Excerpt (optional) - A brief description of your story
            </label>
            <Textarea
              placeholder="Write a compelling excerpt that will draw readers in..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {excerpt.length}/300 characters {!excerpt && '(Auto-generated from content if left empty)'}
            </p>
          </div>

          {/* Tags Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <h3 className="font-semibold">Tags (up to 5)</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="default" className="pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Custom Tag */}
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add a custom tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(newTag)
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={() => addTag(newTag)} 
                  disabled={!newTag || tags.length >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Popular Tags */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant={tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Type Selection */}
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Story Format</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="multi-chapter"
                  checked={isMultiChapter}
                  onCheckedChange={setIsMultiChapter}
                />
                <Label htmlFor="multi-chapter" className="cursor-pointer">
                  {isMultiChapter ? "Multi-Chapter Book" : "Single Story"}
                </Label>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {isMultiChapter ? (
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Layout className="h-4 w-4 mr-2" />
                  <span>Single page story</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Editor */}
          <div className="space-y-4">
            {isMultiChapter ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Chapters</h3>
                  <Button 
                    onClick={addNewChapter}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Chapter
                  </Button>
                </div>
                
                {chapters.length > 0 ? (
                  <ChapterEditor 
                    chapters={chapters}
                    onChange={handleChaptersChange}
                    onDelete={deleteChapter}
                    onReorder={handleChaptersReorder}
                  />
                ) : (
                  <Card className="border-dashed p-8 text-center">
                    <CardContent className="pt-4 px-0">
                      <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mt-4">No chapters yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Click "Add Chapter" to create your first chapter
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={addNewChapter}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Chapter
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="min-h-[500px] border rounded-md p-4">
                <RichTextEditor
                  initialContent={content}
                  onChange={handleEditorContentChange}
                  placeholder="Start writing your story here... Let your words flow like a gentle stream, carrying your thoughts and emotions to those who need to hear them."
                />
              </div>
            )}
          </div>

          {/* Cover Image Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <h3 className="font-semibold">Story Cover</h3>
                <Badge variant="secondary">Optional</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
                <Image className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Add a cover image to your story</p>
                  <p className="text-xs text-muted-foreground">
                    Upload an image or we'll generate one based on your story's mood
                  </p>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline">
                    <Image className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Writing Tips</h3>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Write from your heart - authenticity resonates with readers</li>
                <li>• Use descriptive language to paint vivid scenes</li>
                <li>• Break up long paragraphs for easier reading</li>
                <li>• Choose tags that reflect your story's themes and emotions</li>
                <li>• Remember: every story matters and has the power to heal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
