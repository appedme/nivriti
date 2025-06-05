#!/bin/bash

echo "Testing story creation fix..."

# Test 1: Check current users in database
echo "=== Current users in database ==="
sqlite3 local.db "SELECT id, email, name FROM users;"

# Test 2: Create a test story using the API (this should create the user automatically now)
echo ""
echo "=== Testing story creation API ==="

# First, let's test without authentication (should fail with 401)
curl -X POST http://localhost:3000/api/stories \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Story",
    "content": "{\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"This is a test story content.\"}}]}",
    "excerpt": "A test story",
    "tags": ["test"],
    "isPublished": false
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "✓ Test completed - Expected 401 Unauthorized"
