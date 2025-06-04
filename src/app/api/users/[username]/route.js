import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, desc } from 'drizzle-orm'

// GET /api/users/[username] - Fetch user profile
export async function GET(request, { params }) {
    try {
        const { username } = params
        const db = getDB()

        const user = await db
            .select({
                id: schema.users.id,
                name: schema.users.name,
                username: schema.users.username,
                email: schema.users.email,
                image: schema.users.image,
                bio: schema.users.bio,
                location: schema.users.location,
                website: schema.users.website,
                twitterHandle: schema.users.twitterHandle,
                instagramHandle: schema.users.instagramHandle,
                createdAt: schema.users.createdAt,
                followerCount: schema.users.followerCount,
                followingCount: schema.users.followingCount,
            })
            .from(schema.users)
            .where(eq(schema.users.username, username))
            .limit(1)

        if (!user.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const userData = user[0]

        // Get user's published stories
        const stories = await db
            .select({
                id: schema.stories.id,
                title: schema.stories.title,
                excerpt: schema.stories.excerpt,
                coverImage: schema.stories.coverImage,
                tags: schema.stories.tags,
                createdAt: schema.stories.createdAt,
                readTime: schema.stories.readTime,
                likeCount: schema.stories.likeCount,
                commentCount: schema.stories.commentCount,
                viewCount: schema.stories.viewCount,
            })
            .from(schema.stories)
            .where(eq(schema.stories.authorId, userData.id))
            .where(eq(schema.stories.isPublished, true))
            .orderBy(desc(schema.stories.createdAt))
            .limit(20)

        // Check if current user is following this user
        let isFollowing = false
        const session = await auth()
        if (session?.user && session.user.id !== userData.id) {
            const follow = await db
                .select()
                .from(schema.follows)
                .where(eq(schema.follows.followerId, session.user.id))
                .where(eq(schema.follows.followingId, userData.id))
                .limit(1)

            isFollowing = follow.length > 0
        }

        // Calculate total likes across all stories
        const totalLikes = stories.reduce((sum, story) => sum + story.likeCount, 0)

        return NextResponse.json({
            user: {
                id: userData.id,
                name: userData.name,
                username: userData.username,
                avatar: userData.image,
                bio: userData.bio,
                location: userData.location,
                website: userData.website,
                social: {
                    twitter: userData.twitterHandle,
                    instagram: userData.instagramHandle
                },
                joinedDate: userData.createdAt,
                stats: {
                    stories: stories.length,
                    followers: userData.followerCount,
                    following: userData.followingCount,
                    likes: totalLikes
                },
                isFollowing,
                isOwnProfile: session?.user?.id === userData.id
            },
            stories: stories.map(story => ({
                id: story.id,
                title: story.title,
                excerpt: story.excerpt,
                coverImage: story.coverImage,
                tags: story.tags ? story.tags.split(',') : [],
                publishedAt: story.createdAt,
                readTime: story.readTime,
                likes: story.likeCount,
                comments: story.commentCount,
                views: story.viewCount
            }))
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        )
    }
}

// PUT /api/users/[username] - Update user profile (only own profile)
export async function PUT(request, { params }) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { username } = params
        const body = await request.json()

        const db = getDB()

        // Check if user exists and is the authenticated user
        const user = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.username, username))
            .limit(1)

        if (!user.length || user[0].id !== session.user.id) {
            return NextResponse.json(
                { error: 'User not found or unauthorized' },
                { status: 404 }
            )
        }

        const {
            name,
            bio,
            location,
            website,
            twitterHandle,
            instagramHandle,
            newUsername
        } = body

        // If username is being changed, check if it's available
        if (newUsername && newUsername !== username) {
            const existingUser = await db
                .select()
                .from(schema.users)
                .where(eq(schema.users.username, newUsername))
                .limit(1)

            if (existingUser.length > 0) {
                return NextResponse.json(
                    { error: 'Username already taken' },
                    { status: 400 }
                )
            }
        }

        const updatedUser = await db
            .update(schema.users)
            .set({
                ...(name && { name }),
                ...(newUsername && { username: newUsername }),
                ...(bio !== undefined && { bio }),
                ...(location !== undefined && { location }),
                ...(website !== undefined && { website }),
                ...(twitterHandle !== undefined && { twitterHandle }),
                ...(instagramHandle !== undefined && { instagramHandle }),
                updatedAt: new Date()
            })
            .where(eq(schema.users.id, session.user.id))
            .returning()

        return NextResponse.json({
            user: updatedUser[0],
            message: 'Profile updated successfully'
        })

    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
