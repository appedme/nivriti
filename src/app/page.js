import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import StoryFeed from '@/components/home/StoryFeed'
import { auth } from '@/lib/auth'

export default async function Home() {
  // Get actual user session
  const session = await auth()
  const user = session?.user || null

  return (
    <Layout user={user}>
      <HeroSection />
      <StoryFeed />
    </Layout>
  )
}
