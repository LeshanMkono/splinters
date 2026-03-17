"use client";

export default function Navbar() {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", background: "rgba(10,10,10,0.95)" }}>
      <span style={{ color: "#E8570C", fontSize: "2rem", fontWeight: "bold", letterSpacing: "4px" }}>
        SPLINTERS
      </span>
      <div style={{ display: "flex", gap: "2rem" }}>
        <a href="#courts" style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Courts</a>
        <a href="#experiences" style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Experiences</a>
        <a href="#league" style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>League</a>
        <a href="#about" style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>About</a>
      </div>
      <a href="#courts" style={{ background: "#E8570C", color: "#0A0A0A", padding: "0.5rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
        Find a Court
      </a>
    </nav>
  );
}