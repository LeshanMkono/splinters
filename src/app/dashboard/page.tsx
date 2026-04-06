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
const WA_LINK = "https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS";

const DISTRICTS = [
  { name: "Parklands", lat: -1.26737, lng: 36.81337 },
  { name: "Lavington", lat: -1.28333, lng: 36.76667 },
  { name: "Kasarani", lat: -1.2197, lng: 36.8963 },
  { name: "Karen", lat: -1.33, lng: 36.71 },
  { name: "Kibera", lat: -1.313, lng: 36.786 },
  { name: "Kileleshwa", lat: -1.279, lng: 36.785 },
];

const WEATHER_ICONS: Record<string, string> = {
  Clear:"☀️", Clouds:"⛅", Rain:"🌧️", Drizzle:"🌦️",
  Thunderstorm:"⛈️", Mist:"🌫️", Haze:"🌫️", Fog:"🌫️",
};

const PLAY_RATING: Record<string, { label: string; color: string }> = {
  Clear:{ label:"Perfect conditions", color:"#3B6D11" },
  Clouds:{ label:"Good to play", color:"#3B6D11" },
  Drizzle:{ label:"Light rain — playable", color:"#854F0B" },
  Rain:{ label:"Rain likely — check before going", color:"#A32D2D" },
  Thunderstorm:{ label:"Stay indoors", color:"#A32D2D" },
  Mist:{ label:"Cool conditions", color:"#3B6D11" },
  Haze:{ label:"Cool conditions", color:"#3B6D11" },
  Fog:{ label:"Cool conditions", color:"#3B6D11" },
};

const EXCLUSIVE_COURTS = [
  { name:"Parklands Sports Club", district:"Parklands", type:"Outdoor", time:"5:00 PM – 8:00 PM", day:"saturday", weatherTime:"4pm" },
  { name:"Olive Crescent International School", district:"Kileleshwa", type:"Outdoor", time:"5:00 PM – 8:00 PM", day:"saturday", weatherTime:"4pm" },
  { name:"Nairobi International School", district:"Lavington", type:"Indoor", time:"6:00 PM – 8:30 PM", day:"sunday", weatherTime:"5pm" },
];

const FREE_COURTS = [
  "Kasarani Indoor Basketball Arena","Karen Gated Basketball Court",
  "Kibera Community Basketball Court","Langata Down Basketball Court",
  "USIU Basketball Court","Camp Toyoyo Jericho","Ridgeways Basketball Court",
  "Umoja 2 Basketball Court","Diwopa Basketball Court","St Austins Academy",
];

function getNextSessions() {
  const sessions: any[] = [];
  const today = new Date();
  for (let i = 0; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 6) {
      sessions.push({ date: new Date(d), dayName:"SAT", court:"Parklands Sports Club", district:"Parklands", time:"5:00 PM – 8:00 PM", weatherTime:"4pm", type:"Outdoor", max:10, tier:"elite" });
      sessions.push({ date: new Date(d), dayName:"SAT", court:"Olive Crescent International School", district:"Kileleshwa", time:"5:00 PM – 8:00 PM", weatherTime:"4pm", type:"Outdoor", max:12, tier:"elite" });
    }
    if (dow === 0) {
      sessions.push({ date: new Date(d), dayName:"SUN", court:"Nairobi International School", district:"Lavington", time:"6:00 PM – 8:30 PM", weatherTime:"5pm", type:"Indoor", max:10, tier:"elite" });
    }
    if (sessions.length >= 6) break;
  }
  return sessions;
}

