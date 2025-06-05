import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDatabase() {
    const dbPath = path.join(__dirname, 'local.db');
    const db = new sqlite3.Database(dbPath);
    
    console.log('Testing database operations...');
    
    // Test 1: Check if all required tables exist
    const tables = ['users', 'stories', 'likes', 'bookmarks', 'comments', 'comment_likes'];
    
    for (const table of tables) {
        await new Promise((resolve, reject) => {
            db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [table], (err, row) => {
                if (err) {
                    console.error(`❌ Error checking table ${table}:`, err);
                    reject(err);
                } else if (row) {
                    console.log(`✅ Table ${table} exists`);
                    resolve(row);
                } else {
                    console.log(`❌ Table ${table} does not exist`);
                    resolve(null);
                }
            });
        });
    }
    
    // Test 2: Check stories and their like counts
    await new Promise((resolve, reject) => {
        db.all('SELECT id, title, like_count FROM stories LIMIT 3', (err, rows) => {
            if (err) {
                console.error('❌ Error fetching stories:', err);
                reject(err);
            } else {
                console.log('\n📚 Stories in database:');
                rows.forEach(row => {
                    console.log(`  - ${row.title} (ID: ${row.id}, Likes: ${row.like_count})`);
                });
                resolve(rows);
            }
        });
    });
    
    // Test 3: Check likes table
    await new Promise((resolve, reject) => {
        db.all('SELECT * FROM likes LIMIT 5', (err, rows) => {
            if (err) {
                console.error('❌ Error fetching likes:', err);
                reject(err);
            } else {
                console.log(`\n❤️  Total likes in database: ${rows.length}`);
                resolve(rows);
            }
        });
    });
    
    // Test 4: Check comment_likes table
    await new Promise((resolve, reject) => {
        db.all('SELECT * FROM comment_likes LIMIT 5', (err, rows) => {
            if (err) {
                console.error('❌ Error fetching comment_likes:', err);
                reject(err);
            } else {
                console.log(`\n💬 Total comment likes in database: ${rows.length}`);
                resolve(rows);
            }
        });
    });
    
    console.log('\n✅ Database test completed successfully!');
    db.close();
}

testDatabase().catch(console.error);
