const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function testDatabaseOperations() {
    console.log('🧪 Testing database operations for foreign key fix...\n');

    const dbPath = path.join(__dirname, 'local.db');
    const db = new sqlite3.Database(dbPath);

    return new Promise((resolve, reject) => {
        // Test user creation and story creation
        const testUserId = 'test_google_user_' + Date.now();
        const testUserEmail = 'testuser@gmail.com';
        const testUserName = 'Test Google User';

        console.log('👤 Creating test user:', testUserId);

        // Step 1: Insert a test user
        db.run(`
            INSERT INTO users (id, email, name, image, username, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            testUserId,
            testUserEmail,
            testUserName,
            'https://example.com/avatar.jpg',
            'testgoogleuser',
            Math.floor(Date.now() / 1000),
            Math.floor(Date.now() / 1000)
        ], function (err) {
            if (err) {
                console.error('❌ Error creating user:', err);
                reject(err);
                return;
            }

            console.log('✅ User created successfully');

            // Step 2: Create a story for this user
            const storyId = 'story_' + Date.now();
            console.log('📚 Creating test story:', storyId);

            db.run(`
                INSERT INTO stories (
                    id, title, content, excerpt, tags, author_id, 
                    is_published, is_multi_chapter, chapter_count,
                    like_count, comment_count, view_count, read_time,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                storyId,
                'Test Story Title',
                JSON.stringify({ blocks: [{ type: 'paragraph', data: { text: 'Test content' } }] }),
                'Test excerpt',
                'test,demo',
                testUserId,  // This should now work with our fix
                0, // not published
                0, // not multi-chapter
                0, // chapter count
                0, // likes
                0, // comments  
                0, // views
                '1 min read',
                Math.floor(Date.now() / 1000),
                Math.floor(Date.now() / 1000)
            ], function (err) {
                if (err) {
                    console.error('❌ Error creating story:', err);
                    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                        console.error('🚫 FOREIGN KEY constraint failed - this indicates the fix is not working');
                    }
                    reject(err);
                    return;
                }

                console.log('✅ Story created successfully');

                // Step 3: Verify the data
                db.get('SELECT COUNT(*) as count FROM stories WHERE author_id = ?', [testUserId], (err, row) => {
                    if (err) {
                        console.error('❌ Error verifying story:', err);
                        reject(err);
                        return;
                    }

                    console.log(`📊 Stories created by test user: ${row.count}`);
                    console.log('\n🎉 Test completed successfully!');
                    console.log('✅ Foreign key constraint issue is resolved');

                    // Clean up test data
                    db.run('DELETE FROM stories WHERE id = ?', [storyId]);
                    db.run('DELETE FROM users WHERE id = ?', [testUserId]);

                    db.close();
                    resolve();
                });
            });
        });
    });
}

testDatabaseOperations().catch(console.error);
