"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const GREEN = "#4CAF50";

const CATEGORIES = [
  {
    id: "gigiri", name: "The Gigiri Strip",
    subtitle: "4 venues · Gigiri & North Westlands",
    color: "#4CAF50",
    desc: "Four padel venues clustered within 3km along the Gigiri corridor — the most padel-dense zone in Nairobi.",
    venues: [
      { name: "Networks Padel Village", area: "Gigiri", lat: -1.2334962, lng: 36.8034982, rating: 4.6, reviews: 26, courts: 6, phone: "+254 117 917777", hours: "6am–11pm", highlight: "East Africa's largest — 6 Adidas courts", website: "https://www.padelvillageke.com/", dist: "0.0km anchor" },
      { name: "Gigiri Social Club", area: "Gigiri", lat: -1.2308384, lng: 36.8055038, rating: 4.7, reviews: 71, courts: 3, phone: "+254 798 400900", hours: "7am–10pm", highlight: "Padel + sauna + wellness club", website: "https://gigirisocialclub.com/", dist: "0.4km from above" },
      { name: "SD Padel Gigiri Courtyard", area: "Gigiri", lat: -1.233069, lng: 36.8072367, rating: 2.8, reviews: 4, courts: 2, phone: "+254 741 012345", hours: "9am–12am", highlight: "Budget option, open late", website: "", dist: "0.4km cluster" },
      { name: "Padel Kenya Westlands", area: "Westlands", lat: -1.25893, lng: 36.8025954, rating: 4.7, reviews: 32, courts: 2, phone: "+254 798 500900", hours: "7am–11pm", highlight: "World-class courts opposite Sarit Centre", website: "http://padeltenniskenya.com/", dist: "2.8km south" },
    ]
  },
  {
    id: "westlands", name: "Westlands Hub",
    subtitle: "5 venues · Westlands & Parklands",
    color: "#FF9800",
    desc: "Five padel venues packed into a 2.5km radius in Westlands — Nairobi's most accessible padel cluster.",
    venues: [
      { name: "Rackets & Rounds", area: "Westlands", lat: -1.2685714, lng: 36.8071194, rating: 5.0, reviews: 19, courts: 2, phone: "+254 116 376245", hours: "6am–10pm", highlight: "Perfect 5.0 — hidden gem with great food", website: "", dist: "0.0km anchor" },
      { name: "Padel 254 — Goan Gymkhana", area: "Westlands", lat: -1.2727123, lng: 36.8162265, rating: 4.8, reviews: 17, courts: 4, phone: "+254 741 254000", hours: "7am–10pm", highlight: "Premier Padel standard + gelato bar", website: "", dist: "1.1km away" },
      { name: "Ace Padel Kenya", area: "Westlands", lat: -1.2603217, lng: 36.8236629, rating: 4.0, reviews: 4, courts: 2, phone: "", hours: "7am–10pm", highlight: "World Padel Tour standard courts", website: "http://www.acepadel.ke/", dist: "2.1km away" },
      { name: "PRO PADEL Nairobi", area: "Westlands", lat: -1.2679413, lng: 36.827753, rating: 3.6, reviews: 11, courts: 3, phone: "", hours: "4pm–11:30pm wkdays", highlight: "Late night sessions until 11:30pm", website: "", dist: "2.3km away" },
      { name: "PlayOn Padel — Westlands", area: "Westlands", lat: -1.2646437, lng: 36.7873352, rating: 4.7, reviews: 15, courts: 3, phone: "+254 707 036455", hours: "7am–10pm", highlight: "Vibrant atmosphere. Evening games. Café", website: "https://www.playonpadel.co.ke/", dist: "2.2km away" },
    ]
  },
  {
    id: "westside", name: "The West Side",
    subtitle: "4 venues · Kitisuru, Loresho & Lavington",
    color: "#9C27B0",
    desc: "A quieter, more intimate cluster west of the city — within 3km of each other.",
    venues: [
      { name: "Zen Padel — Zen Garden", area: "Kitisuru", lat: -1.2445651, lng: 36.769689, rating: 4.5, reviews: 120, courts: 2, phone: "+254 714 744231", hours: "7am–10pm", highlight: "Padel on a stunning garden terrace + bar", website: "http://www.zengarden.co.ke/", dist: "1.1km from 254RC" },
      { name: "254 Racquet Club", area: "Loresho", lat: -1.2509689, lng: 36.7620179, rating: 4.6, reviews: 52, courts: 2, phone: "+254 719 254254", hours: "7am–10pm", highlight: "Padel + tennis. Beautiful family club", website: "https://www.254racquetclub.com/", dist: "0.0km anchor" },
      { name: "PlayOn Padel — Lavington", area: "Lavington", lat: -1.2762393, lng: 36.7698247, rating: 4.4, reviews: 10, courts: 3, phone: "+254 706 668702", hours: "6am–10pm", highlight: "Kenya's first padel club. Indoor & outdoor", website: "https://www.playonpadel.co.ke/", dist: "0.7km cluster" },
      { name: "Arena Padel", area: "Lavington", lat: -1.2786514, lng: 36.7758888, rating: 4.5, reviews: 2, courts: 2, phone: "", hours: "By appointment", highlight: "Private, intimate courts — focused atmosphere", website: "", dist: "0.7km cluster" },
    ]
  },
  {
    id: "unique", name: "Unique Padel Spots",
    subtitle: "4 venues · Karen, Ridgeways, South B & Tigoni",
    color: "#E91E63",
    desc: "Four standout venues off the beaten track — each unique in setting, each worth the drive.",
    venues: [
      { name: "The Padel Point Kenya", area: "Karen", lat: -1.309499, lng: 36.7432928, rating: 4.9, reviews: 25, courts: 4, phone: "+254 712 351237", hours: "7am–11pm", highlight: "Highest rated in Kenya — Ngong Racecourse", website: "http://thepadelpointkenya.com/", dist: "Standalone · Karen" },
      { name: "Ridgeway Padel Club", area: "Ridgeways", lat: -1.2219798, lng: 36.846092, rating: 4.9, reviews: 7, courts: 2, phone: "+254 741 012345", hours: "8am–11pm", highlight: "Free racquets. Beginner clinics. 4.9 rating", website: "", dist: "Standalone · Ridgeways" },
      { name: "Duma Padel — Ole Sereni", area: "South B", lat: -1.3272009, lng: 36.8449047, rating: 3.0, reviews: 2, courts: 1, phone: "+254 731 436000", hours: "5am–10pm", highlight: "Hotel padel with National Park views", website: "https://ole-sereni.com/", dist: "Standalone · South B" },
      { name: "Destination Padel", area: "Tigoni", lat: -1.1537338, lng: 36.7289707, rating: 5.0, reviews: 5, courts: 2, phone: "+254 713 732451", hours: "7am–8pm", highlight: "Scenic forest setting. Wednesday mixers", website: "", dist: "Standalone · Tigoni" },
    ]
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FFD700" : "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>★</span>
      ))}
    </div>
  );
}

