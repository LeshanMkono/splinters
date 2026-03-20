"use client";

export default function Footer() {
  return (
    <footer style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.12) saturate(1.2)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(15,6,0,0.9) 50%, rgba(10,10,10,0.98) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #E8570C, transparent)", zIndex: 2 }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 2rem" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <img src="/splinters-logo.jpg" alt="Splinters" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "contain" }} />
              <span style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#E8570C", letterSpacing: "3px" }}>SPLINTERS</span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "280px" }}>
              Every basketball court in Nairobi, mapped. Discover, book, and connect with the city basketball community.
            </p>
            <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366", padding: "0.6rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(37,211,102,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(37,211,102,0.15)")}>
              💬 Join WhatsApp Community
            </a>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <a href="https://www.instagram.com/splinters_basketball_?igsh=MWx1NGJhcWV5OGQ0Yg==" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.45rem 0.9rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,87,12,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}>
                📸 Instagram
              </a>
              <a href="https://www.tiktok.com/@splintersbasketball_ke?_r=1&_t=ZS-94qXL8SUvdg" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.45rem 0.9rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,87,12,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}>
                🎵 TikTok
              </a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>Courts</div>
            {["Westlands", "Kasarani", "Karen", "Kibera", "Eastleigh", "CBD"].map(area => (
              <a key={area} href="/courts" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {area}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>Experiences</div>
            {["The Street Run", "The Street Ball", "The Narok Weekend", "Book a Court", "Partner With Us"].map(item => (
              <a key={item} href="#experiences" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {item}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>League</div>
            {["Weekly Scorers", "Annual MVP", "Register Team", "Referee Portal", "Scout Dashboard"].map(item => (
              <a key={item} href="#league" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {item}
              </a>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", margin: "0 auto 3rem", maxWidth: "400px", height: "80px", opacity: 0.15 }}>
          <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <rect x="1" y="1" width="398" height="78" stroke="#E8570C" strokeWidth="1.5"/>
            <line x1="200" y1="1" x2="200" y2="79" stroke="#E8570C" strokeWidth="1"/>
            <circle cx="200" cy="40" r="20" stroke="#E8570C" strokeWidth="1"/>
            <path d="M 120 1 Q 120 35 200 35 Q 280 35 280 1" stroke="#E8570C" strokeWidth="1" fill="none"/>
            <path d="M 120 79 Q 120 45 200 45 Q 280 45 280 79" stroke="#E8570C" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <div className="footer-stats" style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          {[["63+", "Courts Mapped"], ["8", "Districts"], ["3", "Experiences"], ["∞", "Community"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", fontSize: "2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>© 2025 Splinters Basketball. Nairobi, Kenya.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map(item => (
              <a key={item} href="#" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", letterSpacing: "1px" }}>01°17 S / 36°49 E</div>
        </div>
      </div>
    </footer>
  );
}