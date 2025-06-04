'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  MessageCircle, 
  BookmarkPlus, 
  Share, 
  MoreHorizontal,
  Clock,
  Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function StoryCard({ story }) {
  const [isLiked, setIsLiked] = useState(story?.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(story?.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(story?.likeCount || 0)

  const handleLike = (e) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (e) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: `/story/${story.id}`
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/story/${story.id}`)
    }
  }

  return (
    <Card className="story-card-hover border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={story.author?.avatar} alt={story.author?.name} />
              <AvatarFallback>{story.author?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{story.author?.name}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{story.publishedAt}</span>
                <span>•</span>
                <span>{story.readTime} min read</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report story</DropdownMenuItem>
              <DropdownMenuItem>Hide from feed</DropdownMenuItem>
              <DropdownMenuItem>Follow author</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Link href={`/story/${story.id}`} className="block group">
          <div className="space-y-3">
            {/* Story Cover Image */}
            {story.coverImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Title and Excerpt */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {story.excerpt}
              </p>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {story.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {story.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{story.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 p-0 hover:bg-transparent ${
                isLiked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="h-8 p-0 text-muted-foreground hover:bg-transparent">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{story.commentCount || 0}</span>
            </Button>

            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              <span>{story.viewCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`h-8 w-8 p-0 ${
                isBookmarked ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
