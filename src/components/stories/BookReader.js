'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BookOpen, ChevronLeft, ChevronRight, List, Menu, Settings, Sun, Moon, BookText, Type } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { useReadingPreferences } from '@/hooks/useReadingPreferences'

export default function BookReader({ story, chapters }) {
  const [activeChapter, setActiveChapter] = useState(0)
  const [tocSheetOpen, setTocSheetOpen] = useState(false)
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false)
  const contentRef = useRef(null)
  
  // Reading preferences
  const { 
    preferences, 
    styleProperties, 
    isLoaded, 
    updatePreferences, 
    savePosition, 
    getLastPosition 
  } = useReadingPreferences()

  // Check if running on client side
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    
    // Restore last position from saved preferences
    if (story?.id && isLoaded) {
      const lastPosition = getLastPosition(story.id)
      if (lastPosition) {
        const chapterIndex = chapters.findIndex(c => c.id === lastPosition.chapterId)
        if (chapterIndex >= 0) {
          setActiveChapter(chapterIndex)
          
          // Wait for content to render, then scroll to position
          setTimeout(() => {
            if (contentRef.current && typeof lastPosition.position === 'number') {
              contentRef.current.scrollTop = lastPosition.position
            }
          }, 100)
        }
      }
    }
  }, [story?.id, isLoaded, chapters])
  
  // Save reading position periodically
  useEffect(() => {
    if (!story?.id || !chapters?.length || !isLoaded) return
    
    const currentChapter = chapters[activeChapter]
    if (!currentChapter) return
    
    const handleScroll = () => {
      if (contentRef.current) {
        savePosition(story.id, currentChapter.id, contentRef.current.scrollTop)
      }
    }
    
    // Save on scroll with debounce
    let timeout
    const scrollHandler = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleScroll, 500)
    }
    
    if (contentRef.current) {
      contentRef.current.addEventListener('scroll', scrollHandler)
      
      // Save initial position
      handleScroll()
    }
    
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', scrollHandler)
      }
      clearTimeout(timeout)
    }
  }, [activeChapter, story?.id, isLoaded, chapters])
  
  if (!isMounted) {
    return <div className="p-8 text-center">Loading reader...</div>
  }

  // Settings UI components
  const ReaderSettings = () => {
    return (
      <Sheet open={settingsSheetOpen} onOpenChange={setSettingsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-10"
            title="Reading Settings"
          >
            <Settings size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Reading Settings</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="flex gap-2">
                <Button 
                  variant={preferences.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ theme: 'light' })}
                  className="flex-1"
                >
                  <Sun size={16} className="mr-2" /> Light
                </Button>
                <Button 
                  variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ theme: 'dark' })}
                  className="flex-1"
                >
                  <Moon size={16} className="mr-2" /> Dark
                </Button>
                <Button 
                  variant={preferences.theme === 'sepia' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ theme: 'sepia' })}
                  className="flex-1"
                >
                  <BookText size={16} className="mr-2" /> Sepia
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Font Size</h3>
              <div className="px-1">
                <Slider 
                  min={0} 
                  max={3} 
                  step={1} 
                  value={['small', 'medium', 'large', 'xlarge'].indexOf(preferences.fontSize)}
                  onValueChange={(val) => {
                    const sizes = ['small', 'medium', 'large', 'xlarge']
                    updatePreferences({ fontSize: sizes[val[0]] })
                  }}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                  <span>A</span>
                  <span>A</span>
                  <span>A</span>
                  <span>A</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Font Family</h3>
              <div className="flex gap-2">
                <Button 
                  variant={preferences.fontFamily === 'serif' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ fontFamily: 'serif' })}
                  className="flex-1"
                >
                  Serif
                </Button>
                <Button 
                  variant={preferences.fontFamily === 'sans-serif' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ fontFamily: 'sans-serif' })}
                  className="flex-1"
                >
                  Sans
                </Button>
                <Button 
                  variant={preferences.fontFamily === 'monospace' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ fontFamily: 'monospace' })}
                  className="flex-1"
                >
                  Mono
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Line Spacing</h3>
              <div className="flex gap-2">
                <Button 
                  variant={preferences.lineSpacing === 'tight' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ lineSpacing: 'tight' })}
                  className="flex-1"
                >
                  Tight
                </Button>
                <Button 
                  variant={preferences.lineSpacing === 'normal' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ lineSpacing: 'normal' })}
                  className="flex-1"
                >
                  Normal
                </Button>
                <Button 
                  variant={preferences.lineSpacing === 'relaxed' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ lineSpacing: 'relaxed' })}
                  className="flex-1"
                >
                  Relaxed
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Margins</h3>
              <div className="flex gap-2">
                <Button 
                  variant={preferences.marginSize === 'small' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ marginSize: 'small' })}
                  className="flex-1"
                >
                  Small
                </Button>
                <Button 
                  variant={preferences.marginSize === 'medium' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ marginSize: 'medium' })}
                  className="flex-1"
                >
                  Medium
                </Button>
                <Button 
                  variant={preferences.marginSize === 'large' ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ marginSize: 'large' })}
                  className="flex-1"
                >
                  Large
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
  
  // Parse chapter content
  const renderChapterContent = (content) => {
    try {
      if (typeof content === 'string') {
        const parsedContent = JSON.parse(content)
        if (!parsedContent.blocks) return <p>{content}</p>
        
        // Apply reading preferences styles
        const readerStyles = {
          fontSize: styleProperties.fontSize,
          lineHeight: styleProperties.lineHeight,
          fontFamily: styleProperties.fontFamily,
          textAlign: styleProperties.textAlign,
        }
        
        return (
          <div 
            className="prose max-w-none dark:prose-invert"
            style={readerStyles}
          >
            {parsedContent.blocks.map((block, index) => {
              if (!block.data) return null
              
              switch (block.type) {
                case 'header':
                  const HeadingTag = `h${block.data.level}`
                  return <HeadingTag key={index}>{block.data.text}</HeadingTag>
                
                case 'paragraph':
                  return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                
                case 'list':
                  if (block.data.style === 'ordered') {
                    return (
                      <ol key={index}>
                        {block.data.items.map((item, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ol>
                    )
                  } else {
                    return (
                      <ul key={index}>
                        {block.data.items.map((item, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    )
                  }
                
                case 'quote':
                  return (
                    <blockquote key={index}>
                      <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                      {block.data.caption && <cite>— {block.data.caption}</cite>}
                    </blockquote>
                  )
                
                case 'code':
                  return (
                    <pre key={index}>
                      <code>{block.data.code}</code>
                    </pre>
                  )
                
                default:
                  return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
              }
            })}
          </div>
        )
      }
      
      // Fallback to plain text
      return <p>{content}</p>
    } catch (e) {
      console.error("Error rendering content:", e)
      return <p>{content}</p>
    }
  }
  
  const handlePreviousChapter = () => {
    if (activeChapter > 0) {
      setActiveChapter(activeChapter - 1)
      window.scrollTo(0, 0)
    }
  }
  
  const handleNextChapter = () => {
    if (activeChapter < chapters.length - 1) {
      setActiveChapter(activeChapter + 1)
      window.scrollTo(0, 0)
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass-effect">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href={`/story/${story.id}`}>← Back</Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h2 className="text-lg font-medium hidden md:block">{story.title}</h2>
          </div>
          
          <div className="flex items-center">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4 mr-2" />
                  <span>Chapters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
                  <ScrollArea className="h-[80vh]">
                    <div className="space-y-1 pr-4">
                      {chapters.map((chapter, index) => (
                        <Button
                          key={index}
                          variant={activeChapter === index ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => {
                            setActiveChapter(index)
                            setSheetOpen(false)
                          }}
                        >
                          <span className="mr-2">{index + 1}.</span>
                          {chapter.title || `Chapter ${index + 1}`}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePreviousChapter}
                disabled={activeChapter === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <span className="mx-2 text-sm text-muted-foreground">
                Chapter {activeChapter + 1} of {chapters.length}
              </span>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextChapter}
                disabled={activeChapter === chapters.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Reader Content */}
      <div className="container mx-auto px-4 py-8 flex">
        {/* Table of Contents Sidebar (desktop) */}
        <div className="hidden md:block w-64 pr-8">
          <div className="sticky top-24">
            <div className="flex items-center mb-4">
              <BookOpen className="h-5 w-5 mr-2" />
              <h3 className="font-bold">Table of Contents</h3>
            </div>
            
            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <Button
                  key={index}
                  variant={activeChapter === index ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveChapter(index)}
                >
                  <span className="mr-2">{index + 1}.</span>
                  <span className="truncate">{chapter.title || `Chapter ${index + 1}`}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Chapter Content */}
        <div className="flex-1 max-w-3xl mx-auto">
          <Card className="p-8 shadow-lg">
            {chapters.length > 0 && (
              <>
                <h1 className="text-2xl font-bold mb-2">
                  {chapters[activeChapter]?.title || `Chapter ${activeChapter + 1}`}
                </h1>
                <Separator className="my-4" />
                <div className="chapter-content">
                  {renderChapterContent(chapters[activeChapter]?.content)}
                </div>
              </>
            )}
          </Card>
          
          {/* Chapter Navigation (mobile) */}
          <div className="md:hidden flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePreviousChapter}
              disabled={activeChapter === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <span className="mx-2 self-center text-sm text-muted-foreground">
              {activeChapter + 1} / {chapters.length}
            </span>
            
            <Button 
              variant="outline" 
              onClick={handleNextChapter}
              disabled={activeChapter === chapters.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
