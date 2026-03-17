"use client";
import { useState } from "react";

const COURTS = [
  { id: 1, name: "Parklands Sports Club", legend: "The Sepolia", district: "Westlands", address: "Ojijo Rd, Museum Hill", phone: "+254 737 452164", whatsapp: "254737452164", type: "Sports Club", surface: "Outdoor · Tarmac", lights: true, hirable: true, membership: true, membershipFee: "KES 3,500/month", rating: 4.8, reviews: 24, status: "open", featured: true, description: "One of Nairobis most iconic courts. Home of serious hoopers since the 90s. Full court, lights, and a strong community.", highlights: ["Full Court", "Flood Lights", "Weekend Tournaments", "Coaching Available"] },
  { id: 2, name: "Kasarani Indoor Arena", legend: "The Yaounde", district: "Kasarani", address: "Kasarani, Nairobi", phone: "+254 20 3560093", whatsapp: "254203560093", type: "Sports Club", surface: "Indoor · Hardwood", lights: true, hirable: true, membership: true, membershipFee: "KES 5,000/month", rating: 4.9, reviews: 41, status: "open", featured: true, description: "The premier indoor basketball facility in Nairobi. Regulation hardwood floor, professional lighting, spectator seating.", highlights: ["Regulation Court", "Hardwood Floor", "Pro Lighting", "Spectator Seating"] },
  { id: 3, name: "Nairobi International School", legend: "The Dream", district: "Lavington", address: "Lavington, Nairobi", phone: "+254 20 4440441", whatsapp: "254204440441", type: "School Court", surface: "Indoor · Tiles", lights: true, hirable: true, membership: false, membershipFee: null, rating: 4.6, reviews: 18, status: "hire", featured: true, description: "Pristine indoor court available for hire outside school hours. Excellent surface and great lighting.", highlights: ["Indoor Court", "Hire Available", "Professional Surface", "Evenings & Weekends"] },
  { id: 4, name: "Olive Crescent School", legend: "Jackson Park", district: "Kileleshwa", address: "Kileleshwa, Nairobi", phone: "", whatsapp: "254700000000", type: "School Court", surface: "Outdoor · Tarmac", lights: false, hirable: true, membership: false, membershipFee: null, rating: 4.4, reviews: 12, status: "hire", featured: true, description: "The Jackson Park of Nairobi. Kileleshwas most creative basketball environment where style meets skill.", highlights: ["Unique Aesthetic", "Hire Available", "Street Ball Vibes", "Community Games"] },
  { id: 5, name: "Karen Gated Court", legend: "The Mamba Court", district: "Karen", address: "Karen, Nairobi", phone: "", whatsapp: "254700000000", type: "Gated Community", surface: "Outdoor · Synthetic", lights: true, hirable: true, membership: true, membershipFee: "KES 4,000/month", rating: 4.7, reviews: 15, status: "hire", featured: false, description: "Kobe trained alone in private. Karen most exclusive court carries that same energy. Quiet, serious, perfectly maintained.", highlights: ["Private Setting", "Synthetic Surface", "Flood Lights", "Serious Players Only"] },
  { id: 6, name: "Kibera Community Court", legend: "The Compton", district: "Kibera", address: "Kibera, Nairobi", phone: "", whatsapp: "254700000000", type: "Neighbourhood", surface: "Outdoor · Concrete", lights: false, hirable: false, membership: false, membershipFee: null, rating: 4.5, reviews: 33, status: "open", featured: false, description: "No lights. No nets. No problem. Raw talent, real basketball, and a community that lives the game. Free to play.", highlights: ["Free to Play", "Raw Street Ball", "Community Run", "Daily Runs"] },
];

const COMMUNITY = "254700000000";

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FFD700" : "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>★</span>
      ))}
      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginLeft: "4px" }}>{rating}</span>
    </div>
  );
}

