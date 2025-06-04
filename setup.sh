#!/bin/bash

# Cloudflare D1 Setup Script for Nivrita Todo App

echo "🚀 Setting up Cloudflare D1 for Nivrita Todo App..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please log in to Cloudflare:"
    wrangler login
fi

# Create D1 database if it doesn't exist
echo "📊 Creating D1 database..."
DATABASE_OUTPUT=$(wrangler d1 create nivrita-todo-db 2>/dev/null || echo "Database might already exist")

if [[ $DATABASE_OUTPUT == *"already exists"* ]]; then
    echo "✅ Database already exists"
else
    echo "✅ Database created successfully"
    echo "📝 Please update your wrangler.jsonc with the database_id from above"
fi

# Generate and apply migrations
echo "🗃️ Generating database migrations..."
npm run db:generate

echo "🔄 Applying migrations to local database..."
npm run db:migrate:local

echo "🌐 To deploy to production, run:"
echo "  1. npm run db:migrate:remote"
echo "  2. npm run deploy"

echo "✅ Setup complete! Your todo app is ready for development."
echo "🔗 Start dev server with: npm run dev"
