'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Share2,
    Copy,
    Twitter,
    Facebook,
    Link2,
    Mail,
    MessageCircle,
    Download,
    Quote,
    Check,
    ExternalLink
} from 'lucide-react'

export default function ShareStory({ story, isOpen, onOpenChange }) {
    const [copiedText, setCopiedText] = useState('')
    const [selectedQuote, setSelectedQuote] = useState('')
    const [customMessage, setCustomMessage] = useState('')

    const storyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/story/${story.id}`
    
    const shareText = `"${story.title}" by ${story.author.name} on Nivriti - ${storyUrl}`
    
    const handleCopyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedText(type)
            setTimeout(() => setCopiedText(''), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const shareOptions = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            color: 'hover:bg-blue-50 hover:text-blue-600'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`,
            color: 'hover:bg-blue-50 hover:text-blue-700'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            color: 'hover:bg-green-50 hover:text-green-600'
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodeURIComponent(story.title)}&body=${encodeURIComponent(`I thought you might enjoy this story:\n\n"${story.title}" by ${story.author.name}\n\n${story.excerpt}\n\nRead more: ${storyUrl}`)}`,
            color: 'hover:bg-gray-50 hover:text-gray-700'
        }
    ]

    const popularQuotes = [
        story.excerpt,
        "Sometimes the most beautiful thing we can do is release what no longer serves us...",
        "In the quiet moments between heartbeats, we find our truest selves."
    ].filter(Boolean)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Share2 className="h-5 w-5" />
                        <span>Share Story</span>
                    </DialogTitle>
                    <DialogDescription>
                        Share "{story.title}" with others
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="share" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="share">Share</TabsTrigger>
                        <TabsTrigger value="quote">Quote</TabsTrigger>
                        <TabsTrigger value="embed">Embed</TabsTrigger>
                    </TabsList>

                    {/* Share Tab */}
                    <TabsContent value="share" className="space-y-4">
                        {/* Quick Share Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {shareOptions.map((option) => (
                                <Button
                                    key={option.name}
                                    variant="outline"
                                    className={`h-12 justify-start space-x-3 ${option.color}`}
                                    onClick={() => window.open(option.url, '_blank', 'width=600,height=400')}
                                >
                                    <option.icon className="h-4 w-4" />
                                    <span>{option.name}</span>
                                </Button>
                            ))}
                        </div>

                        {/* Copy Link */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Story Link</label>
                            <div className="flex space-x-2">
                                <Input 
                                    value={storyUrl} 
                                    readOnly 
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => handleCopyToClipboard(storyUrl, 'link')}
                                    className="px-3"
                                >
                                    {copiedText === 'link' ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Add a personal message (optional)</label>
                            <Textarea
                                placeholder="What did you think about this story?"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                    </TabsContent>

                    {/* Quote Tab */}
                    <TabsContent value="quote" className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Select a quote to share</label>
                            
                            {/* Popular Quotes */}
                            <div className="space-y-2">
                                {popularQuotes.map((quote, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedQuote === quote ? "default" : "outline"}
                                        className="w-full text-left h-auto p-3 whitespace-normal"
                                        onClick={() => setSelectedQuote(quote)}
                                    >
                                        <Quote className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm leading-relaxed">"{quote}"</span>
                                    </Button>
                                ))}
                            </div>

                            {/* Custom Quote */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Or write your own quote</label>
                                <Textarea
                                    placeholder="Select text from the story to quote..."
                                    value={selectedQuote}
                                    onChange={(e) => setSelectedQuote(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                            </div>

                            {/* Quote Actions */}
                            {selectedQuote && (
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleCopyToClipboard(
                                            `"${selectedQuote}"\n\n— from "${story.title}" by ${story.author.name}\nRead more: ${storyUrl}`,
                                            'quote'
                                        )}
                                    >
                                        {copiedText === 'quote' ? (
                                            <Check className="h-4 w-4 mr-2 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 mr-2" />
                                        )}
                                        Copy Quote
                                    </Button>
                                    <Button
                                        onClick={() => window.open(
                                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${selectedQuote}"\n\n— from "${story.title}" by ${story.author.name}\n\n${storyUrl}`)}`,
                                            '_blank',
                                            'width=600,height=400'
                                        )}
                                    >
                                        <Twitter className="h-4 w-4 mr-2" />
                                        Tweet
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Embed Tab */}
                    <TabsContent value="embed" className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Embed this story</label>
                            <p className="text-sm text-muted-foreground">
                                Copy this code to embed a preview of this story on your website or blog.
                            </p>

                            {/* Embed Preview */}
                            <div className="border rounded-lg p-4 bg-muted/50">
                                <div className="flex items-start space-x-3">
                                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Flower className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{story.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            by {story.author.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                            {story.excerpt}
                                        </p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {story.readTime} min read
                                            </Badge>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Embed Code */}
                            <div className="space-y-2">
                                <Textarea
                                    readOnly
                                    value={`<iframe src="${storyUrl}/embed" width="100%" height="200" frameborder="0"></iframe>`}
                                    className="min-h-[60px] resize-none font-mono text-xs"
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => handleCopyToClipboard(
                                        `<iframe src="${storyUrl}/embed" width="100%" height="200" frameborder="0"></iframe>`,
                                        'embed'
                                    )}
                                    className="w-full"
                                >
                                    {copiedText === 'embed' ? (
                                        <Check className="h-4 w-4 mr-2 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    Copy Embed Code
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

// Import icon component
const Flower = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 1 4.5 4.5M7.5 12H9m4.5 3a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5v1.5m0-10.5V1.5"/>
    </svg>
)
