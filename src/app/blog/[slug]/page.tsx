import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, getPostSlugs, type BlogPost } from '@/lib/blog'

const SITE = 'https://splinters.co.ke'

// Canonical Google Business Profile URL (CID form) for the Splinters / The Home
// Crowd listing — resolved from the share.google shortlink, stored as the stable
// maps?cid= URL rather than the shortlink.
const GOOGLE_BUSINESS_URL = 'https://www.google.com/maps?cid=13874736067324399768'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  const url = `${SITE}/blog/${post.slug}`
  const ogImage = `${SITE}${post.ogImage}`

  return {
    // absolute → suppress the site-wide "%s | Splinters Basketball" template so
    // the <title> stays at the brief's <60-char meta_title.
    title: { absolute: post.metaTitle },
    description: post.metaDescription,
    keywords: [post.focusKeyword, ...post.secondaryKeywords],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      siteName: 'Splinters',
      locale: 'en_KE',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.heroAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [ogImage],
    },
  }
}

/** Minimal inline-markdown → HTML for FAQ answers: links + bold only. */
function renderAnswer(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

function buildLocalBusinessSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': ['BarOrPub', 'LocalBusiness'],
    name: 'District 6 Sports Bar',
    description:
      'Westlands sports bar inside Hyatt Regency Nairobi. Live football, rugby, basketball, cricket, hockey, athletics and boxing on the big screens, pool tables, and happy hour every day from 5pm to 8pm. Home of Full Court Jam by The Home Crowd.',
    url: `${SITE}/blog/${post.slug}`,
    telephone: post.telephone,
    image: `${SITE}${post.ogImage}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hyatt Regency Nairobi, Muthithi Road, 6th Floor, Westlands',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi',
      addressCountry: 'KE',
    },
    brand: { '@type': 'Brand', name: 'The Home Crowd' },
    containedInPlace: { '@type': 'Hotel', name: 'Hyatt Regency Nairobi' },
    sameAs: [GOOGLE_BUSINESS_URL],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Live sport on big screens', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pool tables', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Full bar', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Daily happy hour 5pm–8pm', value: true },
    ],
  }
}

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim()
}

function buildFaqSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(f.answer) },
    })),
  }
}

function buildArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: [`${SITE}${post.ogImage}`],
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'The Home Crowd',
      logo: { '@type': 'ImageObject', url: `${SITE}/splinters-logo.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
  }
}

function buildEventSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: post.title,
    startDate: post.eventStart,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'District 6 Sports Bar',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Hyatt Regency Nairobi, Muthithi Road, 6th Floor, Westlands',
        addressLocality: 'Nairobi',
        addressRegion: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    image: [`${SITE}${post.ogImage}`],
    description: post.metaDescription,
    organizer: { '@type': 'Organization', name: 'The Home Crowd', url: SITE },
    offers: post.eventPrice
      ? {
          '@type': 'Offer',
          price: post.eventPrice,
          priceCurrency: 'KES',
          availability: 'https://schema.org/InStock',
          // MTICKETS LINK GOES HERE — swap for the real mTickets checkout URL once it's live.
          url: `${SITE}/blog/${post.slug}`,
        }
      : undefined,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  // Split the rendered body: main content / FAQ section / closing CTA section.
  const [mainHtml] = post.html.split('<h2 id="frequently-asked-questions">')

  const dateLabel = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const whatsapp = post.whatsappCta

  return (
    <>
      {post.schema.includes('LocalBusiness') && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessSchema(post)) }}
        />
      )}
      {post.schema.includes('Article') && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(post)) }}
        />
      )}
      {post.schema.includes('Event') && post.eventStart && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventSchema(post)) }}
        />
      )}
      {post.schema.includes('FAQPage') && post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(post)) }}
        />
      )}

      <header className="blog-hero">
        <div className="blog-hero__inner">
          <span className="blog-hero__kicker">{post.category} · The Home Crowd</span>
          <h1>{post.title}</h1>
          <div className="blog-hero__meta">
            <span>By {post.author}</span>
            <span className="dot">•</span>
            <span>{dateLabel}</span>
            <span className="dot">•</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
        <figure className="blog-hero__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroImage}
            alt={post.heroAlt}
            width={1055}
            height={1400}
            fetchPriority="high"
          />
        </figure>
      </header>

      <nav className="blog-crumb" aria-label="Breadcrumb">
        <Link href="/blog">← All posts</Link>
      </nav>

      <article className="blog-article">
        <div
          className="post-prose"
          dangerouslySetInnerHTML={{ __html: mainHtml }}
        />
      </article>

      <section className="blog-faq" aria-labelledby="faq-heading">
        <div className="blog-faq__inner">
          <h2 id="faq-heading">Frequently asked questions</h2>
          {post.faqs.map((f) => (
            <div className="blog-faq__item" key={f.question}>
              <p className="blog-faq__q">{f.question}</p>
              <p
                className="blog-faq__a"
                dangerouslySetInnerHTML={{ __html: renderAnswer(f.answer) }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="blog-cta" aria-labelledby="cta-heading">
        <div className="blog-cta__inner">
          <h2 id="cta-heading">Join the home crowd</h2>
          <p>
            Westlands finally has a home for sports fans — and it&apos;s better with a full
            room. Get on the list, bring your crew, and don&apos;t watch the next big game
            alone.
          </p>
          <a
            className="blog-cta__btn"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Full Court Jam community on WhatsApp
          </a>
          <p className="blog-cta__addr">
            📍 District 6 Sports Bar · Hyatt Regency Nairobi, Westlands · +254 798 631 925
          </p>
          <p className="blog-cta__addr">
            <a href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer">
              Find us on Google Maps →
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
