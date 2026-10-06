import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  secondaryKeywords: string[]
  author: string
  date: string
  category: string
  schema: string[]
  whatsappCta: string
  heroImage: string
  heroAlt: string
  ogImage: string
  telephone: string
  /** ISO 8601 start time, for Event schema (e.g. watch parties). Optional. */
  eventStart?: string
  /** Ticket price in KES, for Event schema Offer. Optional. */
  eventPrice?: string
  /** Rendered HTML for the body, with the leading H1 removed (rendered separately). */
  html: string
  /** Q&As extracted from the "Frequently asked questions" section, for FAQPage schema. */
  faqs: BlogFaq[]
  readingMinutes: number
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** A Marked instance with heading ids, figure-wrapped images, and safe external links. */
function createRenderer() {
  const marked = new Marked({ gfm: true, breaks: false })

  marked.use({
    renderer: {
      heading(text: string, level: number) {
        const id = slugify(text)
        return `<h${level} id="${id}">${text}</h${level}>\n`
      },
      image(href: string, title: string | null | undefined, text: string) {
        const alt = text || ''
        const t = title ? ` title="${title}"` : ''
        return (
          `<figure class="post-figure">` +
          `<img src="${href}" alt="${alt}"${t} loading="lazy" decoding="async" width="1050" height="1400" />` +
          `</figure>`
        )
      },
      link(href: string, title: string | null | undefined, text: string) {
        const t = title ? ` title="${title}"` : ''
        const external = /^https?:\/\//.test(href)
        const rel = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `<a href="${href}"${t}${rel}>${text}</a>`
      },
    },
  })

  return marked
}

function extractFaqs(markdown: string): BlogFaq[] {
  const faqs: BlogFaq[] = []
  // Grab everything under the FAQ heading up to the next H2.
  const section = markdown.split(/^##\s+Frequently asked questions\s*$/im)[1]
  if (!section) return faqs
  const body = section.split(/^##\s+/m)[0]
  // Q&A pairs: a bold line (the question) followed by the next non-empty line (the answer).
  const re = /^\*\*(.+?)\*\*\s*\n+([^\n*][^\n]*)/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    const question = m[1].trim()
    // Keep the raw inline markdown (links, bold) — the page renders it and the
    // FAQPage schema strips it to plain text at build time.
    faqs.push({ question, answer: m[2].trim() })
  }
  return faqs
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getPost(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null

  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = matter(raw)

  const marked = createRenderer()
  // Drop the first H1 — the template renders the title itself so the page has exactly one.
  const bodyWithoutH1 = content.replace(/^\s*#\s+.+\r?\n/, '')
  const html = (marked.parse(bodyWithoutH1) as string)
    // marked wraps block-level images in <p>; our custom renderer emits <figure>,
    // which is invalid inside <p>. Unwrap so the markup is clean.
    .replace(/<p>\s*(<figure class="post-figure">[\s\S]*?<\/figure>)\s*<\/p>/g, '$1')

  const words = content.split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.round(words / 200))

  return {
    slug,
    title: String(data.title ?? ''),
    metaTitle: String(data.meta_title ?? data.title ?? ''),
    metaDescription: String(data.meta_description ?? ''),
    focusKeyword: String(data.focus_keyword ?? ''),
    secondaryKeywords: toArray(data.secondary_keywords),
    author: String(data.author ?? 'Giles Leshan'),
    date: String(data.date ?? ''),
    category: String(data.category ?? ''),
    schema: toArray(data.schema),
    whatsappCta: String(data.whatsapp_cta ?? ''),
    heroImage: String(data.hero_image ?? ''),
    heroAlt: String(data.hero_alt ?? ''),
    ogImage: String(data.og_image ?? data.hero_image ?? ''),
    telephone: String(data.telephone ?? ''),
    eventStart: data.event_start ? String(data.event_start) : undefined,
    eventPrice: data.event_price ? String(data.event_price) : undefined,
    html,
    faqs: extractFaqs(content),
    readingMinutes,
  }
}

export function getAllPosts(): BlogPost[] {
  return getPostSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
