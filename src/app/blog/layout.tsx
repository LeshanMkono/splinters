import { PublicNav } from '@/components/layout/PublicNav'
import { Footer } from '@/components/layout/Footer'
import './blog.css'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="blog-root">{children}</main>
      <Footer />
    </>
  )
}
