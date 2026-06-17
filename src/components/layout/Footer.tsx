"use client";

export default function Footer() {
  return (
    <footer style={{ background: "#FFFFFF", color: "#111111", position: "relative", overflow: "hidden" }}>
      <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #E8570C, transparent)" }} />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 2rem" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <img src="/splinters-logo.jpg" alt="Splinters" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "contain" }} />
              <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#E8570C", letterSpacing: "3px" }}>SPLINTERS</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#555555", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "280px" }}>
              Every basketball court in Nairobi, mapped. Discover, book, and connect with the city basketball community.
            </p>
            <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366", padding: "0.6rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "600", marginBottom: "1rem" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(37,211,102,0.22)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(37,211,102,0.12)")}>
              Join WhatsApp Community
            </a>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              {[{ href: "https://www.instagram.com/splinters_basketball_", label: "Instagram" }, { href: "https://www.tiktok.com/@splintersbasketball_ke", label: "TikTok" }].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#F5F5F5", border: "1px solid #E0E0E0", color: "#555555", padding: "0.45rem 0.9rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8570C"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>Courts</div>
            {["Westlands", "Kasarani", "Karen", "Kibera", "Eastleigh", "CBD"].map(area => (
              <a key={area} href={"/courts/district/" + area.toLowerCase()}
                style={{ display: "block", fontSize: "0.82rem", color: "#666666", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {area}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>Experiences</div>
            {["The Street Run", "The Street Ball", "The Narok Weekend", "Book a Court", "Partner With Us"].map(item => (
              <a key={item} href="#experiences"
                style={{ display: "block", fontSize: "0.82rem", color: "#666666", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {item}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.25rem" }}>Company</div>
            {[["Blog", "/blog"], ["Play", "/play"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "mailto:basketballsplinter@gmail.com"]].map(([label, href]) => (
              <a key={label} href={href}
                style={{ display: "block", fontSize: "0.82rem", color: "#666666", textDecoration: "none", marginBottom: "0.6rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ margin: "0 auto 3rem", maxWidth: "400px", height: "80px", opacity: 0.12 }}>
          <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <rect x="1" y="1" width="398" height="78" stroke="#E8570C" strokeWidth="1.5"/>
            <line x1="200" y1="1" x2="200" y2="79" stroke="#E8570C" strokeWidth="1"/>
            <circle cx="200" cy="40" r="20" stroke="#E8570C" strokeWidth="1"/>
            <path d="M 120 1 Q 120 35 200 35 Q 280 35 280 1" stroke="#E8570C" strokeWidth="1" fill="none"/>
            <path d="M 120 79 Q 120 45 200 45 Q 280 45 280 79" stroke="#E8570C" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <div className="footer-stats" style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          {[["31", "Courts Mapped"], ["13", "Districts"], ["3", "Experiences"], ["\u221e", "Community"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: "0.62rem", color: "#888888", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="footer-bottom" style={{ borderTop: "1px solid #E8E8E8", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#999999" }}>© 2026 Splinters Sports Network. Nairobi, Kenya.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "mailto:basketballsplinter@gmail.com"]].map(([label, href]) => (
              <a key={label} href={href}
                style={{ fontSize: "0.72rem", color: "#888888", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                {label}
              </a>
            ))}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#AAAAAA", letterSpacing: "1px" }}>01°17 S / 36°49 E</div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-stats { gap: 2rem !important; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