function VenueCard({ venue, color, active }: { venue: any; color: string; active: boolean }) {
  return (
    <div style={{
      background: "#0D1117",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.06)"}`,
      borderRadius: "16px", padding: "1.25rem",
      minWidth: "280px", maxWidth: "320px",
      transition: "all 0.5s ease",
      opacity: active ? 1 : 0.35,
      transform: active ? "scale(1)" : "scale(0.92)",
      filter: active ? "none" : "blur(1px)",
      flexShrink: 0,
      boxShadow: active ? `0 0 30px ${color}22` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
        <div>
          <div style={{ fontSize: "0.5rem", letterSpacing: "2px", textTransform: "uppercase", color, marginBottom: "0.2rem" }}>📍 {venue.area}</div>
          <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#F5F2EE", lineHeight: 1.2, maxWidth: "200px" }}>{venue.name}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.6rem", color, lineHeight: 1 }}>{venue.rating}</div>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>{venue.reviews} reviews</div>
        </div>
      </div>
      <StarRating rating={venue.rating} />
      <div style={{ fontSize: "0.68rem", color, fontStyle: "italic", margin: "0.6rem 0", lineHeight: 1.4 }}>{venue.highlight}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
        {[`🎾 ${venue.courts} ${venue.courts === 1 ? "court" : "courts"}`, `🕐 ${venue.hours}`, venue.dist].map((tag, i) => (
          <span key={i} style={{ fontSize: "0.5rem", padding: "2px 7px", borderRadius: "100px", background: `${color}15`, border: `1px solid ${color}30`, color: "rgba(255,255,255,0.5)" }}>{tag}</span>
        ))}
      </div>
      {venue.phone && <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>📞 {venue.phone}</div>}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, background: "#4CAF50", color: "#111", padding: "0.45rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.65rem", fontWeight: "700", textAlign: "center" }}>
          🗺️ Directions
        </a>
        {venue.website && (
          <a href={venue.website} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "0.45rem 0", borderRadius: "100px", textDecoration: "none", fontSize: "0.65rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            Website
          </a>
        )}
      </div>
    </div>
  );
}

