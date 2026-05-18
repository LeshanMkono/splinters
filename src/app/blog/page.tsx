'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0A0A0A',
  orange: '#E8570C',
  text: '#F5F2EE',
  muted: '#999',
  card: '#111',
  border: '#222',
  green: '#4CAF50',
};

/* ── Placeholder blog posts ─────────────────────────────── */
const STORIES = [
  {
    id: 1, tag: 'COURTS', isNew: true,
    title: 'Best Basketball Courts in Nairobi 2026',
    excerpt: 'We visited all 31 verified courts across 13 districts to bring you the definitive guide to hooping in Nairobi this year.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80',
    date: 'May 15, 2026', readTime: '8 min read', slug: 'best-basketball-courts-nairobi-2026',
  },
  {
    id: 2, tag: 'PADEL', isNew: true,
    title: 'Where to Play Padel in Nairobi — Complete Guide',
    excerpt: 'Padel is exploding across Nairobi. Here are the 17 best venues, from Karen to Westlands, with pricing and booking info.',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80',
    date: 'May 10, 2026', readTime: '6 min read', slug: 'padel-nairobi-complete-guide',
  },
  {
    id: 3, tag: 'DISTRICT', isNew: false,
    title: 'Westlands Basketball Scene: Courts, Runs & Community',
    excerpt: 'Westlands has the most competitive pickup basketball in Nairobi. Here\'s where to find a game on any day of the week.',
    image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=700&q=80',
    date: 'May 5, 2026', readTime: '5 min read', slug: 'basketball-courts-westlands',
  },
];

const TRENDING = [
  { rank: 1, title: 'How to Find Pickup Basketball Games in Nairobi', tag: 'GUIDES', slug: 'find-pickup-basketball-nairobi' },
  { rank: 2, title: 'Kasarani Basketball Courts — Full District Guide', tag: 'DISTRICT', slug: 'basketball-courts-kasarani' },
  { rank: 3, title: 'Indoor vs Outdoor Basketball in Nairobi — Which is Better?', tag: 'ANALYSIS', slug: 'indoor-vs-outdoor-nairobi' },
  { rank: 4, title: 'Padel vs Tennis — Which Should You Pick Up in 2026?', tag: 'PADEL', slug: 'padel-vs-tennis-nairobi' },
  { rank: 5, title: 'Splinters Elite Membership — Is It Worth It?', tag: 'MEMBERSHIP', slug: 'splinters-elite-membership-review' },
];

