import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const SUPABASE_STORAGE = "https://lnqbfcezakpxmfuejnmp.supabase.co/storage/v1/object/public/courts";
const BASE_URL = "https://splinters.co.ke";

interface CourtData {
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  type: string;
  surface: string;
  keyword: string;
  image?: string;
  features?: string;
}

const COURTS: Record<string, CourtData> = {
  "parklands-sports-club": {
    name: "Parklands Sports Club",
    district: "Westlands",
    address: "49 Parklands Road, Westlands, Nairobi",
    lat: -1.26737, lng: 36.81337,
    rating: 4.8,
    type: "Sports Club",
    surface: "Concrete",
    keyword: "parklands sports club basketball nairobi",
    image: `${SUPABASE_STORAGE}/court-parklands.jpg`,
    features: "Floodlit outdoor court, open to members and guests",
  },
  "kasarani-indoor-basketball-arena": {
    name: "Kasarani Indoor Basketball Arena",
    district: "Kasarani",
    address: "Moi International Sports Centre, Kasarani, Nairobi",
    lat: -1.2197, lng: 36.8963,
    rating: 4.3,
    type: "Indoor Arena",
    surface: "Hardwood",
    keyword: "kasarani indoor basketball arena nairobi",
    image: `${SUPABASE_STORAGE}/court-nairobi-intl.jpg`,
    features: "Full-size indoor hardwood court at Moi Sports Centre",
  },
  "nairobi-international-school": {
    name: "Nairobi International School Basketball Court",
    district: "Lavington",
    address: "Maji Mazuri Road, Lavington, Nairobi",
    lat: -1.28333, lng: 36.76667,
    rating: 4.6,
    type: "School Court",
    surface: "Hardwood",
    keyword: "nairobi international school basketball court lavington",
    image: `${SUPABASE_STORAGE}/court-nairobi-intl.jpg`,
    features: "Indoor hardwood court in Lavington, Nairobi",
  },
  "olive-crescent-school": {
    name: "Olive Crescent School Basketball Court",
    district: "Parklands",
    address: "Kolobot Drive, Parklands, Nairobi",
    lat: -1.259, lng: 36.818,
    rating: 4.4,
    type: "School Court",
    surface: "Concrete",
    keyword: "olive crescent school basketball court parklands nairobi",
    image: `${SUPABASE_STORAGE}/court-olive-crescent.jpg`,
    features: "Outdoor concrete court in Parklands",
  },
  "absa-bank-sports-club": {
    name: "ABSA Bank Sports Club Basketball Court",
    district: "Westlands",
    address: "Utalii Road, Nairobi",
    lat: -1.258, lng: 36.823,
    rating: 4.5,
    type: "Sports Club",
    surface: "Concrete",
    keyword: "absa bank sports club basketball court nairobi",
    features: "Sports club court in Westlands, Nairobi",
  },
  "umoja-2-basketball-court": {
    name: "Umoja 2 Basketball Court",
    district: "Umoja",
    address: "Umoja 2 Estate, Off Moi Drive, Nairobi",
    lat: -1.28, lng: 36.89,
    rating: 4.3,
    type: "Community Court",
    surface: "Concrete",
    keyword: "umoja 2 basketball court nairobi",
    features: "Community outdoor court in Umoja Estate",
  },
  "langata-down-basketball-court": {
    name: "Langata Down Basketball Court",
    district: "Langata",
    address: "Langata Road, Langata, Nairobi",
    lat: -1.3312, lng: 36.7612,
    rating: 4.3,
    type: "Community Court",
    surface: "Concrete",
    keyword: "langata down basketball court nairobi",
    features: "Outdoor community court in Langata",
  },
  "diwopa-basketball-court": {
    name: "Diwopa Basketball Court",
    district: "Nairobi East",
    address: "Nairobi City, Kenya",
    lat: -1.26, lng: 36.88,
    rating: 4.4,
    type: "Community Court",
    surface: "Concrete",
    keyword: "diwopa basketball court nairobi",
    features: "Community basketball court in Nairobi East",
  },
  "usiu-basketball-court": {
    name: "USIU Basketball Court",
    district: "Kasarani",
    address: "USIU Campus, Kasarani, Nairobi",
    lat: -1.218, lng: 36.89,
    rating: 4.4,
    type: "University Court",
    surface: "Hardwood",
    keyword: "usiu basketball court kasarani nairobi",
    features: "University campus court at USIU-Africa, Kasarani",
  },
  "kobe-basketball-court": {
    name: "Kobe Basketball Court",
    district: "Kiungani",
    address: "Kiungani Road, Nairobi",
    lat: -1.38, lng: 36.78,
    rating: 4.5,
    type: "Community Court",
    surface: "Concrete",
    keyword: "kobe basketball court nairobi kiungani",
    features: "Community court named after Kobe Bryant in Kiungani",
  },
  "kq-pride-public-basketball-court": {
    name: "KQ Pride Public Basketball Court",
    district: "Embakasi",
    address: "Nairobi, Kenya",
    lat: -1.29, lng: 36.86,
    rating: 4.3,
    type: "Public Court",
    surface: "Concrete",
    keyword: "kq pride public basketball court nairobi",
    features: "Public outdoor basketball court near Embakasi",
  },
  "st-austins-academy-basketball-court": {
    name: "St Austins Academy Basketball Court",
    district: "Westlands",
    address: "James Gichuru Road, Westlands, Nairobi",
    lat: -1.283, lng: 36.765,
    rating: 4.5,
    type: "School Court",
    surface: "Concrete",
    keyword: "st austins academy basketball court nairobi",
    features: "School court near James Gichuru Road, Westlands",
  },
  "kenya-science-basketball-court": {
    name: "Kenya Science Basketball Court",
    district: "Nairobi CBD",
    address: "Ngara Road, Nairobi CBD, Kenya",
    lat: -1.28, lng: 36.82,
    rating: 4.5,
    type: "Institution Court",
    surface: "Concrete",
    keyword: "kenya science basketball court nairobi",
    features: "Institution court near Ngara, Nairobi CBD",
  },
  "camp-toyoyo-jericho": {
    name: "Camp Toyoyo Jericho Basketball Court",
    district: "Eastleigh",
    address: "Jericho, Eastleigh, Nairobi",
    lat: -1.275, lng: 36.858,
    rating: 4.0,
    type: "Community Court",
    surface: "Concrete",
    keyword: "camp toyoyo basketball court jericho nairobi",
    features: "Outdoor community court in Jericho, Eastleigh",
  },
  "basketball-court-komarock": {
    name: "Basketball Court Komarock",
    district: "Komarock",
    address: "Komarock, Nairobi",
    lat: -1.273, lng: 36.91,
    rating: 3.9,
    type: "Community Court",
    surface: "Concrete",
    keyword: "basketball court komarock nairobi",
    features: "Outdoor community court in Komarock Estate",
  },
  "good-testimony-international-basketball-court": {
    name: "Good Testimony International Basketball Court",
    district: "Nairobi East",
    address: "Nairobi City, Kenya",
    lat: -1.285, lng: 36.875,
    rating: 4.2,
    type: "Community Court",
    surface: "Concrete",
    keyword: "good testimony international basketball court nairobi",
    features: "Community basketball court in Nairobi East",
  },
  "ridgeways-basketball-court": {
    name: "Ridgeways Basketball Court",
    district: "Ridgeways",
    address: "Ridgeways, Nairobi",
    lat: -1.21, lng: 36.85,
    rating: 3.0,
    type: "Community Court",
    surface: "Concrete",
    keyword: "ridgeways basketball court nairobi",
    features: "Community outdoor court in Ridgeways, North Nairobi",
  },
  "karen-gated-basketball-court": {
    name: "Karen Gated Basketball Court",
    district: "Karen",
    address: "Karen, Nairobi",
    lat: -1.33, lng: 36.71,
    rating: 4.7,
    type: "Private Court",
    surface: "Concrete",
    keyword: "karen basketball court nairobi",
    features: "Private gated basketball court in Karen, Nairobi",
  },
  "kibera-community-basketball-court": {
    name: "Kibera Community Basketball Court",
    district: "Kibera",
    address: "Kibera, Nairobi",
    lat: -1.313, lng: 36.786,
    rating: 4.5,
    type: "Community Court",
    surface: "Concrete",
    keyword: "kibera basketball court nairobi",
    features: "Free community court in Kibera — open to all",
  },
  "lenana-school-basketball-court": {
    name: "Lenana School Basketball Court",
    district: "Kilimani",
    address: "Lenana School, Kilimani, Nairobi",
    lat: -1.295, lng: 36.785,
    rating: 3.5,
    type: "School Court",
    surface: "Concrete",
    keyword: "lenana school basketball court nairobi",
    features: "School court at Lenana School, Kilimani",
  },
  "university-of-nairobi-basketball-court": {
    name: "University of Nairobi Basketball Court",
    district: "Nairobi CBD",
    address: "University of Nairobi, CBD, Nairobi",
    lat: -1.279, lng: 36.817,
    rating: 3.0,
    type: "University Court",
    surface: "Hardwood",
    keyword: "university of nairobi basketball court",
    features: "University campus basketball court in Nairobi CBD",
  },
  "braeburn-schools-basketball-court": {
    name: "Braeburn Schools Basketball Court",
    district: "Lavington",
    address: "Lavington, Nairobi",
    lat: -1.279, lng: 36.77,
    rating: 3.2,
    type: "School Court",
    surface: "Hardwood",
    keyword: "braeburn school basketball court nairobi",
    features: "International school court in Lavington, Nairobi",
  },
  "umama-play-ground": {
    name: "Umama Play Ground Basketball Court",
    district: "Nairobi West",
    address: "Nairobi, Kenya",
    lat: -1.28, lng: 36.85,
    rating: 4.2,
    type: "Community Court",
    surface: "Concrete",
    keyword: "umama basketball court nairobi",
    features: "Community playground basketball court in Nairobi",
  },
  "ruiru-secondary-basketball-court": {
    name: "Ruiru Secondary School Basketball Court",
    district: "Ruiru",
    address: "Ruiru, Kiambu County, Kenya",
    lat: -1.15, lng: 36.96,
    rating: 5.0,
    type: "School Court",
    surface: "Concrete",
    keyword: "ruiru secondary basketball court nairobi",
    features: "Top-rated school court in Ruiru — 5.0 stars",
  },
  "basketball-court-james-gichuru": {
    name: "Basketball Court James Gichuru Road",
    district: "Lavington",
    address: "James Gichuru Road, Lavington, Nairobi",
    lat: -1.285, lng: 36.763,
    rating: 4.8,
    type: "Community Court",
    surface: "Concrete",
    keyword: "basketball court james gichuru road nairobi",
    features: "Popular outdoor court on James Gichuru Road",
  },
  "kenya-academy-of-sports-basketball-court": {
    name: "Kenya Academy of Sports Basketball Court",
    district: "Kasarani",
    address: "Kasarani, Nairobi",
    lat: -1.215, lng: 36.895,
    rating: 4.1,
    type: "Academy Court",
    surface: "Hardwood",
    keyword: "kenya academy of sports basketball court kasarani",
    features: "Academy-standard court at Kenya Academy of Sports",
  },
  "basketball-court-melili": {
    name: "Basketball Court Melili Road",
    district: "Upper Hill",
    address: "Melili Road, Nairobi",
    lat: -1.29, lng: 36.81,
    rating: 4.0,
    type: "Community Court",
    surface: "Concrete",
    keyword: "basketball court melili road nairobi",
    features: "Outdoor community court near Upper Hill, Nairobi",
  },
  "taarifa-road-sports-complex": {
    name: "Taarifa Road Sports Complex Basketball Court",
    district: "Nairobi CBD",
    address: "Taarifa Road, Nairobi",
    lat: -1.285, lng: 36.825,
    rating: 3.5,
    type: "Sports Complex",
    surface: "Concrete",
    keyword: "taarifa road sports complex basketball nairobi",
    features: "Sports complex court on Taarifa Road, CBD",
  },
  "uhuru-park-basketball-court": {
    name: "Uhuru Park Basketball Court",
    district: "Nairobi CBD",
    address: "Uhuru Park, Nairobi CBD",
    lat: -1.286, lng: 36.814,
    rating: 3.2,
    type: "Public Court",
    surface: "Concrete",
    keyword: "uhuru park basketball court nairobi",
    features: "Free public court in Uhuru Park, Nairobi CBD",
  },
  "eastleigh-high-school-basketball-court": {
    name: "Eastleigh High School Basketball Court",
    district: "Eastleigh",
    address: "Eastleigh, Nairobi",
    lat: -1.271, lng: 36.852,
    rating: 4.0,
    type: "School Court",
    surface: "Concrete",
    keyword: "eastleigh high school basketball court nairobi",
    features: "School basketball court in Eastleigh, Nairobi",
  },
  "basketball-court-mai-mahiu": {
    name: "Basketball Court Mai Mahiu Road",
    district: "Westlands",
    address: "Mai Mahiu Road, Nairobi",
    lat: -1.265, lng: 36.782,
    rating: 4.3,
    type: "Community Court",
    surface: "Concrete",
    keyword: "basketball court mai mahiu road nairobi",
    features: "Outdoor community court off Mai Mahiu Road",
  },
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const court = COURTS[params.slug];
  if (!court) return { title: "Court Not Found | Splinters" };

  const title = `${court.name} | Basketball Court ${court.district} Nairobi`;
  const description = `Play basketball at ${court.name} — ${court.surface} ${court.type.toLowerCase()} in ${court.district}, Nairobi. ${court.features ?? ""} Verified by Splinters.`.slice(0, 155);
  const ogImage = court.image ?? `${BASE_URL}/splinters-logo.jpg`;
  const canonical = `${BASE_URL}/courts/${params.slug}`;

  return {
    title,
    description,
    keywords: [
      court.keyword,
      `basketball court ${court.district.toLowerCase()} nairobi`,
      `basketball courts nairobi`,
      `${court.surface.toLowerCase()} basketball court nairobi`,
      `where to play basketball ${court.district.toLowerCase()}`,
      `basketball court near me nairobi`,
      `splinters basketball nairobi`,
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Splinters Basketball Nairobi",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${court.name} — Basketball court in ${court.district}, Nairobi`,
        },
      ],
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(COURTS).map((slug) => ({ slug }));
}

