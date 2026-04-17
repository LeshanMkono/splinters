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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join WhatsApp Community
            </a>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <a href="https://www.instagram.com/splinters_basketball_?igsh=MWx1NGJhcWV5OGQ0Yg==" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.45rem 0.9rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,87,12,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a href="https://www.tiktok.com/@splintersbasketball_ke?_r=1&_t=ZS-94qXL8SUvdg" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.45rem 0.9rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.72rem", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,87,12,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8570C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.18 8.18 0 004.78 1.54V6.58a4.85 4.85 0 01-1.01.11z"/></svg>
                TikTok
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