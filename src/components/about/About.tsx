"use client";

export default function About() {
  return (
    <section id="about" style={{ position: "relative", overflow: "hidden", background: "#FAFAFA", borderTop: "1px solid #E8E8E8" }}>

      {/* Ghost watermark */}
      <div aria-hidden="true" style={{ position: "absolute", zIndex: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(5rem, 22vw, 20rem)", color: "rgba(232,87,12,0.04)", letterSpacing: "12px", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
        RODMAN
      </div>

      {/* Editorial split */}
      <div className="about-editorial" style={{ display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100dvh", position: "relative", zIndex: 2 }}>

        {/* LEFT — Rodman image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img src="/rodman.webp" alt="Rodman — the spirit of Splinters" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "saturate(1.1) contrast(1.05)" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "35%", background: "linear-gradient(to right, transparent, #FAFAFA)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, #FAFAFA, transparent)", pointerEvents: "none" }} />
        </div>

        {/* RIGHT — text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 2.5rem 5rem 2rem" }}>
          <p style={{ fontSize: "0.62rem", letterSpacing: "4px", textTransform: "uppercase", color: "#999", marginBottom: "1.5rem" }}>
            About Splinters · Est. 2025
          </p>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "#111", lineHeight: 0.9, letterSpacing: "2px", margin: "0" }}>
            EVERY CITY
          </h2>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "#E8570C", lineHeight: 0.9, letterSpacing: "2px", marginBottom: "2rem" }}>
            NEEDS ITS RODMAN
          </h2>

          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.9, marginBottom: "1rem", maxWidth: "420px" }}>
            Dennis Rodman was the most unpredictable player on the most dominant team in NBA history. He did not follow the rules. He did not fit the mould. He just won.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.9, marginBottom: "2rem", maxWidth: "420px" }}>
            Splinters is built the same way. We mapped the soul of Nairobi basketball — the hidden courts, the midnight runs, the players nobody knows about yet.
          </p>

          <blockquote style={{ borderLeft: "3px solid #E8570C", paddingLeft: "1.25rem", marginBottom: "2.5rem", margin: "0 0 2.5rem" }}>
            <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#E8570C", lineHeight: 1.3, fontStyle: "italic", letterSpacing: "1px", margin: 0 }}>
              &ldquo;The Worm always finds the ball.&rdquo;
            </p>
          </blockquote>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {[["31", "Courts"], ["13", "Districts"], ["3", "Experiences"], ["2025", "Est."]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.4rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.58rem", color: "#999", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#courts" style={{ background: "#E8570C", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Find a Court
            </a>
            <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer"
              style={{ padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", border: "1px solid #E8E8E8", color: "#333", background: "#fff", transition: "border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8570C"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8E8E8"; (e.currentTarget as HTMLAnchorElement).style.color = "#333"; }}>
              Join Community
            </a>
          </div>
        </div>
      </div>

      {/* Values strip */}
      <div className="about-values" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 5rem", position: "relative", zIndex: 2, borderTop: "1px solid #E8E8E8" }}>
        {[
          { title: "Court Discovery", desc: "Every court in Nairobi mapped and verified. From hidden neighbourhood gems to professional arenas." },
          { title: "Competitive League", desc: "Weekly pick-up games tracked by referees and scouts. Real stats. Real rankings. Real MVP." },
          { title: "Basketball Tourism", desc: "Curated experiences for visitors. Street runs, court tours, and the Narok Weekend." },
        ].map(item => (
          <div key={item.title}
            style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid #E8E8E8", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8570C"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(232,87,12,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E8E8"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#111", marginBottom: "0.5rem", letterSpacing: "1px" }}>{item.title}</div>
            <div style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.7 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-editorial { grid-template-columns: 1fr !important; }
          .about-editorial > div:first-child { height: 60vw; min-height: 240px; }
          .about-values { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