export default function CourtPage({ params }: Props) {
  const court = COURTS[params.slug];

  if (!court) {
    return (
      <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏀</div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#E8570C" }}>Court Not Found</h1>
          <Link href="/courts" style={{ color: "#E8570C", textDecoration: "none" }}>← Back to all courts</Link>
        </div>
      </main>
    );
  }

  const courtUrl = `${BASE_URL}/courts/${params.slug}`;

  const sportsSchema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": court.name,
    "description": `${court.surface} basketball ${court.type.toLowerCase()} in ${court.district}, Nairobi, Kenya. ${court.features ?? ""}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": court.address,
      "addressLocality": court.district,
      "addressRegion": "Nairobi",
      "addressCountry": "KE",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": court.lat,
      "longitude": court.lng,
    },
    "sport": "Basketball",
    "url": courtUrl,
    "image": court.image ?? `${BASE_URL}/splinters-logo.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": court.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "10",
    },
    "isAccessibleForFree": true,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Courts", "item": `${BASE_URL}/courts` },
      { "@type": "ListItem", "position": 3, "name": court.district, "item": `${BASE_URL}/courts/district/${court.district.toLowerCase().replace(/\s+/g, "-")}` },
      { "@type": "ListItem", "position": 4, "name": court.name, "item": courtUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" style={{ padding: "5.5rem 1.5rem 0", maxWidth: "700px", margin: "0 auto" }}>
          <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", flexWrap: "wrap" }}>
            <li><Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/courts" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Courts</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courts/district/${court.district.toLowerCase().replace(/\s+/g, "-")}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{court.district}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: "#E8570C" }}>{court.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <div style={{ padding: "1.5rem 1.5rem 3rem", background: "linear-gradient(180deg, #1a0600 0%, #0A0A0A 100%)", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>
            {court.district} · Nairobi · {court.type} · {court.surface}
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 7vw, 4.5rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "0.75rem" }}>
            {court.name}
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ color: s <= Math.round(court.rating) ? "#FFD700" : "rgba(255,255,255,0.15)", fontSize: "1.2rem" }}>★</span>
            ))}
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.5rem", alignSelf: "center" }}>{court.rating}/5</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
            📍 {court.address}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${court.lat},${court.lng}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: "#E8570C", color: "#111", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}
            >
              Get Directions
            </a>
            <a
              href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS"
              target="_blank" rel="noopener noreferrer"
              style={{ background: "rgba(37,211,102,0.15)", color: "#25D366", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", border: "1px solid rgba(37,211,102,0.3)" }}
            >
              Join Community
            </a>
          </div>
        </div>

        {/* Details */}
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { label: "District", value: court.district },
              { label: "Court Type", value: court.type },
              { label: "Surface", value: court.surface },
              { label: "Rating", value: `${court.rating} / 5` },
            ].map((item) => (
              <div key={item.label} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#F5F2EE" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", color: "#F5F2EE", marginBottom: "1rem" }}>
            About {court.name}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "1rem" }}>
            {court.name} is a verified {court.surface.toLowerCase()} basketball court in {court.district}, Nairobi.
            {court.features ? ` ${court.features}.` : ""} Listed on Splinters — this {court.type.toLowerCase()} is
            rated {court.rating}/5 by the Nairobi basketball community.
          </p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "2rem" }}>
            Looking for basketball courts in {court.district}? Splinters has mapped all 31 verified courts across
            Nairobi — with real GPS coordinates, surface types, ratings and directions.
          </p>

          <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#F5F2EE", marginBottom: "0.75rem" }}>
            More Courts in {court.district}
          </h3>
          <Link
            href={`/courts/district/${court.district.toLowerCase().replace(/\s+/g, "-")}`}
            style={{ color: "#E8570C", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1px" }}
          >
            View all courts in {court.district} →
          </Link>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "2rem", paddingTop: "1.5rem" }}>
            <Link href="/courts" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.8rem" }}>
              ← View all 31 Nairobi basketball courts
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
