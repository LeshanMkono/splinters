"use client";

const PLAYERS = [
  { rank: 1, name: "James Omondi",  court: "Parklands SC",    position: "PG", pts: 34.5, reb: 5,  ast: 3, games: 6, mvp: true  },
  { rank: 2, name: "Brian Kamau",   court: "Kasarani Arena",   position: "SG", pts: 28.0, reb: 2,  ast: 6, games: 5, mvp: false },
  { rank: 3, name: "Alex Mwangi",   court: "Strathmore Univ",  position: "SF", pts: 24.3, reb: 8,  ast: 1, games: 7, mvp: false },
  { rank: 4, name: "David Njoroge", court: "Karen Gated",      position: "PF", pts: 21.8, reb: 6,  ast: 2, games: 5, mvp: false },
  { rank: 5, name: "Samuel Weru",   court: "USIU Africa",      position: "C",  pts: 18.5, reb: 9,  ast: 1, games: 4, mvp: false },
];

const RANK_COLORS: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
const RANK_ICONS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Leaderboard() {
  return (
    <section id="league" style={{ padding: "4rem 0", background: "transparent" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Community</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F5F2EE", lineHeight: 1, margin: 0 }}>
              WEEKLY SCORERS
            </h2>
            <div style={{ background: "rgba(232,87,12,0.1)", border: "1px solid rgba(232,87,12,0.3)", color: "#E8570C", fontSize: "0.7rem", padding: "0.3rem 0.8rem", borderRadius: "100px", fontWeight: "500" }}>
              WEEK 11 · 2025
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" }}>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 64px 64px 64px 52px", padding: "0.65rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            {["#", "Player", "PTS", "REB", "AST", "GP"].map(col => (
              <div key={col} style={{ fontSize: "0.52rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textAlign: col === "#" || col === "Player" ? "left" : "center" }}>
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {PLAYERS.map((p, i) => (
            <div
              key={p.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 64px 64px 64px 52px",
                padding: "1rem 1.25rem",
                borderBottom: i < PLAYERS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                alignItems: "center",
                transition: "background 0.15s",
                animation: `revealUp 0.45s ease ${i * 0.07}s both`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(232,87,12,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Rank */}
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.15rem", color: RANK_COLORS[p.rank] ?? "rgba(255,255,255,0.2)", lineHeight: 1 }}>
                {p.rank <= 3 ? RANK_ICONS[p.rank] : p.rank}
              </div>

              {/* Player info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#F5F2EE" }}>{p.name}</span>
                  {p.mvp && (
                    <span style={{ background: "#E8570C", color: "#111", fontSize: "0.5rem", padding: "1px 6px", borderRadius: "100px", fontWeight: "700", letterSpacing: "0.5px" }}>MVP</span>
                  )}
                </div>
                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{p.court} · {p.position}</div>
              </div>

              {/* Stat cells */}
              {([p.pts, p.reb, p.ast, p.games] as number[]).map((val, j) => (
                <div key={j} style={{ textAlign: "center" }}>
                  <span style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: j === 0 ? "1.3rem" : "1.1rem",
                    color: j === 0 ? "#E8570C" : "rgba(255,255,255,0.65)",
                    lineHeight: 1,
                  }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* MVP Banner */}
        <div className="btn-glass" style={{
          borderRadius: "16px",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#FFD700", lineHeight: 1 }}>MVP</div>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>2025 Annual MVP — Current Leader</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", color: "#F5F2EE", lineHeight: 1, marginBottom: "0.5rem" }}>JAMES OMONDI</div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[["312", "Total PTS"], ["47", "Games"], ["8", "Weeks #1"], ["6.6", "Avg PPG"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textTransform: "uppercase" }}>Resets In</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.6rem", color: "#E8570C" }}>41 WEEKS</div>
            <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>Dec 31, 2025</div>
          </div>
        </div>

      </div>
    </section>
  );
}
