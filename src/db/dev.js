// Database connection utility for development
import { db as localDb } from './local.js';

// Use local database for development
export function getDB() {
    return localDb;
}

export * as schema from './schema.js';
