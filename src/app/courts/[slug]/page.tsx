import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const COURTS: Record<string, any> = {
  "parklands-sports-club": { name: "Parklands Sports Club", district: "Westlands", address: "49 Parklands Road, Westlands, Nairobi", lat: -1.26737, lng: 36.81337, rating: 4.8, type: "Sports Club", keyword: "parklands sports club basketball nairobi" },
  "kasarani-indoor-basketball-arena": { name: "Kasarani Indoor Basketball Arena", district: "Kasarani", address: "Moi International Sports Centre, Kasarani, Nairobi", lat: -1.2197, lng: 36.8963, rating: 4.3, type: "Indoor Arena", keyword: "kasarani indoor basketball arena nairobi" },
  "nairobi-international-school": { name: "Nairobi International School Basketball Court", district: "Lavington", address: "Maji Mazuri Road, Lavington, Nairobi", lat: -1.28333, lng: 36.76667, rating: 4.6, type: "School Court", keyword: "nairobi international school basketball court lavington" },
  "olive-crescent-school": { name: "Olive Crescent School Basketball Court", district: "Parklands", address: "Kolobot Drive, Parklands, Nairobi", lat: -1.259, lng: 36.818, rating: 4.4, type: "School Court", keyword: "olive crescent school basketball court parklands nairobi" },
  "absa-bank-sports-club": { name: "ABSA Bank Sports Club Basketball Court", district: "Westlands", address: "Utalii Road, Nairobi", lat: -1.258, lng: 36.823, rating: 4.5, type: "Sports Club", keyword: "absa bank sports club basketball court nairobi" },
  "umoja-2-basketball-court": { name: "Umoja 2 Basketball Court", district: "Umoja", address: "Umoja 2 Estate, Off Moi Drive, Nairobi", lat: -1.28, lng: 36.89, rating: 4.3, type: "Community Court", keyword: "umoja 2 basketball court nairobi" },
  "langata-down-basketball-court": { name: "Langata Down Basketball Court", district: "Langata", address: "Langata Road, Langata, Nairobi", lat: -1.3312, lng: 36.7612, rating: 4.3, type: "Community Court", keyword: "langata down basketball court nairobi" },
  "diwopa-basketball-court": { name: "Diwopa Basketball Court", district: "Nairobi", address: "Nairobi City, Kenya", lat: -1.26, lng: 36.88, rating: 4.4, type: "Community Court", keyword: "diwopa basketball court nairobi" },
  "usiu-basketball-court": { name: "USIU Basketball Court", district: "Kasarani", address: "USIU Campus, Kasarani, Nairobi", lat: -1.218, lng: 36.89, rating: 4.4, type: "University Court", keyword: "usiu basketball court kasarani nairobi" },
  "kobe-basketball-court": { name: "Kobe Basketball Court", district: "Kiungani", address: "Kiungani Road, Nairobi", lat: -1.38, lng: 36.78, rating: 4.5, type: "Community Court", keyword: "kobe basketball court nairobi kiungani" },
  "kq-pride-public-basketball-court": { name: "KQ Pride Public Basketball Court", district: "Nairobi", address: "Nairobi, Kenya", lat: -1.29, lng: 36.86, rating: 4.3, type: "Public Court", keyword: "kq pride public basketball court nairobi" },
  "st-austins-academy-basketball-court": { name: "St Austins Academy Basketball Court", district: "Westlands", address: "James Gichuru Road, Westlands, Nairobi", lat: -1.283, lng: 36.765, rating: 4.5, type: "School Court", keyword: "st austins academy basketball court nairobi" },
  "kenya-science-basketball-court": { name: "Kenya Science Basketball Court", district: "Nairobi CBD", address: "Nairobi City, Kenya", lat: -1.28, lng: 36.82, rating: 4.5, type: "Institution Court", keyword: "kenya science basketball court nairobi" },
  "camp-toyoyo-jericho": { name: "Camp Toyoyo Jericho Basketball Court", district: "Eastleigh", address: "Jericho, Eastleigh, Nairobi", lat: -1.275, lng: 36.858, rating: 4.0, type: "Community Court", keyword: "camp toyoyo basketball court jericho nairobi" },
  "basketball-court-komarock": { name: "Basketball Court Komarock", district: "Komarock", address: "Komarock, Nairobi", lat: -1.273, lng: 36.91, rating: 3.9, type: "Community Court", keyword: "basketball court komarock nairobi" },
  "good-testimony-international-basketball-court": { name: "Good Testimony International Basketball Court", district: "Nairobi", address: "Nairobi City, Kenya", lat: -1.285, lng: 36.875, rating: 4.2, type: "Community Court", keyword: "good testimony international basketball court nairobi" },
  "ridgeways-basketball-court": { name: "Ridgeways Basketball Court", district: "Ridgeways", address: "Ridgeways, Nairobi", lat: -1.21, lng: 36.85, rating: 3.0, type: "Community Court", keyword: "ridgeways basketball court nairobi" },
  "karen-gated-basketball-court": { name: "Karen Gated Basketball Court", district: "Karen", address: "Karen, Nairobi", lat: -1.33, lng: 36.71, rating: 4.7, type: "Private Court", keyword: "karen basketball court nairobi" },
  "kibera-community-basketball-court": { name: "Kibera Community Basketball Court", district: "Kibera", address: "Kibera, Nairobi", lat: -1.313, lng: 36.786, rating: 4.5, type: "Community Court", keyword: "kibera basketball court nairobi" },
  "lenana-school-basketball-court": { name: "Lenana School Basketball Court", district: "Kilimani", address: "Lenana School, Kilimani, Nairobi", lat: -1.295, lng: 36.785, rating: 3.5, type: "School Court", keyword: "lenana school basketball court nairobi" },
  "university-of-nairobi-basketball-court": { name: "University of Nairobi Basketball Court", district: "Nairobi CBD", address: "University of Nairobi, CBD, Nairobi", lat: -1.279, lng: 36.817, rating: 3.0, type: "University Court", keyword: "university of nairobi basketball court" },
  "braeburn-schools-basketball-court": { name: "Braeburn Schools Basketball Court", district: "Lavington", address: "Lavington, Nairobi", lat: -1.279, lng: 36.77, rating: 3.2, type: "School Court", keyword: "braeburn school basketball court nairobi" },
  "umama-play-ground": { name: "Umama Play Ground Basketball Court", district: "Nairobi", address: "Nairobi, Kenya", lat: -1.28, lng: 36.85, rating: 4.2, type: "Community Court", keyword: "umama basketball court nairobi" },
  "ruiru-secondary-basketball-court": { name: "Ruiru Secondary School Basketball Court", district: "Ruiru", address: "Ruiru, Kiambu County, Kenya", lat: -1.15, lng: 36.96, rating: 5.0, type: "School Court", keyword: "ruiru secondary basketball court nairobi" },
  "basketball-court-james-gichuru": { name: "Basketball Court James Gichuru Road", district: "Lavington", address: "James Gichuru Road, Lavington, Nairobi", lat: -1.285, lng: 36.763, rating: 4.8, type: "Community Court", keyword: "basketball court james gichuru road nairobi" },
  "kenya-academy-of-sports-basketball-court": { name: "Kenya Academy of Sports Basketball Court", district: "Kasarani", address: "Kasarani, Nairobi", lat: -1.215, lng: 36.895, rating: 4.1, type: "Academy Court", keyword: "kenya academy of sports basketball court kasarani" },
  "basketball-court-melili": { name: "Basketball Court Melili Road", district: "Nairobi", address: "Melili Road, Nairobi", lat: -1.29, lng: 36.81, rating: 4.0, type: "Community Court", keyword: "basketball court melili road nairobi" },
  "taarifa-road-sports-complex": { name: "Taarifa Road Sports Complex Basketball Court", district: "Nairobi CBD", address: "Taarifa Road, Nairobi", lat: -1.285, lng: 36.825, rating: 3.5, type: "Sports Complex", keyword: "taarifa road sports complex basketball nairobi" },
  "uhuru-park-basketball-court": { name: "Uhuru Park Basketball Court", district: "Nairobi CBD", address: "Uhuru Park, Nairobi CBD", lat: -1.286, lng: 36.814, rating: 3.2, type: "Public Court", keyword: "uhuru park basketball court nairobi" },
  "eastleigh-high-school-basketball-court": { name: "Eastleigh High School Basketball Court", district: "Eastleigh", address: "Eastleigh, Nairobi", lat: -1.271, lng: 36.852, rating: 4.0, type: "School Court", keyword: "eastleigh high school basketball court nairobi" },
  "basketball-court-mai-mahiu": { name: "Basketball Court Mai Mahiu Road", district: "Nairobi", address: "Mai Mahiu Road, Nairobi", lat: -1.265, lng: 36.782, rating: 4.3, type: "Community Court", keyword: "basketball court mai mahiu road nairobi" },
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const court = COURTS[params.slug];
  if (!court) return { title: "Court Not Found | Splinters" };
  return {
    title: `${court.name} — Basketball Court in ${court.district}, Nairobi`,
    description: `Play basketball at ${court.name} in ${court.district}, Nairobi. ${court.type}. Rating: ${court.rating}/5. Get directions and book on Splinters.`,
    keywords: [court.keyword, `basketball court ${court.district.toLowerCase()} nairobi`, "basketball courts nairobi"],
    alternates: { canonical: `https://splinters.co.ke/courts/${params.slug}` },
    openGraph: {
      title: `${court.name} — Basketball Court in ${court.district}, Nairobi`,
      description: `${court.type} in ${court.district}, Nairobi. Rating ${court.rating}/5.`,
      url: `https://splinters.co.ke/courts/${params.slug}`,
      images: [{ url: "https://splinters.co.ke/splinters-logo.jpg" }],
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": court.name,
    "description": `Basketball court in ${court.district}, Nairobi. ${court.type}.`,
    "address": { "@type": "PostalAddress", "streetAddress": court.address, "addressLocality": "Nairobi", "addressCountry": "KE" },
    "geo": { "@type": "GeoCoordinates", "latitude": court.lat, "longitude": court.lng },
    "sport": "Basketball",
    "url": `https://splinters.co.ke/courts/${params.slug}`,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": court.rating, "bestRating": "5", "worstRating": "1" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />
        <div style={{ padding: "7rem 1.5rem 3rem", background: "linear-gradient(180deg, #1a0600 0%, #0A0A0A 100%)", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>{court.district} · Nairobi · {court.type}</div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 7vw, 4.5rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "0.75rem" }}>{court.name}</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
            {[1,2,3,4,5].map(s => (<span key={s} style={{ color: s <= Math.round(court.rating) ? "#FFD700" : "rgba(255,255,255,0.15)", fontSize: "1.2rem" }}>★</span>))}
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.5rem", alignSelf: "center" }}>{court.rating}/5</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>📍 {court.address}</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${court.lat},${court.lng}`} target="_blank" rel="noopener noreferrer" style={{ background: "#E8570C", color: "#111", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}>🗺️ Get Directions</a>
            <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer" style={{ background: "rgba(37,211,102,0.15)", color: "#25D366", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", border: "1px solid rgba(37,211,102,0.3)" }}>💬 Join Community</a>
          </div>
        </div>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[{ label: "District", value: court.district }, { label: "Court Type", value: court.type }, { label: "Rating", value: `${court.rating} / 5` }, { label: "City", value: "Nairobi, Kenya" }].map((item) => (
              <div key={item.label} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#F5F2EE" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", color: "#F5F2EE", marginBottom: "1rem" }}>About {court.name}</h2>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "1rem" }}>
            {court.name} is a verified basketball court in {court.district}, Nairobi. Listed on Splinters — this {court.type.toLowerCase()} is rated {court.rating}/5 by the community.
          </p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "2rem" }}>
            Looking for basketball courts in {court.district}? Splinters has verified every court in Nairobi with real GPS, ratings, and directions.
          </p>
          <Link href="/courts" style={{ color: "#E8570C", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1px" }}>← View All 31 Nairobi Courts</Link>
        </div>
      </main>
    </>
  );
}
