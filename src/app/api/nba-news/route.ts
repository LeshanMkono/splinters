import { NextResponse } from 'next/server';

export const revalidate = 14400; // 4 hours

export async function GET() {
  try {
    const res = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nba.com%2Fnews%2Frss.xml&api_key=public&count=8',
      { next: { revalidate: 14400 } }
    );
    if (!res.ok) throw new Error('RSS fetch failed');
    const data = await res.json();

    const news = (data.items || []).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      description: (item.description || '')
        .replace(/<[^>]*>/g, '')
        .slice(0, 130)
        .trim() + '...',
      image: item.thumbnail || item.enclosure?.link || '',
      author: item.author || 'NBA',
    })).filter((i: any) => i.title);

    return NextResponse.json({ news, fetched: new Date().toISOString() });
  } catch {
    return NextResponse.json({ news: [], error: 'Could not load NBA news' }, { status: 200 });
  }
}
