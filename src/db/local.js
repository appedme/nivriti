import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });

// Initialize database with basic tables
function initDatabase() {
    try {
        // Create users table first
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT NOT NULL,
                emailVerified INTEGER,
                image TEXT,
                username TEXT UNIQUE,
                bio TEXT,
                website TEXT,
                location TEXT,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
            );
        `);

        // Create stories table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS stories (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                excerpt TEXT,
                content TEXT,
                cover_image TEXT,
                tags TEXT,
                is_published INTEGER NOT NULL DEFAULT 0,
                read_time TEXT,
                like_count INTEGER NOT NULL DEFAULT 0,
                comment_count INTEGER NOT NULL DEFAULT 0,
                view_count INTEGER NOT NULL DEFAULT 0,
                author_id TEXT NOT NULL,
                is_multi_chapter INTEGER NOT NULL DEFAULT 0,
                chapter_count INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // Create chapters table
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS chapters (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                order_index INTEGER NOT NULL,
                story_id TEXT NOT NULL,
                is_published INTEGER NOT NULL DEFAULT 0,
                read_time TEXT,
                view_count INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
            );
        `);

        // Create other required tables
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                story_id TEXT NOT NULL,
                author_id TEXT NOT NULL,
                parent_id INTEGER,
                like_count INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
            );
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

initDatabase();