function CategorySlider({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const venues = cat.venues;
  const prev = () => setActiveIdx(i => (i - 1 + venues.length) % venues.length);
  const next = () => setActiveIdx(i => (i + 1) % venues.length);
  const getIdx = (offset: number) => (activeIdx + offset + venues.length) % venues.length;
  return (
    <div style={{ marginBottom: "4rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingLeft: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
          <div style={{ width: "4px", height: "32px", background: cat.color, borderRadius: "2px" }} />
          <div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#F5F2EE", lineHeight: 1 }}>{cat.name}</div>
            <div style={{ fontSize: "0.62rem", color: cat.color, letterSpacing: "2px", textTransform: "uppercase" }}>{cat.subtitle}</div>
          </div>
        </div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "600px", marginLeft: "1rem", paddingLeft: "0.5rem" }}>{cat.desc}</div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to right, #0A0A0A, transparent)", zIndex: 10, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to left, #0A0A0A, transparent)", zIndex: 10, pointerEvents: "none" }} />
        <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", alignItems: "center", padding: "1rem 80px", overflow: "hidden" }}>
          {venues.length >= 3 && <VenueCard venue={venues[getIdx(-1)]} color={cat.color} active={false} />}
          <VenueCard venue={venues[activeIdx]} color={cat.color} active={true} />
          {venues.length >= 2 && <VenueCard venue={venues[getIdx(1)]} color={cat.color} active={false} />}
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={prev} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: `1px solid ${cat.color}44`, color: cat.color, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {venues.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{ width: i === activeIdx ? "20px" : "6px", height: "6px", borderRadius: "100px", background: i === activeIdx ? cat.color : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
            ))}
          </div>
          <button onClick={next} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: `1px solid ${cat.color}44`, color: cat.color, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
        <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>{activeIdx + 1} / {venues.length}</div>
      </div>
    </div>
  );
}

