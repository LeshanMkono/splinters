"use client";
import { useState } from "react";

const NAV_LINKS: [string, string][] = [
  ["Courts", "/courts"],
  ["Padel", "/padel"],
  ["Experiences", "#experiences"],
  ["League", "#league"],
  ["About", "#about"],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.5rem", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
        <a href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <img src="/splinters-logo.jpg" alt="Splinters" style={{ height: "40px", width: "40px", objectFit: "contain", borderRadius: "50%" }} />
          <span style={{ color: "#E8570C", fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "3px" }}>SPLINTERS</span>
        </a>
        <div className="nav-links" style={{ display: "flex", gap: "2rem", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {NAV_LINKS.map(([item, href]) => (
            <a key={item} href={href} style={{ color: "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,242,238,0.6)")}>{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/login" style={{ background: "transparent", color: "rgba(255,255,255,0.6)", padding: "0.5rem 1.1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500", border: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>Sign In</a>
          <a href="/register" style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1.1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500", whiteSpace: "nowrap" }}>Join Splinters</a>
          <a href="/courts" style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1.1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500", whiteSpace: "nowrap" }}>Find a Court</a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ background: "none", border: "none", color: "#F5F2EE", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.98)", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(232,87,12,0.2)", backdropFilter: "blur(10px)" }}>
          {NAV_LINKS.map(([item, href]) => (
            <a key={item} href={href} onClick={() => setMenuOpen(false)} style={{ display: "block", color: item === "Padel" ? "#E8570C" : "rgba(245,242,238,0.7)", textDecoration: "none", fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase", padding: "0.85rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: item === "Padel" ? "600" : "400" }}>{item}</a>
          ))}
        </div>
      )}
      <style>{`
        .nav-links { display: flex !important; }
        .hamburger { display: none !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
