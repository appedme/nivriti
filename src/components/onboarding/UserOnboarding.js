'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel'
import {
    PenTool,
    BookOpen,
    Heart,
    Users,
    Search,
    Settings,
    Star,
    ArrowRight,
    CheckCircle,
    Sparkles
} from 'lucide-react'

const onboardingSteps = [
    {
        id: 'welcome',
        title: 'Welcome to Nivriti',
        description: 'A mindful space for storytelling and connection',
        icon: Sparkles,
        content: (
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-3">Welcome to Nivriti</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Nivriti is a calm, mindful platform where you can share your stories, 
                        discover beautiful narratives, and connect with a thoughtful community.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                        <PenTool className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Write</p>
                        <p className="text-xs text-muted-foreground">Share your stories</p>
                    </div>
                    <div className="text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Read</p>
                        <p className="text-xs text-muted-foreground">Discover content</p>
                    </div>
                    <div className="text-center">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Connect</p>
                        <p className="text-xs text-muted-foreground">Build community</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'write',
        title: 'Share Your Stories',
        description: 'Express yourself in a distraction-free environment',
        icon: PenTool,
        content: (
            <div className="space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <PenTool className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-3">Write Your Heart Out</h2>
                    <p className="text-muted-foreground mb-6">
                        Our minimalist editor helps you focus on what matters most - your words.
                    </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Clean, distraction-free editor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Auto-save drafts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Beautiful story covers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Tag your stories for discovery</span>
                    </div>
                </div>
                <Button className="w-full" asChild>
                    <a href="/write">
                        <PenTool className="h-4 w-4 mr-2" />
                        Start Writing
                    </a>
                </Button>
            </div>
        )
    },
    {
        id: 'discover',
        title: 'Discover Stories',
        description: 'Find content that resonates with you',
        icon: BookOpen,
        content: (
            <div className="space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-3">Explore Mindful Stories</h2>
                    <p className="text-muted-foreground mb-6">
                        Discover healing narratives, daily reflections, and inspiring tales from our community.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {['Healing', 'Romance', 'Poetry', 'Mindfulness', 'Life Stories', 'Fiction'].map((tag) => (
                        <Badge key={tag} variant="secondary" className="justify-center py-2">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="space-y-2">
                    <Button className="w-full" variant="outline" asChild>
                        <a href="/explore">
                            <Search className="h-4 w-4 mr-2" />
                            Explore Stories
                        </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                        <a href="/search">
                            <Search className="h-4 w-4 mr-2" />
                            Search & Filter
                        </a>
                    </Button>
                </div>
            </div>
        )
    },
    {
        id: 'connect',
        title: 'Build Community',
        description: 'Connect with like-minded storytellers',
        icon: Users,
        content: (
            <div className="space-y-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-3">Join the Community</h2>
                    <p className="text-muted-foreground mb-6">
                        Engage thoughtfully with stories through comments, likes, and meaningful connections.
                    </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">React to stories that move you</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Leave thoughtful comments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Follow your favorite authors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Create reading lists</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'personalize',
        title: 'Customize Your Experience',
        description: 'Make Nivriti truly yours',
        icon: Settings,
        content: (
            <div className="space-y-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Settings className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-3">Personalize Your Journey</h2>
                    <p className="text-muted-foreground mb-6">
                        Customize your profile, notification preferences, and reading experience.
                    </p>
                </div>
                <div className="space-y-3">
                    <Button className="w-full" variant="outline" asChild>
                        <a href="/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Visit Settings
                        </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                        <a href="/profile/me">
                            <User className="h-4 w-4 mr-2" />
                            Complete Profile
                        </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                        <a href="/lists">
                            <Heart className="h-4 w-4 mr-2" />
                            Create Reading Lists
                        </a>
                    </Button>
                </div>
            </div>
        )
    }
]

// Import missing icons
import { MessageCircle, User } from 'lucide-react'

export default function UserOnboarding({ isOpen, onComplete, user }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState(new Set())

    const handleNext = () => {
        setCompletedSteps(prev => new Set([...prev, currentStep]))
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onComplete()
        }
    }

    const handleSkip = () => {
        onComplete()
    }

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex)
    }

    const progress = ((currentStep + 1) / onboardingSteps.length) * 100

    if (!user) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>Getting Started</DialogTitle>
                            <DialogDescription>
                                Step {currentStep + 1} of {onboardingSteps.length}
                            </DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleSkip}>
                            Skip Tour
                        </Button>
                    </div>
                    <Progress value={progress} className="w-full" />
                </DialogHeader>

                <div className="py-6">
                    {onboardingSteps[currentStep].content}
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        {onboardingSteps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => handleStepClick(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentStep
                                        ? 'bg-primary'
                                        : index < currentStep || completedSteps.has(index)
                                        ? 'bg-primary/50'
                                        : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        {currentStep > 0 && (
                            <Button 
                                variant="outline" 
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Previous
                            </Button>
                        )}
                        <Button onClick={handleNext}>
                            {currentStep === onboardingSteps.length - 1 ? (
                                <>
                                    Get Started
                                    <Star className="h-4 w-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href="/write">
                                <PenTool className="h-3 w-3 mr-2" />
                                Write Story
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href="/explore">
                                <BookOpen className="h-3 w-3 mr-2" />
                                Explore
                            </a>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
