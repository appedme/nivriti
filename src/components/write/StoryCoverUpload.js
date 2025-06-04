'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Upload,
    Image as ImageIcon,
    Palette,
    Sparkles,
    Download,
    RefreshCw,
    Check,
    X,
    Camera
} from 'lucide-react'

const gradientPatterns = [
    {
        id: 'sunset',
        name: 'Sunset',
        gradient: 'linear-gradient(135deg, #ff9a8b 0%, #a8e6cf 100%)',
        colors: ['#ff9a8b', '#a8e6cf']
    },
    {
        id: 'ocean',
        name: 'Ocean',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: ['#667eea', '#764ba2']
    },
    {
        id: 'forest',
        name: 'Forest',
        gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
        colors: ['#56ab2f', '#a8e6cf']
    },
    {
        id: 'lavender',
        name: 'Lavender',
        gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        colors: ['#d299c2', '#fef9d7']
    },
    {
        id: 'peach',
        name: 'Peach',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        colors: ['#ffecd2', '#fcb69f']
    },
    {
        id: 'mint',
        name: 'Mint',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        colors: ['#a8edea', '#fed6e3']
    },
    {
        id: 'golden',
        name: 'Golden',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        colors: ['#f093fb', '#f5576c']
    },
    {
        id: 'aurora',
        name: 'Aurora',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        colors: ['#4facfe', '#00f2fe']
    }
]

const stockImages = [
    {
        id: 'nature1',
        url: '/api/placeholder/400/240',
        alt: 'Peaceful forest path',
        category: 'Nature'
    },
    {
        id: 'nature2',
        url: '/api/placeholder/400/240',
        alt: 'Mountain sunrise',
        category: 'Nature'
    },
    {
        id: 'abstract1',
        url: '/api/placeholder/400/240',
        alt: 'Flowing water abstract',
        category: 'Abstract'
    },
    {
        id: 'minimal1',
        url: '/api/placeholder/400/240',
        alt: 'Minimal geometric shapes',
        category: 'Minimal'
    },
    {
        id: 'texture1',
        url: '/api/placeholder/400/240',
        alt: 'Paper texture',
        category: 'Texture'
    },
    {
        id: 'texture2',
        url: '/api/placeholder/400/240',
        alt: 'Fabric texture',
        category: 'Texture'
    }
]

