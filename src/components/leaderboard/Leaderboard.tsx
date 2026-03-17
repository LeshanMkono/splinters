"use client";
import { useState, useEffect } from "react";

const PLAYERS = [
  { id: 0, name: "James Omondi", court: "Parklands Sports Club", position: "PG", pts: 34.5, reb: 5, ast: 3, games: 6, rank: 1, mvp: true, bg: "linear-gradient(135deg,#1a0d05,#2d1506)" },
  { id: 1, name: "Brian Kamau", court: "Kasarani Arena", position: "SG", pts: 28.0, reb: 2, ast: 6, games: 5, rank: 2, mvp: false, bg: "linear-gradient(135deg,#0d1b2a,#1a3550)" },
  { id: 2, name: "Alex Mwangi", court: "Strathmore University", position: "SF", pts: 24.3, reb: 8, ast: 1, games: 7, rank: 3, mvp: false, bg: "linear-gradient(135deg,#0a2a0a,#1a4a1a)" },
  { id: 3, name: "David Njoroge", court: "Karen Gated Court", position: "PF", pts: 21.8, reb: 6, ast: 2, games: 5, rank: 4, mvp: false, bg: "linear-gradient(135deg,#1a1a0d,#2a2a1a)" },
  { id: 4, name: "Samuel Weru", court: "USIU Africa", position: "C", pts: 18.5, reb: 9, ast: 1, games: 4, rank: 5, mvp: false, bg: "linear-gradient(135deg,#1a0a1a,#2a1a2a)" },
];

const rankColors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
const rankIcons = { 1: "🥇", 2: "🥈", 3: "🥉" };

function getPosition(cardIndex, centerIndex, total) {
  const diff = (cardIndex - centerIndex + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === 2) return "far-right";
  if (diff === total - 1) return "left";
  return "far-left";
}

const positionStyles = {
  center: { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 10, filter: "none" },
  left: { transform: "translateX(-260px) scale(0.88)", opacity: 0.35, zIndex: 5, filter: "brightness(0.5)" },
  right: { transform: "translateX(260px) scale(0.88)", opacity: 0.35, zIndex: 5, filter: "brightness(0.5)" },
  "far-left": { transform: "translateX(-480px) scale(0.75)", opacity: 0, zIndex: 1 },
  "far-right": { transform: "translateX(480px) scale(0.75)", opacity: 0, zIndex: 1 },
};

export default function Leaderboard() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = PLAYERS.length;

  const move = (dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(prev => (prev + dir + total) % total);
    setTimeout(() => setIsAnimating(false), 650);
  };

  const goTo = (idx) => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 650);
  };

  useEffect(() => {
    const timer = setInterval(() => move(1), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="league" style={{ padding: "4rem 1.25rem", background: "#0A0A0A" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Community</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#F5F2EE", lineHeight: 1 }}>WEEKLY SCORERS</div>
          <div style={{ background: "rgba(232,87,12,0.1)", border: "1px solid rgba(232,87,12,0.3)", color: "#E8570C", fontSize: "0.7rem", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>WEEK 11 · 2025</div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", padding: "1rem 0 2rem" }}>
          <div style={{ position: "relative", height: "420px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {PLAYERS.map(player => {
              const pos = getPosition(player.id, current, total);
              const pStyle = positionStyles[pos];
              return (
                <div key={player.id}
                  style={{ position: "absolute", width: "280px", borderRadius: "16px", overflow: "hidden", transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)", cursor: pos === "left" || pos === "right" ? "pointer" : "default", ...pStyle }}
                  onClick={() => { if (pos === "right") move(1); if (pos === "left") move(-1); }}>
                  <div style={{ width: "100%", height: "240px", background: player.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", position: "relative" }}>
                    🏀
                    <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(10,10,10,0.8)", border: "1px solid rgba(232,87,12,0.3)", borderRadius: "6px", padding: "3px 8px", fontSize: "0.6rem", color: "rgba(232,87,12,0.7)" }}>+ Add photo</div>
                  </div>
                  <div style={{ background: "#111", border: "1px solid rgba(232,87,12,0.2)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "1rem 1.25rem" }}>
                    {player.mvp && <div style={{ display: "inline-block", background: "#E8570C", color: "#111", fontSize: "0.55rem", padding: "2px 8px", borderRadius: "100px", fontWeight: "500", marginBottom: "0.4rem" }}>MVP LEAD</div>}
                    <div style={{ fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "2px", color: rankColors[player.rank] || "rgba(255,255,255,0.3)", marginBottom: "0.2rem" }}>{rankIcons[player.rank] || player.rank} RANK {player.rank}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#F5F2EE", lineHeight: 1, marginBottom: "0.25rem" }}>{player.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>{player.court} · {player.position}</div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {[["pts","PTS"],["reb","REB"],["ast","AST"],["games","GP"]].map(([key, label]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#E8570C", lineHeight: 1 }}>{player[key]}</div>
                          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => move(-1)} style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(10,10,10,0.9)", border: "1px solid rgba(232,87,12,0.4)", color: "#E8570C", fontSize: "1.2rem", cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={() => move(1)} style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(10,10,10,0.9)", border: "1px solid rgba(232,87,12,0.4)", color: "#E8570C", fontSize: "1.2rem", cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          {PLAYERS.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? "20px" : "6px", height: "6px", borderRadius: "100px", background: i === current ? "#E8570C" : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#111 0%,#1a0d05 100%)", border: "1px solid rgba(232,87,12,0.4)", borderRadius: "16px", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ fontSize: "2.5rem" }}>👑</div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.25rem" }}>2025 Annual MVP — Current Leader</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#F5F2EE", lineHeight: 1, margin: "0.25rem 0" }}>JAMES OMONDI</div>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {[["312","Total PTS"],["47","Games"],["8","Weeks #1"],["6.6","Avg PPG"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#E8570C" }}>{num}</div>
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>RESETS IN</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#E8570C" }}>41 WEEKS</div>
            <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.2)" }}>Dec 31, 2025</div>
          </div>
        </div>
      </div>
    </section>
  );
}