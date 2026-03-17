"use client";

export default function Navbar() {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.5rem", background: "linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)" }}>

      <a href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
        <img src="/splinters-logo.jpg" alt="Splinters" style={{ height: "44px", width: "44px", objectFit: "contain", borderRadius: "50%" }} />
        <span style={{ color: "#E8570C", fontWeight: "bold", fontSize: "1.3rem", letterSpacing: "3px" }}>SPLINTERS</span>
      </a>

      <div style={{ display: "flex", gap: "2rem", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        {["Courts", "Experiences", "League", "About"].map(item => (
          <a key={item} href={"#" + item.toLowerCase()} style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,242,238,0.6)")}>{item}</a>
        ))}
      </div>

      <a href="#courts" style={{ background: "#E8570C", color: "#111", padding: "0.55rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.82rem", fontWeight: "500", flexShrink: 0, whiteSpace: "nowrap", marginLeft: "auto" }}>
        Find a Court
      </a>

    </nav>
  );
}