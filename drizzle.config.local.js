import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.js',
    out: './drizzle/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/db.sqlite',
    },
});
