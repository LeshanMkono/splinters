"use client";
import { useState } from "react";

const COURTS = [
  { id: 1, name: "Parklands Sports Club", legend: "The Sepolia", district: "Westlands", address: "Ojijo Rd, Museum Hill", phone: "+254 737 452164", status: "open", left: "28%", top: "38%" },
  { id: 2, name: "Nairobi International School", legend: "The Dream", district: "Lavington", address: "Lavington, Nairobi", phone: "+254 20 4440441", status: "hire", left: "36%", top: "54%" },
  { id: 3, name: "Olive Crescent School", legend: "Jackson Park", district: "Kileleshwa", address: "Kileleshwa, Nairobi", phone: "", status: "hire", left: "40%", top: "47%" },
  { id: 4, name: "Kasarani Indoor Arena", legend: "The Yaounde", district: "Kasarani", address: "Kasarani, Nairobi", phone: "+254 20 3560093", status: "hire", left: "72%", top: "24%" },
  { id: 5, name: "USIU Africa Court", legend: "The Yaounde", district: "Kasarani", address: "Thika Rd, Kasarani", phone: "", status: "hire", left: "80%", top: "30%" },
  { id: 6, name: "Uhuru Park Court", legend: "The Nairobi Intl", district: "CBD", address: "Uhuru Park, CBD", phone: "", status: "open", left: "50%", top: "50%" },
  { id: 7, name: "Kibera Community Court", legend: "The Compton", district: "Kibera", address: "Kibera, Nairobi", phone: "", status: "open", left: "30%", top: "65%" },
  { id: 8, name: "Karen Gated Court", legend: "The Mamba Court", district: "Karen", address: "Karen, Nairobi", phone: "", status: "hire", left: "35%", top: "78%" },
  { id: 9, name: "Camp Toyoyo", legend: "The Jackson Park", district: "Eastleigh", address: "Jericho, Eastleigh", phone: "", status: "open", left: "65%", top: "44%" },
  { id: 10, name: "Langata Sports Club", legend: "The Mamba Court", district: "Langata", address: "Langata Rd, Nairobi", phone: "", status: "hire", left: "42%", top: "72%" },
];

export default function MapHero() {
  const [hovered, setHovered] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAC, setShowAC] = useState(false);
  const filters = ["All", "Schools", "Sports Clubs", "Gated", "Hirable"];
  const suggestions = ["Court in Westlands", "Court in Karen", "Court in Kasarani", "The Sepolia", "The Mamba Court", "Parklands Sports Club", "USIU Africa"];
  const acList = search.length === 0 ? suggestions.slice(0, 6) : COURTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => c.name);
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/nairobi-map.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(0.3) brightness(0.35) contrast(1.2)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(10,10,10,0.55)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#E8570C", letterSpacing: "5px", marginBottom: "0.75rem" }}>SPLINTERS</div>
        <div style={{ position: "relative", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(10,10,10,0.92)", border: "1px solid rgba(232,87,12,0.4)", borderRadius: "100px", padding: "0.6rem 1.25rem" }}>
            <input type="text" placeholder="Court in..." value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setShowAC(true)} onBlur={() => setTimeout(() => setShowAC(false), 200)} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F5F2EE", fontSize: "0.85rem" }} />
          </div>
          {showAC && acList.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(8,8,8,0.98)", border: "1px solid rgba(232,87,12,0.4)", borderTop: "none", borderRadius: "0 0 16px 16px", zIndex: 100 }}>
              {acList.slice(0, 7).map((s, i) => (
                <div key={i} style={{ padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.78rem", color: "#F5F2EE" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,87,12,0.1)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onMouseDown={() => { setSearch(s); setShowAC(false); }}>{s}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: "0.28rem 0.85rem", background: activeFilter === f ? "#E8570C" : "rgba(10,10,10,0.88)", border: "1px solid " + (activeFilter === f ? "#E8570C" : "rgba(255,255,255,0.12)"), color: activeFilter === f ? "#111" : "rgba(255,255,255,0.55)", borderRadius: "100px", fontSize: "0.68rem", whiteSpace: "nowrap", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50, background: "rgba(10,10,10,0.92)", border: "1px solid rgba(232,87,12,0.3)", borderRadius: "10px", padding: "0.5rem 0.85rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#E8570C", lineHeight: 1 }}>63</div>
        <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Courts</div>
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        {COURTS.map(court => (
          <div key={court.id} style={{ position: "absolute", left: court.left, top: court.top, transform: "translate(-50%, -100%)", cursor: "pointer", zIndex: hovered === court.id ? 30 : 20 }} onMouseEnter={() => setHovered(court.id)} onMouseLeave={() => setHovered(null)}>
            <div style={{ background: "rgba(10,10,10,0.88)", border: "1px solid " + (hovered === court.id ? "#E8570C" : "rgba(232,87,12,0.35)"), borderRadius: "6px", padding: "3px 7px", textAlign: "center", whiteSpace: "nowrap", marginBottom: "2px" }}>
              <div style={{ fontSize: "9px", color: "#F5F2EE", fontWeight: 500 }}>{court.name}</div>
              <div style={{ fontSize: "7px", color: "#E8570C", fontStyle: "italic" }}>{court.legend}</div>
            </div>
            <div style={{ width: "1px", height: "10px", background: "rgba(232,87,12,0.4)", margin: "0 auto" }} />
            <div style={{ width: "12px", height: "12px", background: "#E8570C", border: "2px solid white", borderRadius: "50%", margin: "0 auto", boxShadow: "0 0 8px rgba(232,87,12,0.6)" }} />
            {hovered === court.id && (
              <div style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: "#0D1B2A", border: "1px solid rgba(232,87,12,0.55)", borderRadius: "12px", padding: "0.85rem 1rem", minWidth: "200px", zIndex: 60, pointerEvents: "none" }}>
                <div style={{ fontWeight: "bold", color: "#E8570C", fontSize: "0.95rem" }}>{court.name}</div>
                <div style={{ fontSize: "0.62rem", color: "rgba(255,200,80,0.7)", fontStyle: "italic", marginBottom: "4px" }}>{court.legend}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>📍 {court.address}</div>
                {court.phone !== "" && <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>📞 {court.phone}</div>}
                <div style={{ marginTop: "5px", display: "inline-block", color: court.status === "open" ? "#1DB954" : "#E8570C", fontSize: "0.58rem", padding: "2px 8px", borderRadius: "100px", border: "1px solid currentColor" }}>{court.status === "open" ? "OPEN NOW" : "HIRABLE"}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 40, padding: "0.6rem 1rem 0.8rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {COURTS.map(court => (
            <div key={court.id} style={{ background: "rgba(8,8,8,0.95)", border: "1px solid rgba(232,87,12,0.18)", borderRadius: "10px", padding: "0.45rem 0.75rem", flexShrink: 0, cursor: "pointer", minWidth: "140px" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "#F5F2EE" }}>{court.name}</div>
              <div style={{ fontSize: "0.57rem", color: "#E8570C", fontStyle: "italic", marginTop: "1px" }}>{court.legend}</div>
              <div style={{ fontSize: "0.55rem", color: court.status === "open" ? "#1DB954" : "#E8570C", marginTop: "2px" }}>{court.status === "open" ? "OPEN NOW" : "HIRABLE"}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}