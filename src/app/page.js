import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import StoryFeed from '@/components/home/StoryFeed'

export default function Home() {
  // Mock user data - replace with actual auth
  const user = null // or actual user data from auth

  return (
    <Layout user={user}>
      <HeroSection />
      <StoryFeed />
    </Layout>
  )
}
