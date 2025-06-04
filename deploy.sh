#!/bin/bash

# Cloudflare D1 Todo App Deployment Script

echo "🚀 Deploying Nivrita Todo App to Cloudflare..."

# Step 1: Generate database migrations
echo "📊 Generating database migrations..."
npx drizzle-kit generate

# Step 2: Apply migrations to remote D1 database
echo "🗃️ Applying migrations to remote D1 database..."
npx wrangler d1 migrations apply nivrita-todo-db --remote

# Step 3: Build and deploy the application
echo "🏗️ Building and deploying application..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Your todo app should be available at your Cloudflare Workers domain"
