'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Flower,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Heart,
    BookOpen,
    PenTool,
    User,
    Check
} from 'lucide-react'

export default function SignUpPage() {
    const [step, setStep] = useState(1) // 1: Basic info, 2: Profile setup
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    // Profile setup fields
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [favoriteGenres, setFavoriteGenres] = useState([])

    const genres = [
        'Romance', 'Fiction', 'Diary', 'Healing', 'Poetry', 'Mystery', 
        'Adventure', 'Drama', 'Comedy', 'Horror', 'Science Fiction', 'Fantasy'
    ]

    const handleBasicSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }
        setIsLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setIsLoading(false)
        setStep(2)
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call for profile setup
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        // Redirect to onboarding success or dashboard
        window.location.href = '/'
    }

    const toggleGenre = (genre) => {
        setFavoriteGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        )
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

                        {step === 1 ? (
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    Create your account
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Join our community of thoughtful storytellers
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    Set up your profile
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Help us personalize your experience
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>

                    {step === 1 ? (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                {/* Google Sign Up */}
                                <Button 
                                    variant="outline" 
                                    className="w-full h-12 mb-6"
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continue with Google
                                </Button>

                                <div className="relative">
                                    <Separator />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-card px-2 text-muted-foreground text-sm">or</span>
                                    </div>
                                </div>

                                {/* Email Sign Up */}
                                <form onSubmit={handleBasicSubmit} className="space-y-4 mt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 pr-10 h-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 mt-6" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Continue
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Already have an account?{' '}
                                    <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                                        Sign in
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    placeholder="@username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="pl-10 h-12"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio (Optional)</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us a little about yourself..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="min-h-[80px] resize-none"
                                            maxLength={160}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">
                                            {bio.length}/160
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Favorite Genres (Select up to 5)</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {genres.map((genre) => (
                                                <Badge
                                                    key={genre}
                                                    variant={favoriteGenres.includes(genre) ? "default" : "outline"}
                                                    className="cursor-pointer justify-center py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                                    onClick={() => favoriteGenres.length < 5 || favoriteGenres.includes(genre) ? toggleGenre(genre) : null}
                                                >
                                                    {favoriteGenres.includes(genre) && (
                                                        <Check className="w-3 h-3 mr-1" />
                                                    )}
                                                    {genre}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Selected: {favoriteGenres.length}/5
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-12"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="flex-1 h-12" 
                                            disabled={isLoading || !username || !name}
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Complete Setup
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-8">
                <div className="max-w-lg text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-foreground">
                            Welcome to Nivriti
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            A calm space for mindful storytelling, where every word matters and every story heals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-12">
                        <div className="flex items-center space-x-4 text-left">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <PenTool className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Share Your Stories</h3>
                                <p className="text-sm text-muted-foreground">Write and publish your thoughts in a beautiful, distraction-free environment</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-left">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Discover Stories</h3>
                                <p className="text-sm text-muted-foreground">Explore mindful narratives from our community of thoughtful writers</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-left">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Connect Mindfully</h3>
                                <p className="text-sm text-muted-foreground">Engage with stories and authors in a peaceful, supportive community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
