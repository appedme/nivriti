'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Flower,
    Heart,
    BookOpen,
    PenTool
} from 'lucide-react'

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn('google', { callbackUrl: '/' })
        } catch (error) {
            console.error('Error signing in with Google:', error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <Flower className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">Nivriti</span>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">Welcome to Nivriti</h1>
                            <p className="text-muted-foreground">
                                Continue your storytelling journey
                            </p>
                        </div>
                    </div>

                    {/* Auth Form */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center mb-4">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Sign in to access your stories, create new content, and connect with the Nivriti community
                                </p>
                            </div>

                            {/* Google Sign In */}
                            <Button 
                                variant="outline" 
                                className="w-full h-11"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                        <span>Please wait...</span>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </Button>
                            
                            <div className="text-center text-sm">
                                <p className="text-muted-foreground">
                                    By signing in, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <div className="flex flex-col justify-center h-full max-w-lg mx-auto space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">A peaceful space for storytellers</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Join a mindful community where stories heal, inspire, and connect souls.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <PenTool className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold">Share Your Story</h3>
                                <p className="text-sm text-muted-foreground">Write and publish in a peaceful environment</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold">Discover Stories</h3>
                                <p className="text-sm text-muted-foreground">Find stories that resonate with your soul</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold">Connect & Heal</h3>
                                <p className="text-sm text-muted-foreground">Join a supportive community of storytellers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
