"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [courts, setCourts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("courts").select("*").order("name").then(({ data }) => {
      if (data) setCourts(data);
    });
  }, []);

  async function searchGooglePlaces(query: string) {
    if (!query || query.length < 3) return;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' Nairobi basketball')}&key=${key}`;
    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) setPlaceSuggestions(data.results.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  }

  async function importFromGoogle(place: any) {
    if (!selected) return;
    const updated = {
      ...selected,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.formatted_address,
      place_id: place.place_id,
      google_rating: place.rating || selected.google_rating,
      google_reviews: place.user_ratings_total || selected.google_reviews,
    };
    setSelected(updated);
    setPlaceSuggestions([]);
    setPlaceSearch("");
    setMsg("Location imported from Google. Click Save to update.");
  }

  async function saveCourt() {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase.from("courts").update({
      name: selected.name,
      legend: selected.legend,
      district: selected.district,
      address: selected.address,
      phone: selected.phone,
      whatsapp: selected.whatsapp,
      type: selected.type,
      surface: selected.surface,
      lights: selected.lights,
      hirable: selected.hirable,
      membership: selected.membership,
      membership_fee: selected.membership_fee,
      rating: selected.rating,
      reviews: selected.reviews,
      status: selected.status,
      featured: selected.featured,
      description: selected.description,
      lat: selected.lat,
      lng: selected.lng,
      place_id: selected.place_id,
      google_rating: selected.google_rating,
      google_reviews: selected.google_reviews,
    }).eq("id", selected.id);
    setSaving(false);
    if (error) {
      setMsg("Error: " + error.message);
    } else {
      setMsg("Saved successfully!");
      setCourts(courts.map(c => c.id === selected.id ? selected : c));
      setTimeout(() => setMsg(""), 3000);
    }
  }

  async function addNewCourt() {
    const { data, error } = await supabase.from("courts").insert({
      name: "New Court",
      legend: "",
      district: "Nairobi",
      address: "",
      phone: "",
      whatsapp: "254700000000",
      type: "Neighbourhood",
      surface: "Outdoor",
      lights: false,
      hirable: false,
      membership: false,
      status: "open",
      featured: false,
      description: "",
      highlights: [],
      rating: 0,
      reviews: 0,
    }).select().single();
    if (!error && data) {
      setCourts([...courts, data]);
      setSelected(data);
    }
  }

  const F = ({ label, field, type = "text" }: { label: string; field: string; type?: string }) => (
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</label>
      {type === "textarea" ? (
        <textarea value={selected?.[field] || ""} onChange={e => setSelected({ ...selected, [field]: e.target.value })}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", resize: "vertical", minHeight: "80px", outline: "none", fontFamily: "inherit" }} />
      ) : type === "checkbox" ? (
        <input type="checkbox" checked={selected?.[field] || false} onChange={e => setSelected({ ...selected, [field]: e.target.checked })}
          style={{ width: "18px", height: "18px", accentColor: "#E8570C" }} />
      ) : (
        <input type={type} value={selected?.[field] || ""} onChange={e => setSelected({ ...selected, [field]: e.target.value })}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", outline: "none" }} />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F5F2EE", fontFamily: "sans-serif" }}>
      <div style={{ background: "rgba(10,10,10,0.98)", borderBottom: "1px solid rgba(232,87,12,0.2)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/splinters-logo.jpg" style={{ width: "36px", height: "36px", borderRadius: "50%" }} alt="logo" />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#E8570C", letterSpacing: "3px" }}>SPLINTERS ADMIN</span>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.8rem" }}>← Back to Site</a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "calc(100vh - 60px)" }}>

        {/* SIDEBAR — court list */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: "1rem" }}>
          <button onClick={addNewCourt}
            style={{ width: "100%", background: "#E8570C", color: "#111", border: "none", borderRadius: "8px", padding: "0.6rem", fontWeight: "600", cursor: "pointer", marginBottom: "1rem", fontSize: "0.82rem" }}>
            + Add New Court
          </button>
          {courts.map(court => (
            <div key={court.id} onClick={() => { setSelected(court); setMsg(""); }}
              style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", marginBottom: "0.3rem", cursor: "pointer", background: selected?.id === court.id ? "rgba(232,87,12,0.15)" : "transparent", border: "1px solid " + (selected?.id === court.id ? "rgba(232,87,12,0.4)" : "transparent"), transition: "all 0.15s" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: selected?.id === court.id ? "500" : "400", color: selected?.id === court.id ? "#E8570C" : "#F5F2EE" }}>{court.name}</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>{court.district} · {court.status}</div>
            </div>
          ))}
        </div>

        {/* MAIN EDITOR */}
        {selected ? (
          <div style={{ overflowY: "auto", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#F5F2EE" }}>{selected.name}</div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("Error") ? "#ff6b6b" : "#1DB954", padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "100px" }}>{msg}</span>}
                <button onClick={saveCourt} disabled={saving}
                  style={{ background: "#E8570C", color: "#111", border: "none", borderRadius: "8px", padding: "0.6rem 1.5rem", fontWeight: "600", cursor: "pointer", fontSize: "0.82rem" }}>
                  {saving ? "Saving..." : "Save Court"}
                </button>
              </div>
            </div>

            {/* Google Places Import */}
            <div style={{ background: "rgba(232,87,12,0.06)", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#E8570C", fontWeight: "600", marginBottom: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>📍 Import from Google Maps</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>
                Go to <strong style={{ color: "#E8570C" }}>maps.google.com</strong> → find the court → copy the coordinates from the URL or share link → paste below.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>Latitude</label>
                  <input type="number" step="0.0001" value={selected?.lat || ""} onChange={e => setSelected({ ...selected, lat: parseFloat(e.target.value) })}
                    placeholder="-1.2636"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>Longitude</label>
                  <input type="number" step="0.0001" value={selected?.lng || ""} onChange={e => setSelected({ ...selected, lng: parseFloat(e.target.value) })}
                    placeholder="36.8070"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", outline: "none" }} />
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "0.5rem 0.75rem" }}>
                💡 How to get coordinates: Open Google Maps → right-click on the exact location → the coordinates appear at the top of the menu. Copy them here.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#E8570C", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: "600" }}>Basic Info</div>
                <F label="Court Name" field="name" />
                <F label="Legend Name (e.g. The Sepolia)" field="legend" />
                <F label="District" field="district" />
                <F label="Full Address" field="address" />
                <F label="Phone Number" field="phone" />
                <F label="WhatsApp Number (with country code)" field="whatsapp" />
                <F label="Description" field="description" type="textarea" />
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#E8570C", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: "600" }}>Details</div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.25rem" }}>Type</label>
                  <select value={selected?.type || ""} onChange={e => setSelected({ ...selected, type: e.target.value })}
                    style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", outline: "none" }}>
                    <option>Sports Club</option>
                    <option>School Court</option>
                    <option>Neighbourhood</option>
                    <option>Gated Community</option>
                    <option>Institution</option>
                  </select>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.25rem" }}>Status</label>
                  <select value={selected?.status || "open"} onChange={e => setSelected({ ...selected, status: e.target.value })}
                    style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem", color: "#F5F2EE", fontSize: "0.82rem", outline: "none" }}>
                    <option value="open">Open Now</option>
                    <option value="hire">Hirable</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <F label="Surface (e.g. Outdoor Tarmac)" field="surface" />
                <F label="Membership Fee (e.g. KES 3,500/month)" field="membership_fee" />
                <F label="Rating (0-5)" field="rating" type="number" />
                <F label="Number of Reviews" field="reviews" type="number" />
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {[["lights", "Has Lights"], ["hirable", "Hirable"], ["membership", "Has Membership"], ["featured", "Featured"]].map(([field, label]) => (
                    <label key={field} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
                      <input type="checkbox" checked={selected?.[field] || false} onChange={e => setSelected({ ...selected, [field]: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#E8570C" }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Current coords display */}
            <div style={{ marginTop: "1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "0.75rem 1rem" }}>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.4rem" }}>Current Map Position</div>
              <div style={{ fontSize: "0.82rem", color: "#E8570C" }}>
                {selected?.lat && selected?.lng ? `${selected.lat}, ${selected.lng}` : "No coordinates set"}
              </div>
              {selected?.lat && selected?.lng && (
                <a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.72rem", color: "#E8570C", textDecoration: "none", background: "rgba(232,87,12,0.08)", padding: "3px 10px", borderRadius: "100px", border: "1px solid rgba(232,87,12,0.2)" }}>
                  View on Google Maps →
                </a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.9rem" }}>
            ← Select a court to edit
          </div>
        )}
      </div>
    </div>
  );
}