/* ── Postseason highlight images ─────────────────────────── */
const HIGHLIGHTS = [
  { id: 1, caption: 'Cavs Advance to East Finals', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80' },
  { id: 2, caption: 'SGA Wins Back-to-Back MVP', img: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&q=80' },
  { id: 3, caption: 'Playoff Intensity Hits New High', img: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80' },
  { id: 4, caption: 'Thunder Make Deep Playoff Run', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80' },
  { id: 5, caption: 'West Finals Set to Begin', img: 'https://images.unsplash.com/photo-1551958219-acbc595d8ae6?w=600&q=80' },
  { id: 6, caption: 'The Road to the Finals', img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80' },
];

/* ── Must-Watch video IDs — swap these out any time ─────── */
const VIDEOS = [
  { id: 'WFpHKe37NOI', title: 'Mitchell Drops 26 in Game 7' },
  { id: '5Bv-BXHX4fk', title: 'Allen Seals Game 7 With 23 Pts' },
  { id: '7dSPuqMTt2g', title: 'SGA\'s MVP Season Best Moments' },
  { id: 'ooZpruO5ACQ', title: 'Cavs vs Pistons — Full Highlights' },
];

function TagBadge({ label, color = C.orange }: { label: string; color?: string }) {
  return (
    <span style={{ background: color, color: '#fff', fontSize: 10, fontWeight: 700,
      letterSpacing: 1, padding: '3px 8px', borderRadius: 3, fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </span>
  );
}

function NewBadge() {
  return (
    <span style={{ background: '#fff', color: '#000', fontSize: 10, fontWeight: 900,
      letterSpacing: 1, padding: '3px 8px', borderRadius: 3, fontFamily: 'DM Sans, sans-serif' }}>
      NEW
    </span>
  );
}

export default function BlogPage() {
  const [nbaNews, setNbaNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState('');

  useEffect(() => {
    fetch('/api/nba-news')
      .then(r => r.json())
      .then(d => {
        setNbaNews(d.news || []);
        if (d.fetched) setLastFetched(new Date(d.fetched).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${C.border}`, padding: '60px 24px 40px', textAlign: 'center' }}>
        <p style={{ color: C.orange, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>
          SPLINTERS BLOG
        </p>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(42px, 7vw, 80px)',
          letterSpacing: 2, margin: 0, lineHeight: 1 }}>
          COURT CULTURE.<br />
          <span style={{ color: C.orange }}>NAIROBI STORIES.</span>
        </h1>
        <p style={{ color: C.muted, marginTop: 16, maxWidth: 480, margin: '16px auto 0', lineHeight: 1.6 }}>
          Basketball courts, padel guides, pickup game intel and everything in between.
        </p>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* ── STORIES ──────────────────────────────────────── */}
        <section style={{ padding: '48px 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, margin: 0 }}>
              📰 STORIES
            </h2>
            <Link href="/blog/all" style={{ color: C.orange, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', letterSpacing: 1 }}>SEE ALL →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {STORIES.map(s => (
              <article key={s.id} style={{ background: C.card, borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
                    {s.isNew && <NewBadge />}
                    <TagBadge label={s.tag} />
                  </div>
                </div>
                <div style={{ padding: '20px 20px 24px' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 1,
                    margin: '0 0 10px', lineHeight: 1.2 }}>{s.title}</h3>
                  <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{s.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: C.muted }}>{s.date}</span>
                    <span style={{ fontSize: 12, color: C.orange, fontWeight: 600 }}>{s.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── TRENDING ─────────────────────────────────────── */}
        <section style={{ padding: '40px 0', borderTop: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, marginBottom: 20 }}>
            🔥 TRENDING NOW
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {TRENDING.map(t => (
              <div key={t.rank} style={{ display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', background: C.card, borderRadius: 10, border: `1px solid ${C.border}`,
                cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.orange)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: C.border, minWidth: 32 }}>
                  {String(t.rank).padStart(2, '0')}
                </span>
                <div>
                  <TagBadge label={t.tag} color="#333" />
                  <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NBA NEWS ─────────────────────────────────────── */}
        <section style={{ padding: '40px 0', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, margin: 0 }}>
                🏀 NBA NEWS
              </h2>
              {lastFetched && (
                <p style={{ color: C.muted, fontSize: 12, margin: '4px 0 0' }}>
                  Auto-updates every 4 hours · Last fetched {lastFetched}
                </p>
              )}
            </div>
            <a href="https://www.nba.com/news" target="_blank" rel="noopener noreferrer"
              style={{ color: C.orange, fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: 1 }}>
              NBA.COM →
            </a>
          </div>

          {newsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ background: C.card, borderRadius: 10, height: 200,
                  border: `1px solid ${C.border}`, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : nbaNews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {nbaNews.map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{ background: C.card, borderRadius: 10, overflow: 'hidden',
                    border: `1px solid ${C.border}`, height: '100%',
                    transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = C.orange)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                    {item.image && (
                      <img src={item.image} alt={item.title}
                        style={{ width: '100%', height: 150, objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div style={{ padding: 16 }}>
                      <TagBadge label="NBA" />
                      <p style={{ fontWeight: 700, fontSize: 14, margin: '10px 0 8px', lineHeight: 1.4 }}>
                        {item.title}
                      </p>
                      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted }}>
              <p>NBA news unavailable right now — <a href="https://www.nba.com/news" target="_blank"
                rel="noopener noreferrer" style={{ color: C.orange }}>visit NBA.com directly</a></p>
            </div>
          )}
        </section>

        {/* ── POSTSEASON HIGHLIGHTS ────────────────────────── */}
        <section style={{ padding: '40px 0', borderTop: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, marginBottom: 20 }}>
            📸 2026 POSTSEASON HIGHLIGHTS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {HIGHLIGHTS.map(h => (
              <div key={h.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden',
                aspectRatio: '16/10', cursor: 'pointer' }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if(img) img.style.transform = 'scale(1.06)'; }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if(img) img.style.transform = 'scale(1)'; }}>
                <img src={h.img} alt={h.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '24px 14px 14px' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>{h.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>
            ✏️ To update these images, edit the HIGHLIGHTS array in <code style={{ color: C.orange }}>src/app/blog/page.tsx</code>
          </p>
        </section>

        {/* ── MUST WATCH VIDEOS ────────────────────────────── */}
        <section style={{ padding: '40px 0 80px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, margin: 0 }}>
              🎬 MUST WATCH
            </h2>
            <span style={{ color: C.muted, fontSize: 12 }}>Updated manually · swap IDs in VIDEOS array</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {VIDEOS.map(v => (
              <div key={v.id}>
                <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
                <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: 14 }}>{v.title}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
