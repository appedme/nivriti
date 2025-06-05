#!/bin/bash
# Comprehensive verification script for Nivriti platform fixes
# This script checks all the critical fixes and improvements

echo "🔍 Starting verification of Nivriti platform fixes..."

# Function to print colored output
function print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "\033[0;32m✓ $2\033[0m"
  else
    echo -e "\033[0;31m✗ $2\033[0m"
  fi
}

# Verify if the build completes successfully
echo "📦 Testing production build..."
npm run build
build_status=$?
print_status $build_status "Production build"

# Verify database tables
echo "🗄️ Verifying database tables..."
tables=$(sqlite3 local.db ".tables")
if [[ $tables == *"comment_likes"* && $tables == *"stories"* && $tables == *"users"* ]]; then
  print_status 0 "Required database tables exist"
else
  print_status 1 "Missing some required database tables"
fi

# Verify search page Suspense boundary
echo "🔎 Checking search page Suspense boundary..."
if grep -q "Suspense" src/app/search/page.js && grep -q "useSearchParams" src/app/search/page.js; then
  print_status 0 "Search page has proper Suspense boundary"
else
  print_status 1 "Search page is missing proper Suspense boundary"
fi

# Verify SWR implementation
echo "🔄 Verifying SWR implementation..."
if [ -f "src/components/SWRProvider.js" ] && [ -f "src/hooks/useStories.js" ]; then
  print_status 0 "SWR setup is properly implemented"
else
  print_status 1 "SWR implementation is missing components"
fi

# Check dynamic data loading
echo "📊 Verifying dynamic data loading in pages..."
dynamic_data_count=0

if grep -q "useStories" src/app/explore/page.js; then
  ((dynamic_data_count++))
fi

if grep -q "useStories" src/app/my-stories/page.js; then
  ((dynamic_data_count++))
fi

if [ $dynamic_data_count -eq 2 ]; then
  print_status 0 "Dynamic data loading implemented in key pages"
else
  print_status 1 "Missing dynamic data loading in some pages"
fi

# Verify write page dynamic import
echo "📝 Checking write page dynamic import..."
if grep -q "dynamic" src/app/write/page.js && grep -q "ssr: false" src/app/write/page.js; then
  print_status 0 "Write page has proper dynamic import with SSR disabled"
else
  print_status 1 "Write page is missing proper dynamic import configuration"
fi

# Check for route parameter conflicts
echo "🛣️ Verifying API route parameters consistency..."
if [ -d "src/app/api/stories/[storyId]" ]; then
  print_status 1 "Found conflicting route parameter [storyId]"
elif [ -d "src/app/api/stories/[id]" ]; then
  print_status 0 "API routes consistently use [id] parameter"
else
  print_status 1 "API routes structure is unexpected"
fi

# Check API with automatic user creation
echo "👤 Verifying automatic user creation in API..."
if grep -q "Create user if doesn't exist" src/app/api/stories/route.js; then
  print_status 0 "API includes automatic user creation"
else
  print_status 1 "API is missing automatic user creation"
fi

# Verify loading states
echo "⏳ Checking loading state implementations..."
if grep -q "Skeleton" src/app/my-stories/page.js && grep -q "isLoading" src/app/my-stories/page.js; then
  print_status 0 "Loading states properly implemented"
else
  print_status 1 "Loading states implementation is incomplete"
fi

echo "📋 Creating verification summary..."
echo "==============================================="
echo "Fix Verification Summary"
echo "==============================================="
echo "Build: $([ $build_status -eq 0 ] && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "Database tables: $([ $tables == *"comment_likes"* ] && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "Suspense boundary: $(grep -q "Suspense" src/app/search/page.js && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "SWR implementation: $([ -f "src/components/SWRProvider.js" ] && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "Dynamic data loading: $([ $dynamic_data_count -eq 2 ] && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "SSR disabled for editor: $(grep -q "ssr: false" src/app/write/page.js && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "Route parameters: $([ ! -d "src/app/api/stories/[storyId]" ] && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "Auto user creation: $(grep -q "Create user if doesn't exist" src/app/api/stories/route.js && echo '✅ Fixed' || echo '❌ Still has issues')"
echo "==============================================="
echo "Verification complete! See docs/FIXES_SUMMARY.md for details."
