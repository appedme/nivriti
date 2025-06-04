'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Save, Loader2, User, Mail, MapPin, Link as LinkIcon, Camera } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useUserProfile, useUpdateProfile } from '@/hooks/useApi'
import { toast } from 'sonner'

export default function ProfileSettings() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        twitterHandle: '',
        instagramHandle: ''
    })

    const { data: profileData, loading: profileLoading } = useUserProfile(session?.user?.username)
    const { updateProfile, loading: updateLoading } = useUpdateProfile()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (profileData?.user) {
            setFormData({
                name: profileData.user.name || '',
                username: profileData.user.username || '',
                bio: profileData.user.bio || '',
                location: profileData.user.location || '',
                website: profileData.user.website || '',
                twitterHandle: profileData.user.social?.twitter || '',
                instagramHandle: profileData.user.social?.instagram || ''
            })
        }
    }, [profileData, status, router])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        if (!session?.user?.username) return

        try {
            await updateProfile(session.user.username, {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                website: formData.website,
                twitterHandle: formData.twitterHandle,
                instagramHandle: formData.instagramHandle,
                ...(formData.username !== session.user.username && { newUsername: formData.username })
            })

            toast.success('Profile updated successfully!')

            // If username changed, redirect to new profile URL
            if (formData.username !== session.user.username) {
                router.push(`/profile/${formData.username}`)
            }
        } catch (error) {
            toast.error('Failed to update profile')
            console.error('Error updating profile:', error)
        }
    }

    if (status === 'loading' || profileLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading profile...</span>
                </div>
            </Layout>
        )
    }

    if (!session) {
        return null
    }

    return (
        <Layout user={session.user}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-muted-foreground">Manage your public profile information</p>
                    </div>

                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Profile Picture
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={session.user.image} alt={session.user.name} />
                                        <AvatarFallback>
                                            {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Change Picture
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            JPG, PNG or GIF. Max size 2MB.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Your display name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                            placeholder="your-username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        {formData.bio.length}/160 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        <MapPin className="h-4 w-4 inline mr-1" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Links & Social */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Links & Social Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">
                                        <LinkIcon className="h-4 w-4 inline mr-1" />
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        placeholder="https://your-website.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="twitter">Twitter Handle</Label>
                                        <Input
                                            id="twitter"
                                            value={formData.twitterHandle}
                                            onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram">Instagram Handle</Label>
                                        <Input
                                            id="instagram"
                                            value={formData.instagramHandle}
                                            onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>
                                        <Mail className="h-4 w-4 inline mr-1" />
                                        Email Address
                                    </Label>
                                    <Input
                                        value={session.user.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Email cannot be changed. Contact support if needed.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updateLoading}>
                                {updateLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
