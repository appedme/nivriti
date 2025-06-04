'use client'

import { useSession } from 'next-auth/react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, user: propUser }) {
  const { data: session } = useSession()
  // Use session user if no user prop is passed, or use the prop user
  const user = propUser || session?.user || null

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
