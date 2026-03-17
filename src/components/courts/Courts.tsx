"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  const [courts, setCourts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const filters = ["All", "Sports Clubs", "Schools", "Neighbourhood", "Gated", "Hirable", "Open Now"];

  useEffect(() => {
    async function fetchCourts() {
      const { data, error } = await supabase.from("courts").select("*").order("featured", { ascending: false }).order("rating", { ascending: false });
      if (!error && data) setCourts(data);
      setLoading(false);
    }
    fetchCourts();
  }, []);

  const filtered = courts.filter(c => {
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading courts...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(court => (
              <div key={court.id} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "all 0.25s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,87,12,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "relative", height: "180px", background: "linear-gradient(135deg, #1a0800, #0d1b2a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {court.image_url ? (
                    <img src={court.image_url} alt={court.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", opacity: 0.4 }}>🏀</div>
                      <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem" }}>Photo Coming Soon</div>
                    </div>
                  )}
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
                    {court.highlights && court.highlights.map(h => (
                      <span key={h} style={{ background: "rgba(232,87,12,0.08)", border: "1px solid rgba(232,87,12,0.2)", color: "rgba(232,87,12,0.8)", fontSize: "0.62rem", padding: "2px 8px", borderRadius: "100px" }}>{h}</span>
                    ))}
                  </div>
                  {court.membership && court.membership_fee && (
                    <div style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "8px", padding: "0.6rem 0.75rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>Membership</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "#FFD700" }}>{court.membership_fee}</span>
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
        )}
        <div style={{ textAlign: "center", marginTop: "4rem", padding: "3rem", background: "rgba(232,87,12,0.05)", border: "1px solid rgba(232,87,12,0.15)", borderRadius: "20px" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#F5F2EE", marginBottom: "0.5rem" }}>Is your court on Splinters?</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>Partner with us and get your court in front of thousands of Nairobi players and international visitors.</div>
          <a href={"https://wa.me/" + COMMUNITY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}>Partner With Us</a>
        </div>
      </div>
    </section>
  );
}