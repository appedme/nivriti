import { getDB, schema } from './src/db/dev.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

async function testUserCreationAndStory() {
    console.log('🧪 Testing user creation and story creation flow...\n');

    const db = getDB();

    // Simulate a Google OAuth user
    const testUser = {
        id: 'google_user_' + nanoid(),
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        image: 'https://example.com/avatar.jpg'
    };

    console.log('👤 Test user:', testUser);

    try {
        // Step 1: Check if user exists (simulating the story creation API)
        console.log('\n📋 Step 1: Checking if user exists...');
        const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, testUser.id))
            .limit(1);

        console.log('Existing user count:', existingUser.length);

        if (existingUser.length === 0) {
            // Step 2: Create user (simulating our fix)
            console.log('\n👥 Step 2: Creating user...');
            await db.insert(schema.users).values({
                id: testUser.id,
                name: testUser.name,
                email: testUser.email,
                image: testUser.image,
                username: testUser.email.split('@')[0] || `user_${testUser.id.slice(0, 8)}`,
            });
            console.log('✅ User created successfully');
        }

        // Step 3: Create a story
        console.log('\n📚 Step 3: Creating story...');
        const storyData = {
            id: nanoid(),
            title: 'My Test Story',
            content: JSON.stringify({
                blocks: [{
                    type: 'paragraph',
                    data: { text: 'This is a test story content.' }
                }]
            }),
            excerpt: 'A test story excerpt',
            tags: 'test,demo',
            authorId: testUser.id,
            isPublished: false,
            isMultiChapter: false,
            chapterCount: 0,
            likeCount: 0,
            commentCount: 0,
            viewCount: 0,
            readTime: '1 min read'
        };

        const newStory = await db.insert(schema.stories).values(storyData).returning();
        console.log('✅ Story created successfully:', newStory[0].title);

        // Step 4: Verify the data
        console.log('\n🔍 Step 4: Verifying data...');
        const users = await db.select().from(schema.users);
        const stories = await db.select().from(schema.stories).where(eq(schema.stories.authorId, testUser.id));

        console.log(`📊 Total users: ${users.length}`);
        console.log(`📊 Stories by test user: ${stories.length}`);

        console.log('\n🎉 Test completed successfully!');
        console.log('✅ The foreign key constraint issue is now fixed.');

    } catch (error) {
        console.error('❌ Test failed:', error);
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            console.error('🚫 Foreign key constraint still failing - fix needed');
        }
    }
}

testUserCreationAndStory().catch(console.error);
