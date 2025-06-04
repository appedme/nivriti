import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getDB, schema } from "@/db"
import { eq } from "drizzle-orm"

// For development, we'll use JWT sessions to avoid database initialization issues
// In production, you might want to switch back to database sessions
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === 'google') {
                    const db = getDB();
                    
                    // Check if user already exists
                    const existingUser = await db
                        .select()
                        .from(schema.users)
                        .where(eq(schema.users.email, user.email))
                        .limit(1);
                    
                    if (existingUser.length === 0) {
                        // Create user if doesn't exist
                        await db.insert(schema.users).values({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        });
                    }
                }
                return true;
            } catch (error) {
                console.error('Error during sign in:', error);
                return true; // Continue with sign-in even if database operation fails
            }
        },
        session: ({ session, token }) => {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    trustHost: true,
})