export default function PadelPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).google) { initMap(); return; }
    if (document.querySelector('script[src*="maps.googleapis"]')) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => { setMapLoaded(true); initMap(); };
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current || !(window as any).google) return;
    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: -1.265, lng: 36.795 }, zoom: 12,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0d1117" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8a9bb0" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0d1117" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2332" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0f1a" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
      disableDefaultUI: true, zoomControl: true,
    });
    const catColors: Record<string, string> = { gigiri: "#4CAF50", westlands: "#FF9800", westside: "#9C27B0", unique: "#E91E63" };
    CATEGORIES.forEach(cat => {
      cat.venues.forEach(venue => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng }, map, title: venue.name,
          icon: { path: (window as any).google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: catColors[cat.id], fillOpacity: 0.95, strokeColor: "#ffffff", strokeWeight: 2 }
        });
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `<div style="background:#0D1117;color:#F5F2EE;padding:0.75rem;border-radius:8px;font-family:DM Sans,sans-serif;min-width:180px;">
            <div style="font-size:0.55rem;letter-spacing:2px;text-transform:uppercase;color:${catColors[cat.id]};margin-bottom:0.2rem;">${venue.area}</div>
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.3rem;">${venue.name}</div>
            <div style="color:#FFD700;font-size:0.7rem;margin-bottom:0.3rem;">★ ${venue.rating} (${venue.reviews} reviews)</div>
            <div style="font-size:0.65rem;color:rgba(255,255,255,0.5);">🎾 ${venue.courts} courts · ${venue.hours}</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}" target="_blank"
              style="display:block;margin-top:0.5rem;background:#4CAF50;color:#111;padding:4px 10px;border-radius:100px;text-decoration:none;font-size:0.6rem;font-weight:700;text-align:center;">Get Directions</a>
          </div>`
        });
        marker.addListener("click", () => infoWindow.open(map, marker));
      });
    });
  };

  const allVenues = CATEGORIES.flatMap(c => c.venues);
  const totalCourts = allVenues.reduce((sum, v) => sum + v.courts, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Padel Courts in Nairobi, Kenya",
  "description": "Complete directory of verified padel courts in Nairobi. 17 venues across Westlands, Gigiri, Karen, Lavington and Ridgeways.",
  "url": "https://splinters.co.ke/padel",
  "numberOfItems": 17,
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Networks Padel Village", "url": "https://maps.google.com/?q=Networks+Padel+Village+Gigiri+Nairobi"},
    {"@type": "ListItem", "position": 2, "name": "The Padel Point Kenya", "url": "https://maps.google.com/?q=The+Padel+Point+Kenya+Ngong+Racecourse"},
    {"@type": "ListItem", "position": 3, "name": "Rackets and Rounds", "url": "https://maps.google.com/?q=Rackets+Rounds+Westlands+Nairobi"},
    {"@type": "ListItem", "position": 4, "name": "Padel 254 Goan Gymkhana", "url": "https://maps.google.com/?q=Padel+254+Goan+Gymkhana+Nairobi"},
    {"@type": "ListItem", "position": 5, "name": "Gigiri Social Club", "url": "https://maps.google.com/?q=Gigiri+Social+Club+Nairobi"},
    {"@type": "ListItem", "position": 6, "name": "Ridgeway Padel Club", "url": "https://maps.google.com/?q=Ridgeway+Padel+Club+Nairobi"},
    {"@type": "ListItem", "position": 7, "name": "Padel Kenya Westlands", "url": "https://maps.google.com/?q=Padel+Kenya+Westlands+Nairobi"},
    {"@type": "ListItem", "position": 8, "name": "PlayOn Padel Westlands", "url": "https://maps.google.com/?q=PlayOn+Padel+Rhapta+Road+Westlands"},
    {"@type": "ListItem", "position": 9, "name": "Ace Padel Kenya", "url": "https://maps.google.com/?q=Ace+Padel+Kenya+Aga+Khan+Sports+Centre"},
    {"@type": "ListItem", "position": 10, "name": "254 Racquet Club", "url": "https://maps.google.com/?q=254+Racquet+Club+Loresho+Nairobi"},
    {"@type": "ListItem", "position": 11, "name": "Zen Padel Zen Garden", "url": "https://maps.google.com/?q=Zen+Padel+Zen+Garden+Kitisuru+Nairobi"},
    {"@type": "ListItem", "position": 12, "name": "PlayOn Padel Lavington", "url": "https://maps.google.com/?q=PlayOn+Padel+Jaffery+Sports+Club+Lavington"},
    {"@type": "ListItem", "position": 13, "name": "Arena Padel", "url": "https://maps.google.com/?q=Arena+Padel+Lavington+Nairobi"},
    {"@type": "ListItem", "position": 14, "name": "PRO PADEL Nairobi", "url": "https://maps.google.com/?q=PRO+PADEL+Forest+Road+Nairobi"},
    {"@type": "ListItem", "position": 15, "name": "SD Padel Gigiri Courtyard", "url": "https://maps.google.com/?q=SD+Padel+Gigiri+Courtyard+Nairobi"},
    {"@type": "ListItem", "position": 16, "name": "Duma Padel Ole Sereni", "url": "https://maps.google.com/?q=Duma+Padel+Ole+Sereni+Mombasa+Road"},
    {"@type": "ListItem", "position": 17, "name": "Destination Padel Tigoni", "url": "https://maps.google.com/?q=Destination+Padel+Tigoni+Kenya"}
  ]
}` }} />
    <main style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F2EE", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar />
      <div style={{ padding: "7rem 1.5rem 3rem", background: "linear-gradient(180deg, #0a1a00 0%, #0A0A0A 100%)", textAlign: "center" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", color: "#4CAF50", marginBottom: "0.5rem" }}>Nairobi · {allVenues.length} Verified Venues · {totalCourts}+ Courts</div>
        <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)", color: "#F5F2EE", lineHeight: 0.88, marginBottom: "0.75rem" }}>
          FIND YOUR<br /><span style={{ color: "#4CAF50" }}>PADEL COURT</span>
        </h1>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.7 }}>Every verified padel venue in Nairobi — grouped by location so you find the closest cluster to you.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
          {[["17", "Venues"], ["40+", "Courts"], ["4", "Clusters"], ["8", "Areas"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#4CAF50", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", height: "420px", background: "#0D1117", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(10,10,10,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.75rem 1rem", backdropFilter: "blur(10px)", zIndex: 10 }}>
          <div style={{ fontSize: "0.5rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Clusters</div>
          {[["#4CAF50","Gigiri Strip"],["#FF9800","Westlands Hub"],["#9C27B0","West Side"],["#E91E63","Unique Spots"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, border: "2px solid white" }} />
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "2rem 1.5rem 1rem", flexWrap: "wrap" }}>
        {[{ id: "all", label: "All Venues", color: "#4CAF50" }, ...CATEGORIES.map(c => ({ id: c.id, label: c.name, color: c.color }))].map(tab => (
          <button key={tab.id} onClick={() => setActiveCategory(tab.id)}
            style={{ padding: "0.4rem 1rem", borderRadius: "100px", border: `1px solid ${activeCategory === tab.id ? tab.color : "rgba(255,255,255,0.1)"}`, background: activeCategory === tab.id ? `${tab.color}22` : "transparent", color: activeCategory === tab.id ? tab.color : "rgba(255,255,255,0.4)", fontSize: "0.72rem", cursor: "pointer", fontWeight: activeCategory === tab.id ? "600" : "400", transition: "all 0.2s", fontFamily: "DM Sans, sans-serif" }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {CATEGORIES.filter(c => activeCategory === "all" || activeCategory === c.id).map(cat => (
          <CategorySlider key={cat.id} cat={cat} />
        ))}
      </div>
      <div style={{ background: "linear-gradient(180deg, #0A0A0A, #0a1a00)", padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(76,175,80,0.1)" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#4CAF50", marginBottom: "0.5rem" }}>Also on Splinters</div>
        <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#F5F2EE", marginBottom: "1rem" }}>31 BASKETBALL COURTS TOO 🏀</div>
        <a href="/courts" style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontWeight: "700", fontSize: "0.85rem" }}>Find Basketball Courts →</a>
      </div>
    </main>
    </>
  );
}
