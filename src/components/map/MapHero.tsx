"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const NAIROBI_CENTER = { lat: -1.2921, lng: 36.8219 };
const FILTERS = ["All", "Schools", "Sports Clubs", "Neighbourhood", "Gated", "Hirable"];
const SUGGESTIONS = ["Court in Westlands", "Court in Karen", "Court in Kasarani", "Court in Kibera", "Court in CBD", "The Sepolia", "The Mamba Court", "Parklands Sports Club", "USIU Africa"];

export default function MapHero() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [courts, setCourts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAC, setShowAC] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [chipStart, setChipStart] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  const acList = search.length === 0
    ? SUGGESTIONS.slice(0, 6)
    : courts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.district.toLowerCase().includes(search.toLowerCase())).map(c => c.name).slice(0, 8);

  useEffect(() => {
    async function fetchCourts() {
      const { data, error } = await supabase.from("courts").select("*").not("lat", "is", null);
      if (!error && data) setCourts(data);
    }
    fetchCourts();
  }, []);

  useEffect(() => {
    if (courts.length === 0) return;
    if (window.google && window.google.maps) { initMap(); return; }
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY + "&libraries=marker&v=weekly";
    script.async = true; script.defer = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, [courts]);

  function initMap() {
    if (!mapRef.current || !window.google) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: NAIROBI_CENTER, zoom: 12, mapId: "splinters_nairobi",
      disableDefaultUI: true, zoomControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c1a00" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#181818" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0a1f0a" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
      ],
    });
    mapInstanceRef.current = map;
    courts.forEach(court => {
      if (!court.lat || !court.lng) return;
      const pinEl = document.createElement("div");
      pinEl.style.cursor = "pointer";
      pinEl.style.transform = "translate(-50%, -100%)";
      pinEl.style.textAlign = "center";
      pinEl.innerHTML =
        '<div style="background:rgba(255,255,255,0.96);border:1.5px solid #E8570C;border-radius:6px;padding:3px 8px;white-space:nowrap;margin-bottom:2px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">' +
        '<div style="font-size:9px;color:#111;font-weight:600;">' + court.name + '</div>' +
        '</div>' +
        '<div style="width:1px;height:8px;background:#E8570C;margin:0 auto;"></div>' +
        '<div style="width:12px;height:12px;background:#E8570C;border:2px solid white;border-radius:50%;margin:0 auto;box-shadow:0 0 8px rgba(232,87,12,0.7);"></div>';
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map, position: { lat: Number(court.lat), lng: Number(court.lng) }, content: pinEl, title: court.name,
      });
      marker.addListener("click", () => {
        setSelectedCourt(court);
        map.panTo({ lat: Number(court.lat), lng: Number(court.lng) });
        map.setZoom(15);
      });
    });
    setMapLoaded(true);
  }

  const canPrev = chipStart > 0;
  const canNext = chipStart + 5 < courts.length;

  return (
    <section id="map" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {!mapLoaded && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>🏀</div>
          <div style={{ fontSize: "0.8rem", color: "#999", letterSpacing: "3px", textTransform: "uppercase" }}>Loading Nairobi Courts...</div>
        </div>
      )}

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, padding: "4.5rem 1rem 0" }}>
        <div style={{ position: "relative", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.97)", border: "1.5px solid #E8570C", borderRadius: "100px", padding: "0.6rem 1rem", backdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <span style={{ color: "#E8570C" }}>🔍</span>
            <input type="text" placeholder="Search courts..." value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowAC(true)}
              onBlur={() => setTimeout(() => setShowAC(false), 200)}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#111", fontSize: "0.85rem" }} />
          </div>
          {showAC && acList.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E8E8E8", borderTop: "none", borderRadius: "0 0 16px 16px", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              {acList.slice(0, 7).map((s, i) => (
                <div key={i} style={{ padding: "0.55rem 1rem", cursor: "pointer", fontSize: "0.82rem", color: "#333", display: "flex", justifyContent: "space-between" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#FFF5F0")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onMouseDown={() => { setSearch(s); setShowAC(false); }}>
                  <span>{s}</span>
                  <span style={{ fontSize: "0.6rem", color: "#E8570C" }}>⇥</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{ padding: "0.3rem 0.875rem", background: activeFilter === f ? "#E8570C" : "rgba(255,255,255,0.95)", border: "1.5px solid " + (activeFilter === f ? "#E8570C" : "rgba(255,255,255,0.8)"), color: activeFilter === f ? "#fff" : "#333", borderRadius: "100px", fontSize: "0.68rem", whiteSpace: "nowrap", cursor: "pointer", fontWeight: "600", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", top: "8.5rem", right: "1rem", zIndex: 50, background: "rgba(255,255,255,0.97)", border: "1.5px solid #E8570C", borderRadius: "10px", padding: "0.4rem 0.75rem", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#E8570C", lineHeight: 1 }}>{courts.length || 31}</div>
        <div style={{ fontSize: "0.5rem", color: "#999", letterSpacing: "1.5px", textTransform: "uppercase" }}>Courts</div>
      </div>

      {selectedCourt && (
        <div style={{ position: "absolute", top: "10rem", left: "1rem", zIndex: 50, background: "#fff", border: "1.5px solid #E8570C", borderRadius: "14px", padding: "1rem", minWidth: "230px", maxWidth: "270px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
          <button onClick={() => setSelectedCourt(null)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "1rem" }}>✕</button>
          <div style={{ fontWeight: "bold", color: "#E8570C", fontSize: "0.95rem", marginBottom: "2px" }}>{selectedCourt.name}</div>
          <div style={{ fontSize: "0.65rem", color: "#999", marginBottom: "6px" }}>{selectedCourt.district} · {selectedCourt.address}</div>
          {selectedCourt.surface && <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: "2px" }}>🏟 {selectedCourt.surface}</div>}
          {selectedCourt.phone && <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: "6px" }}>📞 {selectedCourt.phone}</div>}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <a href={"https://wa.me/" + selectedCourt.whatsapp} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#E8570C", color: "#fff", padding: "0.5rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", fontWeight: "700", textAlign: "center" }}>
              {selectedCourt.hirable ? "Book Court" : "WhatsApp"}
            </a>
            <a href={"https://www.google.com/maps/dir/?api=1&destination=" + selectedCourt.lat + "," + selectedCourt.lng}
              target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#F5F5F5", color: "#333", padding: "0.5rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", textAlign: "center" }}>
              🗺 Directions
            </a>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 40, padding: "0.5rem 0.75rem 0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button onClick={() => canPrev && setChipStart(Math.max(0, chipStart - 1))}
            style={{ width: "28px", height: "28px", borderRadius: "50%", background: canPrev ? "#E8570C" : "rgba(255,255,255,0.7)", border: "none", color: canPrev ? "#fff" : "#999", cursor: canPrev ? "pointer" : "default", flexShrink: 0, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>‹</button>
          <div style={{ display: "flex", gap: "0.4rem", flex: 1, overflow: "hidden" }}>
            {courts.map((court, idx) => {
              const pos = idx - chipStart;
              if (pos < 0 || pos > 4) return null;
              const opacity = pos === 0 || pos === 4 ? 0.5 : 1;
              return (
                <div key={court.id}
                  style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(232,87,12,0.2)", borderRadius: "8px", padding: "0.4rem 0.5rem", flex: 1, cursor: "pointer", transition: "all 0.2s", opacity, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                  onClick={() => { setSelectedCourt(court); if (mapInstanceRef.current && court.lat && court.lng) { mapInstanceRef.current.panTo({ lat: Number(court.lat), lng: Number(court.lng) }); mapInstanceRef.current.setZoom(15); } }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8570C"; e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(232,87,12,0.2)"; e.currentTarget.style.opacity = String(opacity); }}>
                  <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{court.name}</div>
                  <div style={{ fontSize: "0.5rem", color: court.status === "open" ? "#16A34A" : "#E8570C", marginTop: "1px", fontWeight: 600 }}>{court.status === "open" ? "OPEN" : "HIRE"}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => canNext && setChipStart(Math.min(courts.length - 5, chipStart + 1))}
            style={{ width: "28px", height: "28px", borderRadius: "50%", background: canNext ? "#E8570C" : "rgba(255,255,255,0.7)", border: "none", color: canNext ? "#fff" : "#999", cursor: canNext ? "pointer" : "default", flexShrink: 0, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>›</button>
        </div>
      </div>
    </section>
  );
}
