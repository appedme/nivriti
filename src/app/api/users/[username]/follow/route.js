import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDB, schema } from '@/db'
import { eq, and } from 'drizzle-orm'

// POST /api/users/[username]/follow - Follow/unfollow a user
export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { username } = params
    const db = getDB()

    // Get the user to follow
    const userToFollow = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1)

    if (!userToFollow.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const targetUserId = userToFollow[0].id

    // Check if user is trying to follow themselves
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(schema.follows)
      .where(and(
        eq(schema.follows.followerId, session.user.id),
        eq(schema.follows.followingId, targetUserId)
      ))
      .limit(1)

    if (existingFollow.length > 0) {
      // Unfollow
      await db
        .delete(schema.follows)
        .where(and(
          eq(schema.follows.followerId, session.user.id),
          eq(schema.follows.followingId, targetUserId)
        ))

      // Update follower counts
      await db
        .update(schema.users)
        .set({ followerCount: userToFollow[0].followerCount - 1 })
        .where(eq(schema.users.id, targetUserId))

      // Update following count for current user
      const currentUser = await db
        .select({ followingCount: schema.users.followingCount })
        .from(schema.users)
        .where(eq(schema.users.id, session.user.id))
        .limit(1)

      await db
        .update(schema.users)
        .set({ followingCount: currentUser[0].followingCount - 1 })
        .where(eq(schema.users.id, session.user.id))

      return NextResponse.json({
        following: false,
        followerCount: userToFollow[0].followerCount - 1,
        message: 'Unfollowed successfully'
      })
    } else {
      // Follow
      await db.insert(schema.follows).values({
        followerId: session.user.id,
        followingId: targetUserId
      })

      // Update follower counts
      await db
        .update(schema.users)
        .set({ followerCount: userToFollow[0].followerCount + 1 })
        .where(eq(schema.users.id, targetUserId))

      // Update following count for current user
      const currentUser = await db
        .select({ followingCount: schema.users.followingCount })
        .from(schema.users)
        .where(eq(schema.users.id, session.user.id))
        .limit(1)

      await db
        .update(schema.users)
        .set({ followingCount: currentUser[0].followingCount + 1 })
        .where(eq(schema.users.id, session.user.id))

      return NextResponse.json({
        following: true,
        followerCount: userToFollow[0].followerCount + 1,
        message: 'Followed successfully'
      })
    }

  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json(
      { error: 'Failed to process follow request' },
      { status: 500 }
    )
  }
}
