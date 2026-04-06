"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OW_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

const COURT_DISTRICTS = [
  { name: "Parklands", lat: -1.26737, lng: 36.81337 },
  { name: "Lavington", lat: -1.28333, lng: 36.76667 },
  { name: "Kasarani", lat: -1.2197, lng: 36.8963 },
  { name: "Karen", lat: -1.33, lng: 36.71 },
  { name: "Kibera", lat: -1.313, lng: 36.786 },
];

const WEATHER_ICONS: Record<string, string> = {
  Clear: "☀️", Clouds: "⛅", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Mist: "🌫️", Haze: "🌫️", Fog: "🌫️",
};

const PLAY_RATING: Record<string, { label: string; color: string }> = {
  Clear: { label: "Perfect conditions", color: "#4CAF50" },
  Clouds: { label: "Good to play", color: "#8BC34A" },
  Drizzle: { label: "Playable — light rain", color: "#FF9800" },
  Rain: { label: "Bring a jacket", color: "#FF5722" },
  Thunderstorm: { label: "Stay indoors", color: "#F44336" },
  Mist: { label: "Cool conditions", color: "#8BC34A" },
  Haze: { label: "Cool conditions", color: "#8BC34A" },
  Fog: { label: "Cool conditions", color: "#8BC34A" },
};

function getNextSessions() {
  const sessions = [];
  const today = new Date();
  for (let i = 0; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 6) {
      sessions.push({ date: new Date(d), day: "Saturday", court: "Parklands Sports Club", district: "Parklands", time: "4:00 PM", lat: -1.26737, lng: 36.81337, max: 10 });
    }
    if (day === 0) {
      sessions.push({ date: new Date(d), day: "Sunday", court: "Nairobi International School", district: "Lavington", time: "3:00 PM", lat: -1.28333, lng: 36.76667, max: 12 });
    }
    if (sessions.length >= 4) break;
  }
  return sessions;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<Record<string, any>>({});
  const [joined, setJoined] = useState<string[]>([]);
  const sessions = getNextSessions();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("members").select("*").eq("email", user.email).single();
      setMember(data);
      setLoading(false);
      fetchWeather();
    };
    load();
  }, []);

  const fetchWeather = async () => {
    const results: Record<string, any> = {};
    for (const d of COURT_DISTRICTS) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${d.lat}&lon=${d.lng}&appid=${OW_KEY}&units=metric`);
        const json = await res.json();
        results[d.name] = json;
      } catch {}
    }
    setWeather(results);
  };

  const toggleJoin = (sessionKey: string) => {
    setJoined(j => j.includes(sessionKey) ? j.filter(x => x !== sessionKey) : [...j, sessionKey]);
  };

  if (loading) return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏀</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Loading your dashboard...</div>
      </div>
    </main>
  );

  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", fontFamily: "DM Sans, sans-serif", color: "#F5F2EE" }}>

      {/* Navbar */}
      <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#E8570C", textDecoration: "none", letterSpacing: "3px" }}>SPLINTERS</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "1.5rem" }}>{member?.avatar || "🏀"}</div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "0.4rem 0.9rem", borderRadius: "100px", fontSize: "0.72rem", cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Member Dashboard</div>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 0.9, marginBottom: "0.5rem" }}>
            WELCOME BACK<br /><span style={{ color: "#E8570C" }}>{member?.name?.toUpperCase() || "BALLER"}</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
            {member?.tier === "free" ? "🎟️ Waitlist Member" : "✅ Active Member"} · Joined {new Date(member?.created_at).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Member card */}
        <div style={{ background: "linear-gradient(135deg, #1a0600, #0D1117)", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ fontSize: "3.5rem", flexShrink: 0 }}>{member?.avatar || "🏀"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.2rem" }}>{member?.name}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>{member?.email}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {member?.play_days?.map((d: string) => (
                <span key={d} style={{ fontSize: "0.55rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(232,87,12,0.15)", border: "1px solid rgba(232,87,12,0.3)", color: "#E8570C", textTransform: "capitalize" }}>{d}</span>
              ))}
              {member?.play_time && (
                <span style={{ fontSize: "0.55rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>🕐 {member.play_time}</span>
              )}
            </div>
          </div>
        </div>

        {/* Weather strip */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Court Weather Now</div>
          <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
            {COURT_DISTRICTS.map(d => {
              const w = weather[d.name];
              const main = w?.weather?.[0]?.main || "—";
              const icon = WEATHER_ICONS[main] || "🌡️";
              const temp = w?.main?.temp ? Math.round(w.main.temp) : "—";
              const rating = PLAY_RATING[main];
              return (
                <div key={d.name} style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "0.75rem 1rem", minWidth: "130px", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.3rem" }}>{d.name}</div>
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.2rem" }}>{icon}</div>
                  <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#F5F2EE", lineHeight: 1 }}>{temp}°C</div>
                  {rating && <div style={{ fontSize: "0.5rem", color: rating.color, marginTop: "0.25rem" }}>{rating.label}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Upcoming Sessions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {sessions.map((s, i) => {
              const key = `${s.day}-${i}`;
              const isJoined = joined.includes(key);
              const w = weather[s.district];
              const main = w?.weather?.[0]?.main || "";
              const icon = WEATHER_ICONS[main] || "🌡️";
              const temp = w?.main?.temp ? Math.round(w.main.temp) : "—";
              const rating = PLAY_RATING[main];
              return (
                <div key={key} style={{ background: "#0D1117", border: `1px solid ${isJoined ? "rgba(232,87,12,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "1.25rem", transition: "all 0.3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.2rem" }}>{s.day} · {formatDate(s.date)}</div>
                      <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "0.2rem" }}>{s.court}</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>📍 {s.district} · 🕐 {s.time}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "1.4rem" }}>{icon}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>{temp}°C</div>
                    </div>
                  </div>
                  {rating && (
                    <div style={{ fontSize: "0.62rem", color: rating.color, marginBottom: "0.75rem" }}>
                      {icon} {rating.label} — {s.district}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                      {isJoined ? "✅ You are in" : `${s.max} spots available`}
                    </div>
                    <button onClick={() => toggleJoin(key)}
                      style={{ background: isJoined ? "rgba(232,87,12,0.15)" : "#E8570C", color: isJoined ? "#E8570C" : "#111", border: isJoined ? "1px solid rgba(232,87,12,0.4)" : "none", padding: "0.45rem 1.1rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                      {isJoined ? "Leave session" : "Join session"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Find courts CTA */}
        <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "linear-gradient(135deg, #0a1a00, #0D1117)", border: "1px solid rgba(76,175,80,0.15)", borderRadius: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Explore</div>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", marginBottom: "1rem" }}>FIND YOUR NEXT COURT</div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/courts" style={{ background: "#E8570C", color: "#111", padding: "0.6rem 1.5rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "700" }}>🏀 Basketball Courts</Link>
            <Link href="/padel" style={{ background: "rgba(76,175,80,0.15)", color: "#4CAF50", padding: "0.6rem 1.5rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", border: "1px solid rgba(76,175,80,0.3)" }}>🎾 Padel Courts</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
