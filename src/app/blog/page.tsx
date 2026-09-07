import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

const SITE = 'https://splinters.co.ke'

export const metadata: Metadata = {
  title: 'The Home Crowd Blog | Sports Bar in Westlands, Nairobi',
  description:
    'Match guides, watch-party line-ups and community news from District 6 Sports Bar — Westlands’ home for sports fans, by The Home Crowd.',
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    type: 'website',
    url: `${SITE}/blog`,
    title: 'The Home Crowd Blog | Sports Bar in Westlands, Nairobi',
    description:
      'Match guides, watch-party line-ups and community news from District 6 Sports Bar, Westlands.',
    siteName: 'Splinters',
    locale: 'en_KE',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="blog-index">
      <div className="blog-index__head">
        <h1>The Home Crowd</h1>
        <p>
          Match guides, watch-party line-ups and community news from{' '}
          <strong>District 6 Sports Bar</strong> — Westlands&apos; home for sports fans.
          Exclusive experience, open community.
        </p>
      </div>

      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
          <div className="blog-card__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.heroImage} alt={post.heroAlt} loading="lazy" />
          </div>
          <div className="blog-card__body">
            <span className="blog-card__cat">{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.metaDescription}</p>
            <span className="blog-card__meta">
              {post.author} ·{' '}
              {post.date
                ? new Date(post.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
