import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const DISTRICTS: Record<string, { name: string; desc: string; courts: string[] }> = {
  westlands: { name: "Westlands", desc: "Basketball courts in Westlands, Nairobi.", courts: ["Parklands Sports Club", "ABSA Bank Sports Club", "St Austins Academy Basketball Court", "Basketball Court James Gichuru Road"] },
  kasarani: { name: "Kasarani", desc: "Basketball courts in Kasarani, Nairobi.", courts: ["Kasarani Indoor Basketball Arena", "USIU Basketball Court", "Kenya Academy of Sports Basketball Court"] },
  karen: { name: "Karen", desc: "Basketball courts in Karen, Nairobi.", courts: ["Karen Gated Basketball Court"] },
  kibera: { name: "Kibera", desc: "Basketball courts in Kibera, Nairobi.", courts: ["Kibera Community Basketball Court"] },
  langata: { name: "Langata", desc: "Basketball courts in Langata, Nairobi.", courts: ["Langata Down Basketball Court"] },
  parklands: { name: "Parklands", desc: "Basketball courts in Parklands, Nairobi.", courts: ["Olive Crescent School Basketball Court"] },
  lavington: { name: "Lavington", desc: "Basketball courts in Lavington, Nairobi.", courts: ["Nairobi International School Basketball Court", "Basketball Court James Gichuru Road", "Braeburn Schools Basketball Court"] },
  eastleigh: { name: "Eastleigh", desc: "Basketball courts in Eastleigh, Nairobi.", courts: ["Camp Toyoyo Jericho Basketball Court", "Eastleigh High School Basketball Court"] },
  cbd: { name: "Nairobi CBD", desc: "Basketball courts in Nairobi CBD.", courts: ["Kenya Science Basketball Court", "University of Nairobi Basketball Court", "Uhuru Park Basketball Court", "Taarifa Road Sports Complex Basketball Court"] },
  umoja: { name: "Umoja", desc: "Basketball courts in Umoja, Nairobi.", courts: ["Umoja 2 Basketball Court"] },
  komarock: { name: "Komarock", desc: "Basketball courts in Komarock, Nairobi.", courts: ["Basketball Court Komarock"] },
  ridgeways: { name: "Ridgeways", desc: "Basketball courts in Ridgeways, Nairobi.", courts: ["Ridgeways Basketball Court"] },
  ruiru: { name: "Ruiru", desc: "Basketball courts in Ruiru, Nairobi.", courts: ["Ruiru Secondary School Basketball Court"] },
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
                  <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#F5F2EE" }}>{court}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>📍 {d.name}, Nairobi</div>
                </div>
                <Link href="/courts" style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", fontWeight: "600", flexShrink: 0, marginLeft: "1rem" }}>View →</Link>
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
