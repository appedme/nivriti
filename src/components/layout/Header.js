'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    Search,
    PenTool,
    Heart,
    BookOpen,
    User,
    Settings,
    LogOut,
    Menu,
    Flower
} from 'lucide-react'
import NotificationCenter from './NotificationCenter'

export default function Header({ user }) {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Flower className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-xl tracking-tight">Nivriti</span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search stories, authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-primary/20' : ''
                                    }`}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </form>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/explore">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Explore
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/write">
                                    <PenTool className="h-4 w-4 mr-2" />
                                    Write
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/lists">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Lists
                                </Link>
                            </Button>
                        </nav>

                        {/* Notifications & User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <NotificationCenter user={user} />
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user?.image} alt={user?.name} />
                                            <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex flex-col space-y-1 p-2">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`/profile/${user?.username || 'me'}`}>
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-stories">
                                            <PenTool className="mr-2 h-4 w-4" />
                                            My Stories
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/auth/signin">Sign in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/auth/signup">Get Started</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-4 mt-4">
                                    {/* Mobile Search */}
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            type="text"
                                            placeholder="Search stories, authors..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10" 
                                        />
                                    </form>

                                    {/* Mobile Navigation */}
                                    <nav className="flex flex-col space-y-2">
                                        <Button variant="ghost" className="justify-start" asChild>
                                            <Link href="/explore">
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                Explore
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="justify-start" asChild>
                                            <Link href="/write">
                                                <PenTool className="h-4 w-4 mr-2" />
                                                Write
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="justify-start" asChild>
                                            <Link href="/lists">
                                                <Heart className="h-4 w-4 mr-2" />
                                                Lists
                                            </Link>
                                        </Button>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
