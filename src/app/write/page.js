'use client';

import dynamic from 'next/dynamic'

// Dynamically import WriteStory to avoid SSR issues with Editor.js
const WriteStory = dynamic(() => import('@/components/write/WriteStory'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading editor...</p>
      </div>
    </div>
  )
})

export default function WritePage() {
  return <WriteStory />
}