export default function Courts() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Sports Clubs", "Schools", "Neighbourhood", "Gated", "Hirable", "Open Now"];
  const filtered = COURTS.filter(c => {
    if (filter === "All") return true;
    if (filter === "Sports Clubs") return c.type === "Sports Club";
    if (filter === "Schools") return c.type === "School Court";
    if (filter === "Neighbourhood") return c.type === "Neighbourhood";
    if (filter === "Gated") return c.type === "Gated Community";
    if (filter === "Hirable") return c.hirable;
    if (filter === "Open Now") return c.status === "open";
    return true;
  });
  return (
    <section id="courts" style={{ position: "relative", padding: "5rem 1.5rem", background: "#0A0A0A", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>Nairobi · 63+ Courts</div>
            <div style={{ fontWeight: "bold", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#F5F2EE", lineHeight: 1 }}>FEATURED COURTS</div>
          </div>
          <a href={"https://wa.me/" + COMMUNITY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366", padding: "0.65rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}>
            💬 Splinters Community
          </a>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "1.5rem 0 2rem" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.3rem 0.9rem", background: filter === f ? "#E8570C" : "rgba(255,255,255,0.05)", border: "1px solid " + (filter === f ? "#E8570C" : "rgba(255,255,255,0.1)"), color: filter === f ? "#111" : "rgba(255,255,255,0.55)", borderRadius: "100px", fontSize: "0.72rem", cursor: "pointer", fontWeight: filter === f ? "500" : "400" }}>{f}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(court => (
            <div key={court.id} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "all 0.25s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,87,12,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ position: "relative", height: "180px", background: "linear-gradient(135deg, #1a0800, #0d1b2a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", opacity: 0.4 }}>🏀</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem" }}>Photo Coming Soon</div>
                </div>
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: court.status === "open" ? "rgba(29,185,84,0.9)" : "rgba(232,87,12,0.9)", color: "#111", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "600" }}>
                  {court.status === "open" ? "OPEN NOW" : "HIRABLE"}
                </div>
                {court.featured && (
                  <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(255,215,0,0.9)", color: "#111", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "600" }}>⭐ FEATURED</div>
                )}
                <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", background: "rgba(10,10,10,0.85)", border: "1px solid rgba(232,87,12,0.3)", borderRadius: "6px", padding: "2px 8px" }}>
                  <div style={{ fontSize: "0.6rem", color: "#E8570C", fontStyle: "italic" }}>{court.legend}</div>
                </div>
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#F5F2EE", lineHeight: 1.2, flex: 1, marginRight: "0.5rem" }}>{court.name}</div>
                  <div style={{ flexShrink: 0 }}>
                    <Stars rating={court.rating} />
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textAlign: "right", marginTop: "2px" }}>{court.reviews} reviews</div>
                  </div>
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>📍 {court.district} · {court.type}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1rem" }}>{court.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                  {court.highlights.map(h => (
                    <span key={h} style={{ background: "rgba(232,87,12,0.08)", border: "1px solid rgba(232,87,12,0.2)", color: "rgba(232,87,12,0.8)", fontSize: "0.62rem", padding: "2px 8px", borderRadius: "100px" }}>{h}</span>
                  ))}
                </div>
                {court.membership && court.membershipFee && (
                  <div style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "8px", padding: "0.6rem 0.75rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>Membership</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "#FFD700" }}>{court.membershipFee}</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>🏟️ {court.surface}</span>
                  {court.lights && <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>💡 Lights</span>}
                </div>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {court.hirable && (
                    <a href={"https://wa.me/" + court.whatsapp} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "#E8570C", color: "#111", padding: "0.6rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", fontWeight: "500", textAlign: "center" }}>Book Court</a>
                  )}
                  <a href={"https://wa.me/" + COMMUNITY} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "rgba(37,211,102,0.1)", color: "#25D366", padding: "0.6rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", fontWeight: "500", textAlign: "center", border: "1px solid rgba(37,211,102,0.25)" }}>💬 Join Group</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "4rem", padding: "3rem", background: "rgba(232,87,12,0.05)", border: "1px solid rgba(232,87,12,0.15)", borderRadius: "20px" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#F5F2EE", marginBottom: "0.5rem" }}>Is your court on Splinters?</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>Partner with us and get your court in front of thousands of Nairobi players and international visitors.</div>
          <a href={"https://wa.me/" + COMMUNITY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}>Partner With Us</a>
        </div>
      </div>
    </section>
  );
}