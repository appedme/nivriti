import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, user }) {
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
