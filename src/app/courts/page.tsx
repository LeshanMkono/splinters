"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";

const DISTRICTS = ["All", "Westlands", "Kasarani", "Langata", "Karen", "Kibera", "Parklands", "Lavington", "Umoja", "Komarock", "Nairobi CBD", "Ridgeways", "Ruiru", "Kiungani"];

export default function CourtsPage() {
  const [courts, setCourts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAC, setShowAC] = useState(false);
  const [district, setDistrict] = useState("All");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat:number,lng:number}|null>(null);
  const [locationAsked, setLocationAsked] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [nearby, setNearby] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("courts").select("*").order("rating", { ascending: false }).then(({ data }) => {
      if (data) { setCourts(data); setFiltered(data); }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let results = courts;
    if (district !== "All") results = results.filter(c => c.district === district);
    if (search) results = results.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.district?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, district, courts]);

  function requestLocation() {
    setLocationAsked(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        const sorted = [...courts].filter(c => c.lat && c.lng).sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.lat - loc.lat, 2) + Math.pow(a.lng - loc.lng, 2));
          const distB = Math.sqrt(Math.pow(b.lat - loc.lat, 2) + Math.pow(b.lng - loc.lng, 2));
          return distA - distB;
        }).slice(0, 4);
        setNearby(sorted);
      },
      () => setLocationDenied(true)
    );
  }

  function getDistance(court: any) {
    if (!userLocation || !court.lat || !court.lng) return null;
    const R = 6371;
    const dLat = (court.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (court.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(userLocation.lat*Math.PI/180)*Math.cos(court.lat*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  }

  const acSuggestions = search.length > 0 ? filtered.slice(0, 6) : [];

  const CourtCard = ({ court }: { court: any }) => {
    const dist = getDistance(court);
    return (
      <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", transition: "all 0.25s", cursor: "pointer" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,87,12,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
        <div style={{ height: "140px", background: "linear-gradient(135deg, #1a0800, #0d1b2a)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {court.image_url ? (
            <img src={court.image_url} alt={court.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ fontSize: "3rem", opacity: 0.3 }}>🏀</div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: court.status === "open" ? "rgba(29,185,84,0.92)" : "rgba(232,87,12,0.92)", color: "#111", fontSize: "0.55rem", padding: "2px 8px", borderRadius: "100px", fontWeight: "600" }}>
            {court.status === "open" ? "● OPEN" : "HIRE"}
          </div>
          {dist && (
            <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(10,10,10,0.85)", color: "#E8570C", fontSize: "0.55rem", padding: "2px 8px", borderRadius: "100px", border: "1px solid rgba(232,87,12,0.3)" }}>
              📍 {dist}km
            </div>
          )}
          {court.legend && (
            <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", background: "rgba(10,10,10,0.85)", border: "1px solid rgba(232,87,12,0.3)", borderRadius: "4px", padding: "1px 6px" }}>
              <div style={{ fontSize: "0.55rem", color: "#E8570C", fontStyle: "italic" }}>{court.legend}</div>
            </div>
          )}
        </div>
        <div style={{ padding: "1rem" }}>
          <div style={{ fontWeight: "600", fontSize: "0.88rem", color: "#F5F2EE", marginBottom: "3px", lineHeight: 1.2 }}>{court.name}</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>📍 {court.district || "Nairobi"}</div>
          {court.rating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.round(court.rating) ? "#FFD700" : "rgba(255,255,255,0.15)", fontSize: "0.65rem" }}>★</span>
              ))}
              <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)" }}>{court.rating} ({court.reviews || 0})</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            {court.lat && court.lng && (
              <a href={"https://www.google.com/maps/dir/?api=1&destination=" + court.lat + "," + court.lng}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: "#E8570C", color: "#111", padding: "0.5rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", fontWeight: "600", textAlign: "center" }}>
                🗺️ Directions
              </a>
            )}
            {court.place_id && (
              <a href={"https://www.google.com/maps/place/?q=place_id:" + court.place_id}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", padding: "0.5rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                View on Maps
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar />

      {/* Location consent banner */}
      {!locationAsked && (
        <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "#0D1B2A", border: "1px solid rgba(232,87,12,0.4)", borderRadius: "16px", padding: "1rem 1.5rem", maxWidth: "480px", width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>📍</div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.88rem", color: "#F5F2EE", marginBottom: "3px" }}>Find courts near you</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Allow Splinters to use your location to show basketball courts closest to where you are right now.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={requestLocation}
              style={{ flex: 1, background: "#E8570C", color: "#111", border: "none", borderRadius: "100px", padding: "0.6rem", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer" }}>
              Allow Location
            </button>
            <button onClick={() => setLocationAsked(true)}
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "0.6rem", fontSize: "0.8rem", cursor: "pointer" }}>
              Not Now
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ padding: "8rem 1.5rem 3rem", background: "linear-gradient(180deg, #1a0600 0%, #0A0A0A 100%)", textAlign: "center" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.75rem" }}>
          Nairobi · {courts.length}+ Verified Courts
        </div>
        <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem,8vw,6rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "1rem" }}>
          FIND YOUR<br/><span style={{ color: "#E8570C" }}>COURT</span>
        </div>
        <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Every verified basketball court in Nairobi. Search your area, get directions, show up.
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,87,12,0.4)", borderRadius: showAC && acSuggestions.length > 0 ? "16px 16px 0 0" : "100px", padding: "0.75rem 1.25rem", backdropFilter: "blur(16px)" }}>
            <span style={{ color: "#E8570C" }}>🔍</span>
            <input ref={searchRef} type="text" placeholder="Basketball court in Westlands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowAC(true)}
              onBlur={() => setTimeout(() => setShowAC(false), 200)}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F5F2EE", fontSize: "0.9rem" }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1rem" }}>✕</button>
            )}
          </div>
          {showAC && acSuggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(8,8,8,0.98)", border: "1px solid rgba(232,87,12,0.4)", borderTop: "none", borderRadius: "0 0 16px 16px", zIndex: 100, backdropFilter: "blur(16px)" }}>
              {acSuggestions.map((c, i) => (
                <div key={i} style={{ padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "0.82rem", color: "#F5F2EE", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(232,87,12,0.1)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  onMouseDown={() => { setSearch(c.name); setShowAC(false); }}>
                  <span>🏀 {c.name}</span>
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>{c.district}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 5rem" }}>

        {/* Nearby section */}
        {nearby.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.5rem" }}>📍 Nearest to you</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#F5F2EE", marginBottom: "1.5rem" }}>COURTS NEAR YOU</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "1rem" }}>
              {nearby.map(c => <CourtCard key={c.id} court={c} />)}
            </div>
          </div>
        )}

        {/* District filters */}
        <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "2rem", scrollbarWidth: "none" }}>
          {DISTRICTS.map(d => (
            <button key={d} onClick={() => setDistrict(d)}
              style={{ padding: "0.3rem 0.85rem", background: district === d ? "#E8570C" : "rgba(255,255,255,0.04)", border: "1px solid " + (district === d ? "#E8570C" : "rgba(255,255,255,0.1)"), color: district === d ? "#111" : "rgba(255,255,255,0.5)", borderRadius: "100px", fontSize: "0.7rem", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, fontWeight: district === d ? "600" : "400", transition: "all 0.2s" }}>
              {d}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem", letterSpacing: "1px" }}>
          {loading ? "Loading courts..." : `${filtered.length} courts found${search ? " for \"" + search + "\"" : ""}`}
        </div>

        {/* Courts grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>Loading Nairobi courts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏀</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No courts found for "{search}"</div>
            <button onClick={() => { setSearch(""); setDistrict("All"); }} style={{ marginTop: "1rem", background: "#E8570C", color: "#111", border: "none", borderRadius: "100px", padding: "0.6rem 1.5rem", cursor: "pointer", fontWeight: "600" }}>Clear Search</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1.25rem" }}>
            {filtered.map(court => <CourtCard key={court.id} court={court} />)}
          </div>
        )}
      </div>
    </main>
  );
}
