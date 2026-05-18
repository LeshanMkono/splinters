"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const COMMUNITY = "https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FFD700" : "#E0E0E0", fontSize: "0.75rem" }}>★</span>
      ))}
      <span style={{ fontSize: "0.72rem", color: "#999", marginLeft: "4px" }}>{rating}</span>
    </div>
  );
}

export default function Courts() {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    async function fetchCourts() {
      const { data, error } = await supabase.from("courts").select("*").eq("featured", true).limit(3).order("rating", { ascending: false });
      if (!error && data) setCourts(data);
      setLoading(false);
    }
    fetchCourts();
  }, []);

  function scrollTo(idx) {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[idx];
    if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIdx(idx);
  }

  const CourtCard = ({ court, idx }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E8E8",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.25s",
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        ...(isMobile ? { flex: "0 0 82%", scrollSnapAlign: "center", opacity: idx === activeIdx ? 1 : 0.5, transform: idx === activeIdx ? "scale(1)" : "scale(0.95)", transition: "all 0.4s ease" } : {}),
      }}
      onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = "#E8570C"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,87,12,0.12)"; }}}
      onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = "#E8E8E8"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}}>

      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        {court.image_url ? (
          <img src={court.image_url} alt={court.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseEnter={e => { if (!isMobile) e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { if (!isMobile) e.currentTarget.style.transform = "scale(1)"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FFF5F0, #FFE5D9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", opacity: 0.4 }}>🏀</div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: court.status === "open" ? "#16A34A" : "#E8570C", color: "#fff", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "700" }}>
          {court.status === "open" ? "● OPEN NOW" : "HIRABLE"}
        </div>
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "#FFD700", color: "#111", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "700" }}>⭐ FEATURED</div>
        <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "6px", padding: "2px 8px" }}>
          <div style={{ fontSize: "0.6rem", color: "#E8570C", fontStyle: "italic", fontWeight: 600 }}>{court.legend}</div>
        </div>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
          <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#111", lineHeight: 1.2, flex: 1, marginRight: "0.5rem" }}>{court.name}</div>
          <div style={{ flexShrink: 0 }}>
            <Stars rating={court.rating || court.google_rating || 0} />
            <div style={{ fontSize: "0.6rem", color: "#999", textAlign: "right", marginTop: "2px" }}>{court.reviews || 0} reviews</div>
          </div>
        </div>
        <div style={{ fontSize: "0.72rem", color: "#666", marginBottom: "0.75rem" }}>📍 {court.address}</div>
        <div style={{ fontSize: "0.78rem", color: "#555", lineHeight: 1.6, marginBottom: "1rem" }}>{court.description}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
          {court.highlights && court.highlights.map(h => (
            <span key={h} style={{ background: "rgba(232,87,12,0.08)", border: "1px solid rgba(232,87,12,0.2)", color: "#E8570C", fontSize: "0.62rem", padding: "2px 8px", borderRadius: "100px", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {court.membership && court.membership_fee && (
          <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "8px", padding: "0.6rem 0.75rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#666" }}>Membership</span>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#B8860B" }}>{court.membership_fee}</span>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.68rem", color: "#666" }}>🏟 {court.surface}</span>
          {court.lights && <span style={{ fontSize: "0.68rem", color: "#666" }}>💡 Lights</span>}
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {court.hirable && (
            <a href={"https://wa.me/" + court.whatsapp} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#E8570C", color: "#fff", padding: "0.6rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", fontWeight: "700", textAlign: "center" }}>
              Book Court
            </a>
          )}
          <a href={"https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS"} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, background: "rgba(37,211,102,0.08)", color: "#25D366", padding: "0.6rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", fontWeight: "700", textAlign: "center", border: "1px solid rgba(37,211,102,0.2)" }}>
            💬 Join Group
          </a>
          {court.lat && court.lng && (
            <a href={"https://www.google.com/maps?q=" + court.lat + "," + court.lng} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#F5F5F5", color: "#666", padding: "0.6rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", textAlign: "center", border: "1px solid #E0E0E0", fontWeight: 600 }}>
              🗺 Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section id="courts" style={{ position: "relative", padding: "5rem 0", background: "#fff", borderTop: "1px solid #E8E8E8" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>Nairobi · 31 Courts</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#111", lineHeight: 1 }}>FEATURED COURTS</div>
          </div>
          <a href={"https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS"} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366", padding: "0.65rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "700" }}>
            💬 Splinters Community
          </a>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#999", fontSize: "0.85rem" }}>Loading courts...</div>
      ) : isMobile ? (
        <div>
          <div
            ref={scrollRef}
            onScroll={e => { const el = e.currentTarget; const cardWidth = el.scrollWidth / courts.length; const idx = Math.round(el.scrollLeft / cardWidth); setActiveIdx(idx); }}
            style={{ display: "flex", gap: "1rem", overflowX: "scroll", scrollSnapType: "x mandatory", paddingLeft: "9%", paddingRight: "9%", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", paddingBottom: "0.5rem" }}>
            {courts.map((court, idx) => (<CourtCard key={court.id} court={court} idx={idx} />))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            {courts.map((_, i) => (<div key={i} onClick={() => scrollTo(i)} style={{ width: i === activeIdx ? "20px" : "6px", height: "6px", borderRadius: "100px", background: i === activeIdx ? "#E8570C" : "#E0E0E0", cursor: "pointer", transition: "all 0.3s" }} />))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {courts.map((court, idx) => (<CourtCard key={court.id} court={court} idx={idx} />))}
        </div>
      )}

      <div style={{ maxWidth: "1100px", margin: "2rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginTop: "2rem", padding: "3rem", background: "rgba(232,87,12,0.04)", border: "1px solid rgba(232,87,12,0.12)", borderRadius: "20px" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#111", marginBottom: "0.5rem" }}>Is your court on Splinters?</div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>Partner with us and get your court in front of thousands of Nairobi players and international visitors.</div>
          <a href={"https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS"} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#E8570C", color: "#fff", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700" }}>
            Partner With Us
          </a>
        </div>
      </div>
    </section>
  );
}