export default function StoryCoverUpload({ currentCover, onCoverChange, storyTitle }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCover, setSelectedCover] = useState(currentCover || null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const fileInputRef = useRef(null)

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const coverData = {
                    type: 'upload',
                    url: e.target.result,
                    file: file
                }
                setUploadedFile(coverData)
                setSelectedCover(coverData)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGradientSelect = (gradient) => {
        const coverData = {
            type: 'gradient',
            gradient: gradient.gradient,
            name: gradient.name,
            colors: gradient.colors
        }
        setSelectedCover(coverData)
    }

    const handleStockImageSelect = (image) => {
        const coverData = {
            type: 'stock',
            url: image.url,
            alt: image.alt,
            category: image.category
        }
        setSelectedCover(coverData)
    }

    const generateAICover = async () => {
        setIsGenerating(true)
        
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const aiCover = {
            type: 'ai',
            url: '/api/placeholder/400/240',
            prompt: `Cover art for "${storyTitle}"`
        }
        
        setSelectedCover(aiCover)
        setIsGenerating(false)
    }

    const handleSave = () => {
        onCoverChange(selectedCover)
        setIsOpen(false)
    }

    const CoverPreview = ({ cover, className = "w-full h-32" }) => {
        if (!cover) {
            return (
                <div className={`${className} bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25`}>
                    <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No cover</p>
                    </div>
                </div>
            )
        }

        if (cover.type === 'gradient') {
            return (
                <div 
                    className={`${className} rounded-lg`}
                    style={{ background: cover.gradient }}
                >
                    <div className="w-full h-full rounded-lg bg-black/10 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h3 className="font-semibold text-lg mb-1">{storyTitle || 'Story Title'}</h3>
                            <p className="text-sm opacity-90">by Author</p>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={`${className} rounded-lg overflow-hidden relative`}>
                <img 
                    src={cover.url} 
                    alt={cover.alt || 'Story cover'} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                        <h3 className="font-semibold text-lg mb-1">{storyTitle || 'Story Title'}</h3>
                        <p className="text-sm opacity-90">by Author</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Story Cover</label>
            
            <div className="relative">
                <CoverPreview cover={selectedCover} className="w-full h-40" />
                
                <div className="absolute top-2 right-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsOpen(true)}
                        className="bg-white/90 hover:bg-white"
                    >
                        <Camera className="h-4 w-4 mr-2" />
                        {selectedCover ? 'Change' : 'Add'} Cover
                    </Button>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Choose a Cover for Your Story</DialogTitle>
                        <DialogDescription>
                            Select from our templates or upload your own image
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Panel - Options */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="gradients" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="gradients">Gradients</TabsTrigger>
                                    <TabsTrigger value="stock">Stock</TabsTrigger>
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                    <TabsTrigger value="ai">AI Generate</TabsTrigger>
                                </TabsList>

                                {/* Gradients */}
                                <TabsContent value="gradients" className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {gradientPatterns.map((gradient) => (
                                            <button
                                                key={gradient.id}
                                                onClick={() => handleGradientSelect(gradient)}
                                                className={`relative h-20 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                                                    selectedCover?.type === 'gradient' && selectedCover?.name === gradient.name
                                                        ? 'ring-2 ring-primary'
                                                        : ''
                                                }`}
                                                style={{ background: gradient.gradient }}
                                            >
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium">
                                                        {gradient.name}
                                                    </span>
                                                </div>
                                                {selectedCover?.type === 'gradient' && selectedCover?.name === gradient.name && (
                                                    <div className="absolute top-1 right-1">
                                                        <Check className="h-4 w-4 text-white bg-primary rounded-full p-0.5" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Stock Images */}
                                <TabsContent value="stock" className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {stockImages.map((image) => (
                                            <button
                                                key={image.id}
                                                onClick={() => handleStockImageSelect(image)}
                                                className={`relative aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 ${
                                                    selectedCover?.type === 'stock' && selectedCover?.url === image.url
                                                        ? 'ring-2 ring-primary'
                                                        : ''
                                                }`}
                                            >
                                                <img 
                                                    src={image.url} 
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {image.category}
                                                    </Badge>
                                                </div>
                                                {selectedCover?.type === 'stock' && selectedCover?.url === image.url && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-white bg-primary rounded-full p-0.5" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Upload */}
                                <TabsContent value="upload" className="space-y-4">
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="font-semibold mb-2">Upload your own image</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            JPG, PNG up to 10MB. Recommended size: 800x480px
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()}>
                                            Choose File
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    {uploadedFile && (
                                        <div className="relative">
                                            <img 
                                                src={uploadedFile.url} 
                                                alt="Uploaded cover"
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => {
                                                    setUploadedFile(null)
                                                    if (selectedCover?.type === 'upload') {
                                                        setSelectedCover(null)
                                                    }
                                                }}
                                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* AI Generate */}
                                <TabsContent value="ai" className="space-y-4">
                                    <div className="text-center space-y-4">
                                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6">
                                            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                                            <h3 className="font-semibold mb-2">AI-Generated Cover</h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Let AI create a unique cover based on your story title and content
                                            </p>
                                            <Button 
                                                onClick={generateAICover}
                                                disabled={isGenerating}
                                                className="min-w-[120px]"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-4 w-4 mr-2" />
                                                        Generate Cover
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {selectedCover?.type === 'ai' && (
                                            <div className="relative">
                                                <img 
                                                    src={selectedCover.url} 
                                                    alt="AI generated cover"
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                <Badge className="absolute top-2 left-2">
                                                    AI Generated
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Panel - Preview */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Preview</h3>
                            <CoverPreview cover={selectedCover} className="w-full h-48" />
                            
                            <div className="flex space-x-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="flex-1"
                                    onClick={handleSave}
                                >
                                    Save Cover
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
