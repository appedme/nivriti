'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  Sparkles
} from 'lucide-react'

const popularTags = [
  'Healing', 'Romance', 'Fiction', 'Poetry', 'Life Stories', 'Mindfulness', 
  'Adventure', 'Mystery', 'Self Discovery', 'Love Letters', 'Daily Life'
]

export default function WriteStory() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleContentChange = (e) => {
    const text = e.target.value
    setContent(text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
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
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and content before publishing.')
      return
    }
    // Handle publish logic
    alert('Story published successfully!')
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
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
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

              <Button onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
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

          {/* Content Editor */}
          <div className="space-y-4">
            <Textarea
              placeholder="Start writing your story here... Let your words flow like a gentle stream, carrying your thoughts and emotions to those who need to hear them."
              value={content}
              onChange={handleContentChange}
              className="min-h-[500px] text-base leading-relaxed border-0 bg-transparent resize-none focus-visible:ring-0 story-content"
            />
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