function CalendarView({ playDays }: { playDays: string[] }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const isCurrent = today.getMonth() === month && today.getFullYear() === year;
  const daysLeft = new Date(year, month + 1, 0).getDate() - today.getDate();

  return (
    <div style={{ background:"#0D1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"1.25rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <button onClick={() => { let m=month-1, y=year; if(m<0){m=11;y--;} setMonth(m); setYear(y); }}
          style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"0.9rem" }}>←</button>
        <div>
          <div style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"1.3rem", color:"#F5F2EE", textAlign:"center", letterSpacing:"1px" }}>{months[month]} {year}</div>
          {isCurrent && <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", textAlign:"center" }}>{daysLeft} days remaining</div>}
        </div>
        <button onClick={() => { let m=month+1, y=year; if(m>11){m=0;y++;} setMonth(m); setYear(y); }}
          style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"0.9rem" }}>→</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"2px", marginBottom:"4px" }}>
        {days.map(d => <div key={d} style={{ textAlign:"center", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", padding:"2px 0", fontWeight:"600", letterSpacing:"1px" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"2px" }}>
        {Array(firstDay).fill(null).map((_,i) => <div key={`e${i}`} />)}
        {Array(totalDays).fill(null).map((_,i) => {
          const day = i + 1;
          const dow = new Date(year, month, day).getDay();
          const isSes = dow === 0 || dow === 6;
          const isToday = isCurrent && day === today.getDate();
          return (
            <div key={day} style={{
              textAlign:"center", fontSize:"0.72rem", padding:"5px 1px", borderRadius:"6px",
              background: isToday ? "#E8570C" : isSes ? "rgba(232,87,12,0.12)" : "transparent",
              color: isToday ? "#111" : isSes ? "#E8570C" : "rgba(255,255,255,0.45)",
              fontWeight: isSes ? "600" : "400",
              border: isSes && !isToday ? "0.5px solid rgba(232,87,12,0.3)" : "none",
              position:"relative",
            }}>
              {day}
              {isSes && !isToday && <div style={{ position:"absolute", bottom:"1px", left:"50%", transform:"translateX(-50%)", width:"3px", height:"3px", borderRadius:"50%", background:"#E8570C" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:"0.75rem", display:"flex", gap:"1rem", justifyContent:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:"rgba(232,87,12,0.12)", border:"0.5px solid rgba(232,87,12,0.3)" }} /> Session day
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"0.6rem", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:"#E8570C" }} /> Today
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<Record<string, any>>({});
  const [joined, setJoined] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const sessions = getNextSessions();
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

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
    for (const d of DISTRICTS) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${d.lat}&lon=${d.lng}&appid=${OW_KEY}&units=metric&cnt=16`);
        const json = await res.json();
        results[d.name] = json;
      } catch {}
    }
    setWeather(results);
  };

  const getSessionWeather = (district: string, sessionTime: string) => {
    const forecast = weather[district];
    if (!forecast?.list) return null;
    const hour = sessionTime === "4pm" ? 16 : 17;
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, 0, 0, 0);
    const targetTs = Math.floor(target.getTime() / 1000);
    const closest = forecast.list.reduce((prev: any, curr: any) =>
      Math.abs(curr.dt - targetTs) < Math.abs(prev.dt - targetTs) ? curr : prev
    );
    return closest;
  };

  const toggleJoin = (key: string) => {
    setJoined(j => j.includes(key) ? j.filter(x => x !== key) : [...j, key]);
  };

  const tier = member?.tier || "free";
  const isElite = tier === "elite" || tier === "pro";
  const isBaller = tier === "community" || isElite;
  const sessionsUsed = joined.filter(j => j.includes("outdoor")).length;
  const indoorUsed = joined.filter(j => j.includes("indoor")).length;

  const filteredSessions = sessions.filter(s => {
    if (activeTab === "saturday") return s.dayName === "SAT";
    if (activeTab === "sunday") return s.dayName === "SUN";
    return true;
  });

  if (loading) return (
    <main style={{ background:"#0A0A0A", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans, sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🏀</div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem" }}>Loading your dashboard...</div>
      </div>
    </main>
  );

  return (
    <main style={{ background:"#0A0A0A", minHeight:"100vh", fontFamily:"DM Sans, sans-serif", color:"#F5F2EE", position:"relative" }}>

      {/* KD Background */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"url(/dashboard-bg.jpg)", backgroundSize:"cover", backgroundPosition:"center top", opacity:0.07, zIndex:0, pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>

        {/* Navbar */}
        <div style={{ padding:"1rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, background:"rgba(10,10,10,0.96)", backdropFilter:"blur(10px)", zIndex:100 }}>
          <Link href="/" style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"1.5rem", color:"#E8570C", textDecoration:"none", letterSpacing:"3px" }}>SPLINTERS</Link>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <div style={{ fontSize:"1.5rem" }}>{member?.avatar || "🏀"}</div>
            {isElite && <span style={{ fontSize:"0.7rem", color:"#CA8A04", fontWeight:"700" }}>★</span>}
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", padding:"0.4rem 0.9rem", borderRadius:"100px", fontSize:"0.72rem", cursor:"pointer" }}>
              Sign out
            </button>
          </div>
        </div>

        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"2rem 1.5rem 6rem" }}>

          {/* Welcome */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:"0.55rem", letterSpacing:"4px", textTransform:"uppercase", color:"#E8570C", marginBottom:"0.3rem" }}>Member Dashboard</div>
            <div style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"clamp(2rem, 6vw, 3.5rem)", lineHeight:0.88, marginBottom:"0.5rem" }}>
              WELCOME BACK<br /><span style={{ color:"#E8570C" }}>{member?.name?.toUpperCase() || "BALLER"}</span>
            </div>
            <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)" }}>
              {isElite ? "★ Elite Member" : isBaller ? "Community Member · Baller" : "Explorer · Free"} · Member since {new Date(member?.created_at).toLocaleDateString("en-KE", { month:"long", year:"numeric" })}
            </div>
          </div>

          {/* Member card */}
          <div style={{ background:"linear-gradient(135deg, #1a0600, #0D1117)", border:"1px solid rgba(232,87,12,0.2)", borderRadius:"16px", padding:"1.25rem 1.5rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ fontSize:"3rem", flexShrink:0 }}>{member?.avatar || "🏀"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"700", fontSize:"1.05rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                {member?.name}
                {isElite && <span style={{ fontSize:"0.75rem", color:"#CA8A04", background:"rgba(202,138,4,0.1)", padding:"1px 6px", borderRadius:"4px", border:"0.5px solid rgba(202,138,4,0.3)" }}>★ Elite</span>}
              </div>
              <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginBottom:"0.5rem" }}>{member?.email}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                {member?.play_days?.map((d: string) => (
                  <span key={d} style={{ fontSize:"0.55rem", padding:"2px 7px", borderRadius:"100px", background:"rgba(232,87,12,0.12)", border:"0.5px solid rgba(232,87,12,0.3)", color:"#E8570C", textTransform:"capitalize" }}>{d}</span>
                ))}
                {member?.play_time && <span style={{ fontSize:"0.55rem", padding:"2px 7px", borderRadius:"100px", background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", textTransform:"capitalize" }}>🕐 {member.play_time}</span>}
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"2rem", color:"#E8570C", lineHeight:1 }}>#{String(member?.id?.slice(-3) || "001").toUpperCase()}</div>
              <div style={{ fontSize:"0.5rem", color:"rgba(255,255,255,0.25)", letterSpacing:"1px" }}>MEMBER</div>
            </div>
          </div>

          {/* Session tracker — community and elite only */}
          {isBaller && (
            <div style={{ display:"grid", gridTemplateColumns:isElite ? "repeat(3,1fr)" : "repeat(2,1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
              {[
                { num:`${sessionsUsed}/4`, label:"Outdoor sessions used" },
                ...(isElite ? [{ num:`${indoorUsed}/2`, label:"Indoor sessions used" }] : []),
                { num:`${daysLeft}`, label:"Days left this month" },
              ].map((s, i) => (
                <div key={i} style={{ background:"#0D1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"0.875rem", textAlign:"center" }}>
                  <div style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"1.8rem", color:"#E8570C", lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", marginTop:"0.25rem", letterSpacing:"0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* WhatsApp CTA — all tiers */}
          <div style={{ background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:"14px", padding:"1rem 1.25rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"0.875rem" }}>
            <div style={{ fontSize:"1.5rem", flexShrink:0 }}>💬</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"600", fontSize:"0.88rem", color:"#25D366", marginBottom:"0.2rem" }}>Join the Splinters Community</div>
              <div style={{ fontSize:"0.72rem", color:"rgba(37,211,102,0.6)" }}>500+ players · Pickup alerts · Court updates · Match organising</div>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              style={{ background:"#25D366", color:"#111", padding:"0.5rem 1rem", borderRadius:"100px", textDecoration:"none", fontSize:"0.72rem", fontWeight:"700", flexShrink:0, whiteSpace:"nowrap" }}>
              Join Now →
            </a>
          </div>

          {/* Upgrade banner — non-elite */}
          {!isElite && (
            <div style={{ background:"rgba(202,138,4,0.08)", border:"1px solid rgba(202,138,4,0.2)", borderRadius:"14px", padding:"1rem 1.25rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"0.875rem" }}>
              <div style={{ fontSize:"1.5rem", flexShrink:0 }}>🏆</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:"600", fontSize:"0.85rem", color:"#CA8A04", marginBottom:"0.2rem" }}>Unlock exclusive courts + indoor sessions</div>
                <div style={{ fontSize:"0.7rem", color:"rgba(202,138,4,0.6)" }}>Parklands, Olive Crescent & Nairobi International School · KES {isBaller ? "3,000" : "2,000"}/mo</div>
              </div>
              <button style={{ background:"#CA8A04", color:"#111", padding:"0.5rem 1rem", borderRadius:"100px", border:"none", fontSize:"0.72rem", fontWeight:"700", cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
                Upgrade →
              </button>
            </div>
          )}

          {/* Courts */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" }}>Courts</div>
            <div style={{ background:"#0D1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", overflow:"hidden" }}>
              <div style={{ padding:"0.6rem 1rem", fontSize:"0.55rem", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>★ Exclusive Courts</div>
              {EXCLUSIVE_COURTS.map((c, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.875rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize:"0.55rem", padding:"2px 7px", borderRadius:"100px", background:"rgba(202,138,4,0.12)", border:"0.5px solid rgba(202,138,4,0.3)", color:"#CA8A04", whiteSpace:"nowrap" }}>★ Elite</span>
                  <span style={{ flex:1, fontSize:"0.85rem", fontWeight:"600" }}>{c.name}</span>
                  <span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.3)" }}>{c.type}</span>
                  <span style={{ fontSize:"1rem" }}>{isElite ? "✓" : "🔒"}</span>
                </div>
              ))}
              <div style={{ padding:"0.6rem 1rem", fontSize:"0.55rem", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", borderBottom:"1px solid rgba(255,255,255,0.05)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>Free Courts</div>
              {FREE_COURTS.map((c, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 1rem", borderBottom: i < FREE_COURTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ fontSize:"0.55rem", padding:"2px 7px", borderRadius:"100px", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.35)" }}>Free</span>
                  <span style={{ flex:1, fontSize:"0.82rem" }}>{c}</span>
                  <span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.25)" }}>Open</span>
                </div>
              ))}
              <div style={{ padding:"0.75rem 1rem", textAlign:"center", fontSize:"0.72rem", color:"rgba(255,255,255,0.2)" }}>+ 20 more free courts on the courts page</div>
            </div>
          </div>

          {/* Calendar */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" }}>Session Calendar</div>
            <CalendarView playDays={member?.play_days || ["saturday","sunday"]} />
          </div>

          {/* Weather */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" }}>Court Weather — 1hr Before Session</div>
            <div style={{ display:"flex", gap:"0.6rem", overflowX:"auto", paddingBottom:"0.5rem", scrollbarWidth:"none" }}>
              {DISTRICTS.map(d => {
                const forecast = weather[d.name];
                const sessionHour = d.name === "Lavington" ? 17 : 16;
                const now2 = new Date();
                const target = new Date(now2);
                target.setHours(sessionHour, 0, 0, 0);
                const targetTs = Math.floor(target.getTime() / 1000);
                const closest = forecast?.list?.reduce((prev: any, curr: any) =>
                  Math.abs(curr.dt - targetTs) < Math.abs(prev.dt - targetTs) ? curr : prev
                );
                const main = closest?.weather?.[0]?.main || "—";
                const icon = WEATHER_ICONS[main] || "🌡️";
                const temp = closest?.main?.temp ? Math.round(closest.main.temp) : "—";
                const rating = PLAY_RATING[main];
                return (
                  <div key={d.name} style={{ background:"#0D1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"0.875rem 1rem", minWidth:"120px", flexShrink:0 }}>
                    <div style={{ fontSize:"0.55rem", letterSpacing:"1px", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:"0.3rem" }}>{d.name}</div>
                    <div style={{ fontSize:"1.5rem", marginBottom:"0.2rem" }}>{icon}</div>
                    <div style={{ fontFamily:"Bebas Neue, sans-serif", fontSize:"1.5rem", color:"#F5F2EE", lineHeight:1 }}>{temp}°C</div>
                    <div style={{ fontSize:"0.5rem", color:"rgba(255,255,255,0.25)", margin:"0.2rem 0" }}>@ {d.name === "Lavington" ? "5pm" : "4pm"}</div>
                    {rating && <div style={{ fontSize:"0.55rem", color:rating.color }}>{rating.label}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sessions */}
          <div>
            <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" }}>Upcoming Sessions</div>
            <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1rem" }}>
              {[["all","All"],["saturday","Saturday"],["sunday","Sunday"]].map(([val, label]) => (
                <button key={val} onClick={() => setActiveTab(val)}
                  style={{ padding:"0.35rem 0.875rem", borderRadius:"100px", border:`1px solid ${activeTab===val ? "#E8570C" : "rgba(255,255,255,0.1)"}`, background:activeTab===val ? "rgba(232,87,12,0.15)" : "transparent", color:activeTab===val ? "#E8570C" : "rgba(255,255,255,0.4)", fontSize:"0.72rem", cursor:"pointer", fontFamily:"DM Sans, sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              {filteredSessions.slice(0,4).map((s, i) => {
                const key = `${s.dayName}-${s.court}-${i}`;
                const isJoined = joined.includes(key);
                const wData = getSessionWeather(s.district, s.weatherTime);
                const wMain = wData?.weather?.[0]?.main || "";
                const wIcon = WEATHER_ICONS[wMain] || "🌡️";
                const wTemp = wData?.main?.temp ? Math.round(wData.main.temp) : "—";
                const wRating = PLAY_RATING[wMain];
                const canJoin = isElite || (isBaller && s.type === "Outdoor");
                return (
                  <div key={key} style={{ background:"#0D1117", border:`1px solid ${isJoined ? "rgba(232,87,12,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius:"14px", padding:"1.25rem", transition:"all 0.3s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                      <div>
                        <div style={{ fontSize:"0.55rem", letterSpacing:"2px", textTransform:"uppercase", color:"#E8570C", marginBottom:"0.2rem" }}>{s.dayName} · {s.date.toLocaleDateString("en-KE",{month:"short",day:"numeric"})}</div>
                        <div style={{ fontWeight:"700", fontSize:"1rem", marginBottom:"0.25rem", display:"flex", alignItems:"center", flexWrap:"wrap", gap:"0.4rem" }}>
                          {s.court}
                          <span style={{ fontSize:"0.55rem", background:"rgba(202,138,4,0.12)", color:"#CA8A04", padding:"1px 6px", borderRadius:"3px", border:"0.5px solid rgba(202,138,4,0.3)" }}>★ Elite</span>
                          <span style={{ fontSize:"0.55rem", background:s.type==="Indoor" ? "rgba(24,95,165,0.12)" : "rgba(59,109,17,0.12)", color:s.type==="Indoor" ? "#185FA5" : "#3B6D11", padding:"1px 6px", borderRadius:"3px" }}>{s.type}</span>
                        </div>
                        <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.4)" }}>📍 {s.district} · 🕐 {s.time}</div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:"1.5rem" }}>{wIcon}</div>
                        <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)" }}>{wTemp}°C</div>
                        <div style={{ fontSize:"0.55rem", color:"rgba(255,255,255,0.25)" }}>@ {s.weatherTime}</div>
                      </div>
                    </div>
                    {wRating && <div style={{ fontSize:"0.65rem", color:wRating.color, marginBottom:"0.75rem" }}>{wIcon} {wRating.label} at {s.weatherTime} — {s.district}</div>}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.3)" }}>
                        {isJoined ? "✅ You are in" : `${s.max} spots · ${s.max - 3} remaining`}
                      </div>
                      {canJoin ? (
                        <button onClick={() => toggleJoin(key)}
                          style={{ background:isJoined ? "rgba(232,87,12,0.12)" : "#E8570C", color:isJoined ? "#E8570C" : "#111", border:isJoined ? "1px solid rgba(232,87,12,0.3)" : "none", padding:"0.45rem 1.1rem", borderRadius:"100px", fontSize:"0.72rem", fontWeight:"700", cursor:"pointer", transition:"all 0.2s" }}>
                          {isJoined ? "Leave session" : "Join session"}
                        </button>
                      ) : (
                        <button style={{ background:"rgba(202,138,4,0.1)", color:"#CA8A04", border:"1px solid rgba(202,138,4,0.2)", padding:"0.45rem 1.1rem", borderRadius:"100px", fontSize:"0.65rem", cursor:"pointer" }}>
                          ★ Upgrade to join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
