"use client";

export default function About() {
  return (
    <section id="about" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>

      {/* Parallax background — continuation from Experiences orange */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg-experiences.jpg')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15) saturate(1.5)" }} />

      {/* Gradient overlay — dark orange fading to deep dark */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(232,87,12,0.3) 0%, rgba(45,14,0,0.95) 30%, rgba(10,10,10,0.98) 70%, #0A0A0A 100%)" }} />

      {/* RODMAN centered large behind everything */}
      <div style={{
        position: "absolute", zIndex: 2,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontWeight: "bold",
        fontSize: "clamp(8rem,22vw,18rem)",
        color: "rgba(232,87,12,0.06)",
        letterSpacing: "20px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        textAlign: "center",
      }}>RODMAN</div>

      {/* Top section — RODMAN title + image */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", paddingTop: "5rem" }}>

        {/* Section eyebrow */}
        <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>About Splinters</div>

        {/* RODMAN in giant type split by image */}
        <div style={{ position: "relative", display: "inline-block", maxWidth: "900px", width: "100%", padding: "0 1.5rem" }}>

          {/* ROD — left of image */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div style={{ fontWeight: "bold", fontSize: "clamp(4rem,12vw,10rem)", color: "#F5F2EE", letterSpacing: "8px", lineHeight: 1, flex: 1, textAlign: "right" }}>ROD</div>

            {/* Rodman portrait — center breaking out */}
            <div style={{ position: "relative", flexShrink: 0, zIndex: 4 }}>
              <div style={{ width: "clamp(160px,22vw,280px)", height: "clamp(200px,28vw,360px)", borderRadius: "140px 140px 100px 100px", overflow: "hidden", border: "2px solid rgba(232,87,12,0.4)", boxShadow: "0 0 60px rgba(232,87,12,0.25), 0 0 120px rgba(232,87,12,0.1)" }}>
                <img src="/rodman.webp" alt="Rodman" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "saturate(1.2) contrast(1.1)" }} />
              </div>
              {/* Glow under image */}
              <div style={{ position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", width: "80%", height: "40px", background: "radial-gradient(ellipse, rgba(232,87,12,0.4) 0%, transparent 70%)", filter: "blur(10px)", pointerEvents: "none" }} />
            </div>

            <div style={{ fontWeight: "bold", fontSize: "clamp(4rem,12vw,10rem)", color: "#F5F2EE", letterSpacing: "8px", lineHeight: 1, flex: 1, textAlign: "left" }}>MAN</div>
          </div>
        </div>

        {/* Tagline below */}
        <div style={{ fontWeight: "bold", fontSize: "clamp(1rem,3vw,1.8rem)", color: "#E8570C", letterSpacing: "6px", textTransform: "uppercase", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          EVERY CITY NEEDS ITS RODMAN
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "4rem" }}>
          Nairobi Basketball · Est. 2025
        </div>
      </div>

      {/* Bottom content grid */}
      <div style={{ position: "relative", zIndex: 3, maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "4rem" }}>

          {/* LEFT — story */}
          <div>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: "1.25rem", fontWeight: 300 }}>
              Dennis Rodman was the most unpredictable player on the most dominant team in NBA history. He didn't follow the rules. He didn't fit the mould. He just won.
            </p>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: "1.25rem", fontWeight: 300 }}>
              Splinters is built the same way. We didn't build another generic sports directory. We mapped the soul of Nairobi basketball — the hidden courts, the midnight runs, the players nobody knows about yet.
            </p>
            <div style={{ borderLeft: "3px solid #E8570C", paddingLeft: "1.25rem", marginTop: "2rem" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#E8570C", lineHeight: 1.3, fontStyle: "italic" }}>
                "The Worm always<br />finds the ball."
              </div>
            </div>
          </div>

          {/* RIGHT — stats + CTA */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
              {[["63+", "Courts Mapped"], ["8", "Districts"], ["3", "Experiences"], ["2025", "Est."]].map(([num, label]) => (
                <div key={label} style={{ background: "rgba(232,87,12,0.08)", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontWeight: "bold", fontSize: "2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#courts"
                style={{ background: "#E8570C", color: "#111", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Find a Court
              </a>
              <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
                style={{ background: "transparent", color: "#25D366", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500", border: "1px solid rgba(37,211,102,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(37,211,102,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                💬 Join Community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom values strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "3rem" }}>
          {[
            { icon: "🗺️", title: "Court Discovery", desc: "Every court in Nairobi mapped and verified. From hidden neighbourhood gems to professional arenas." },
            { icon: "🏆", title: "Competitive League", desc: "Weekly pick-up games tracked by referees and scouts. Real stats. Real rankings. Real MVP." },
            { icon: "✈️", title: "Basketball Tourism", desc: "Curated experiences for visitors. Street runs, court tours, and the Narok Weekend." },
          ].map(item => (
            <div key={item.title}
              style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,87,12,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(232,87,12,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{item.icon}</div>
              <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#F5F2EE", marginBottom: "0.5rem", letterSpacing: "1px" }}>{item.title}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}