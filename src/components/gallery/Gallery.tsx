"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Court {
  id: string;
  name: string;
  district: string;
  slug: string;
  image_url: string | null;
  rating: number | null;
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #FFF5F0, #FFE5D9)",
  "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
  "linear-gradient(135deg, #FEF3C7, #FDE68A)",
  "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
  "linear-gradient(135deg, #FCE7F3, #FBCFE8)",
  "linear-gradient(135deg, #F3E8FF, #E9D5FF)",
  "linear-gradient(135deg, #FEE2E2, #FECACA)",
];

export default function Gallery() {
  const [courts, setCourts] = useState<Court[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function fetchCourts() {
      const { data, error } = await supabase.from("courts").select("id, name, district, slug, image_url, rating").order("rating", { ascending: false }).limit(7);
      if (!error && data) setCourts(data as Court[]);
    }
    fetchCourts();
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onPointerUp = () => { isDragging.current = false; };

  const items = courts.length > 0 ? courts : Array(6).fill(null) as null[];

  return (
    <section style={{ padding: "4rem 0 5rem", background: "#FAFAFA", overflow: "hidden", borderTop: "1px solid #E8E8E8" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Courts · Gallery</div>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#111", lineHeight: 1, margin: 0 }}>
              WHERE NAIROBI PLAYS
            </h2>
          </div>
          <a href="/courts"
            style={{ fontSize: "0.78rem", color: "#666", textDecoration: "none", transition: "color 0.2s", fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
            View all courts →
          </a>
        </div>
      </div>

      <div
        ref={trackRef}
        className="gallery-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ display: "flex", gap: "1.25rem", padding: "0.5rem 1.5rem 1rem", overflowX: "auto", scrollbarWidth: "none", userSelect: "none" }}
      >
        {items.map((court, i) => (
          
            key={court?.id ?? i}
            href={court ? `/courts/${court.slug}` : "#courts"}
            draggable={false}
            style={{
              flexShrink: 0,
              width: "clamp(220px, 28vw, 340px)",
              height: "440px",
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              background: court?.image_url ? undefined : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
              border: "1px solid #E8E8E8",
              textDecoration: "none",
              display: "block",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(232,87,12,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
          >
            {court?.image_url && (
              <img src={court.image_url} alt={court.name} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}

            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 65%)" }} />

            {!court && (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(232,87,12,0.04), transparent)", animation: "shimmer 1.8s infinite" }} />
            )}

            {court && (
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.25rem", right: "1.25rem" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.3rem", fontWeight: 700 }}>
                  {court.district}
                </div>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.65rem", color: "#fff", lineHeight: 1.1 }}>
                  {court.name}
                </div>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
