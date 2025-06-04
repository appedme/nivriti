import Link from 'next/link'
import { Flower, Heart, Twitter, Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <Flower className="h-6 w-6 text-primary" />
                                <span className="font-semibold text-xl">Nivriti</span>
                            </Link>
                            <p className="text-muted-foreground mb-4 max-w-md leading-relaxed">
                                A calm storytelling platform where words find peace and stories heal souls.
                                Share your journey, discover others, and find solace in the power of narrative.
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="mailto:hello@nivriti.com">
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h3 className="font-semibold mb-3">Platform</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Explore Stories
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/write" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Start Writing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Browse Genres
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/authors" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Featured Authors
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h3 className="font-semibold mb-3">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Community
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Bottom Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © 2025 Nivriti. Made with <Heart className="h-3 w-3 inline text-red-500" /> for storytellers.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Link href="/status" className="hover:text-foreground transition-colors">
                                Status
                            </Link>
                            <Link href="/changelog" className="hover:text-foreground transition-colors">
                                Changelog
                            </Link>
                            <Link href="/api" className="hover:text-foreground transition-colors">
                                API
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
