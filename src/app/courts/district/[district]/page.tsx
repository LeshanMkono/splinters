import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface DistrictData {
  name: string;
  desc: string;
  courts: Array<{ name: string; slug: string; type: string; surface: string }>;
  keywords: string[];
}

const DISTRICTS: Record<string, DistrictData> = {
  westlands: {
    name: "Westlands",
    desc: "Find 4 verified basketball courts in Westlands, Nairobi — from sports clubs to school courts. All with real GPS, ratings and directions.",
    courts: [
      { name: "Parklands Sports Club", slug: "parklands-sports-club", type: "Sports Club", surface: "Concrete" },
      { name: "ABSA Bank Sports Club", slug: "absa-bank-sports-club", type: "Sports Club", surface: "Concrete" },
      { name: "St Austins Academy Basketball Court", slug: "st-austins-academy-basketball-court", type: "School Court", surface: "Concrete" },
      { name: "Basketball Court James Gichuru Road", slug: "basketball-court-james-gichuru", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball courts westlands nairobi", "westlands basketball court hire", "play basketball westlands", "outdoor basketball court westlands"],
  },
  kasarani: {
    name: "Kasarani",
    desc: "3 verified basketball courts in Kasarani, Nairobi — including the Kasarani Indoor Arena at Moi Sports Centre.",
    courts: [
      { name: "Kasarani Indoor Basketball Arena", slug: "kasarani-indoor-basketball-arena", type: "Indoor Arena", surface: "Hardwood" },
      { name: "USIU Basketball Court", slug: "usiu-basketball-court", type: "University Court", surface: "Hardwood" },
      { name: "Kenya Academy of Sports Basketball Court", slug: "kenya-academy-of-sports-basketball-court", type: "Academy Court", surface: "Hardwood" },
    ],
    keywords: ["basketball courts kasarani nairobi", "kasarani indoor basketball", "usiu basketball court", "moi sports centre basketball"],
  },
  karen: {
    name: "Karen",
    desc: "Verified basketball courts in Karen, Nairobi. Play in one of Nairobi's most scenic residential areas.",
    courts: [
      { name: "Karen Gated Basketball Court", slug: "karen-gated-basketball-court", type: "Private Court", surface: "Concrete" },
    ],
    keywords: ["basketball courts karen nairobi", "karen basketball court hire", "play basketball karen nairobi"],
  },
  kibera: {
    name: "Kibera",
    desc: "Free community basketball courts in Kibera, Nairobi. Open to all — verified by Splinters.",
    courts: [
      { name: "Kibera Community Basketball Court", slug: "kibera-community-basketball-court", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball courts kibera nairobi", "kibera basketball community", "free basketball court kibera"],
  },
  langata: {
    name: "Langata",
    desc: "Basketball courts in Langata, Nairobi — Langata Road and surrounds.",
    courts: [
      { name: "Langata Down Basketball Court", slug: "langata-down-basketball-court", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball court langata nairobi", "langata road basketball", "play basketball langata"],
  },
  parklands: {
    name: "Parklands",
    desc: "Basketball courts in Parklands, Nairobi — a short drive from Westlands and CBD.",
    courts: [
      { name: "Olive Crescent School Basketball Court", slug: "olive-crescent-school", type: "School Court", surface: "Concrete" },
    ],
    keywords: ["basketball courts parklands nairobi", "parklands basketball court", "play basketball parklands nairobi"],
  },
  lavington: {
    name: "Lavington",
    desc: "3 basketball courts in Lavington, Nairobi — school courts and community courts near James Gichuru Road.",
    courts: [
      { name: "Nairobi International School Basketball Court", slug: "nairobi-international-school", type: "School Court", surface: "Hardwood" },
      { name: "Basketball Court James Gichuru Road", slug: "basketball-court-james-gichuru", type: "Community Court", surface: "Concrete" },
      { name: "Braeburn Schools Basketball Court", slug: "braeburn-schools-basketball-court", type: "School Court", surface: "Hardwood" },
    ],
    keywords: ["basketball courts lavington nairobi", "lavington basketball court", "james gichuru basketball nairobi"],
  },
  eastleigh: {
    name: "Eastleigh",
    desc: "2 verified basketball courts in Eastleigh, Nairobi — community and school courts.",
    courts: [
      { name: "Camp Toyoyo Jericho Basketball Court", slug: "camp-toyoyo-jericho", type: "Community Court", surface: "Concrete" },
      { name: "Eastleigh High School Basketball Court", slug: "eastleigh-high-school-basketball-court", type: "School Court", surface: "Concrete" },
    ],
    keywords: ["basketball courts eastleigh nairobi", "eastleigh basketball court", "camp toyoyo basketball jericho"],
  },
  cbd: {
    name: "Nairobi CBD",
    desc: "4 basketball courts in Nairobi CBD — public courts, university courts and sports complexes in the city centre.",
    courts: [
      { name: "Kenya Science Basketball Court", slug: "kenya-science-basketball-court", type: "Institution Court", surface: "Concrete" },
      { name: "University of Nairobi Basketball Court", slug: "university-of-nairobi-basketball-court", type: "University Court", surface: "Hardwood" },
      { name: "Uhuru Park Basketball Court", slug: "uhuru-park-basketball-court", type: "Public Court", surface: "Concrete" },
      { name: "Taarifa Road Sports Complex Basketball Court", slug: "taarifa-road-sports-complex", type: "Sports Complex", surface: "Concrete" },
    ],
    keywords: ["basketball courts nairobi cbd", "nairobi city centre basketball", "uhuru park basketball", "university of nairobi basketball"],
  },
  umoja: {
    name: "Umoja",
    desc: "Community basketball courts in Umoja Estate, Nairobi East.",
    courts: [
      { name: "Umoja 2 Basketball Court", slug: "umoja-2-basketball-court", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball court umoja nairobi", "umoja 2 basketball", "nairobi east basketball court"],
  },
  komarock: {
    name: "Komarock",
    desc: "Basketball courts in Komarock, Nairobi — community courts in Nairobi East.",
    courts: [
      { name: "Basketball Court Komarock", slug: "basketball-court-komarock", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball court komarock nairobi", "komarock basketball", "nairobi east outdoor basketball"],
  },
  ridgeways: {
    name: "Ridgeways",
    desc: "Basketball courts in Ridgeways, North Nairobi.",
    courts: [
      { name: "Ridgeways Basketball Court", slug: "ridgeways-basketball-court", type: "Community Court", surface: "Concrete" },
    ],
    keywords: ["basketball court ridgeways nairobi", "ridgeways outdoor basketball", "north nairobi basketball court"],
  },
  ruiru: {
    name: "Ruiru",
    desc: "Basketball courts in Ruiru, Kiambu County — just outside Nairobi.",
    courts: [
      { name: "Ruiru Secondary School Basketball Court", slug: "ruiru-secondary-basketball-court", type: "School Court", surface: "Concrete" },
    ],
    keywords: ["basketball court ruiru nairobi", "ruiru secondary basketball", "kiambu basketball court"],
  },
};

type Props = { params: { district: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = DISTRICTS[params.district];
  if (!d) return { title: "District Not Found | Splinters" };
  return {
    title: `Basketball Courts in ${d.name}, Nairobi`,
    description: `Find ${d.courts.length} verified basketball courts in ${d.name}, Nairobi. Real directions, ratings and booking on Splinters.`,
    keywords: [`basketball courts ${d.name.toLowerCase()} nairobi`, `basketball court ${d.name.toLowerCase()}`, "basketball courts nairobi", "splinters basketball"],
    alternates: { canonical: `https://splinters.co.ke/courts/district/${params.district}` },
    openGraph: {
      title: `Basketball Courts in ${d.name}, Nairobi`,
      description: `${d.courts.length} verified basketball courts in ${d.name}. Get directions and book on Splinters.`,
      url: `https://splinters.co.ke/courts/district/${params.district}`,
      images: [{ url: "https://splinters.co.ke/splinters-logo.jpg" }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(DISTRICTS).map((district) => ({ district }));
}

export default function DistrictPage({ params }: Props) {
  const d = DISTRICTS[params.district];
  if (!d) {
    return (
      <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#E8570C" }}>District Not Found</h1>
          <Link href="/courts" style={{ color: "#E8570C", textDecoration: "none" }}>← All Courts</Link>
        </div>
      </main>
    );
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Basketball Courts in ${d.name}, Nairobi`,
    "description": d.desc,
    "url": `https://splinters.co.ke/courts/district/${params.district}`,
    "numberOfItems": d.courts.length,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />
        <div style={{ padding: "7rem 1.5rem 3rem", background: "linear-gradient(180deg, #1a0600 0%, #0A0A0A 100%)", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>Nairobi Basketball · {d.courts.length} Courts</div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "1rem" }}>
            Basketball Courts<br /><span style={{ color: "#E8570C" }}>in {d.name}</span>
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>{d.desc} Find verified courts with real directions.</p>
          <Link href="/courts" style={{ color: "#E8570C", textDecoration: "none", fontSize: "0.8rem" }}>← View All 31 Nairobi Courts</Link>
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {d.courts.map((court, i) => (
              <div key={i} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.25rem" }}>Basketball Court · {d.name}</div>
                  <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#F5F2EE" }}>{court.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>📍 {d.name}, Nairobi · {court.surface}</div>
                </div>
                <Link href={`/courts/${court.slug}`} style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", fontWeight: "600", flexShrink: 0, marginLeft: "1rem" }}>View →</Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#0D1117", borderRadius: "14px", border: "1px solid rgba(232,87,12,0.2)" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#F5F2EE", marginBottom: "0.75rem" }}>Find Basketball Courts in {d.name}, Nairobi</h2>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>
              Splinters is Nairobi&apos;s basketball court discovery platform. We have verified {d.courts.length} basketball courts in {d.name} with real GPS coordinates, ratings, and directions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
