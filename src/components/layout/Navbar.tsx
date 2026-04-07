"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAV_LINKS: [string, string][] = [
  ["Courts", "/courts"],
  ["Padel", "/padel"],
  ["Experiences", "#experiences"],
  ["League", "#league"],
  ["About", "#about"],
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from("members").select("avatar, name, tier").eq("email", user.email).single();
        setMember(data);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from("members").select("avatar, name, tier").eq("email", session.user.email).single();
        setMember(data);
      } else {
        setMember(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMember(null);
    router.push("/");
  };

  const isElite = member?.tier === "elite" || member?.tier === "pro";

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
          <img src="/splinters-logo.jpg" alt="Splinters" style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.3rem", color: "#E8570C", letterSpacing: "3px" }}>SPLINTERS</span>
        </a>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          {NAV_LINKS.map(([item, href]) => (
            <a key={item} href={href} style={{ color: item === "Padel" ? "#4CAF50" : "rgba(245,242,238,0.6)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: item === "Padel" ? "600" : "400" }}>{item}</a>
          ))}
        </div>

        {/* Desktop right — auth aware */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {user ? (
            <>
              <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none", background: "rgba(232,87,12,0.1)", border: "1px solid rgba(232,87,12,0.25)", padding: "0.35rem 0.75rem", borderRadius: "100px" }}>
                <span style={{ fontSize: "0.9rem" }}>{member?.avatar || "🏀"}</span>
                {isElite && <span style={{ fontSize: "0.6rem", color: "#CA8A04" }}>★</span>}
                <span style={{ fontSize: "0.72rem", color: "#E8570C", fontWeight: "600" }}>{member?.name?.split(" ")[0] || "Dashboard"}</span>
              </a>
              <button onClick={signOut} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "0.35rem 0.875rem", borderRadius: "100px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Sign Out</button>
            </>
          ) : (
            <>
              <a href="/login" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.78rem", padding: "0.35rem 0.875rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.12)" }}>Sign In</a>
              <a href="/register" style={{ background: "#E8570C", color: "#111", padding: "0.35rem 0.875rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.78rem", fontWeight: "700" }}>Join</a>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ background: "none", border: "none", color: "#F5F2EE", fontSize: "1.4rem", cursor: "pointer", padding: "0.25rem", flexShrink: 0 }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.98)", padding: "0.75rem 1.5rem 1.25rem", borderBottom: "1px solid rgba(232,87,12,0.15)", backdropFilter: "blur(10px)" }}>
          {NAV_LINKS.map(([item, href]) => (
            <a key={item} href={href} onClick={() => setMenuOpen(false)} style={{ display: "block", color: item === "Padel" ? "#4CAF50" : "rgba(245,242,238,0.7)", textDecoration: "none", fontSize: "0.95rem", letterSpacing: "1px", textTransform: "uppercase", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: item === "Padel" ? "600" : "400" }}>{item}</a>
          ))}
          <div style={{ paddingTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {user ? (
              <>
                <a href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", padding: "0.6rem 0.875rem", background: "rgba(232,87,12,0.08)", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "10px" }}>
                  <span style={{ fontSize: "1.5rem" }}>{member?.avatar || "🏀"}</span>
                  <div>
                    <div style={{ color: "#E8570C", fontWeight: "600", fontSize: "0.88rem" }}>{member?.name || "My Dashboard"}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem" }}>View dashboard →</div>
                  </div>
                </a>
                <button onClick={() => { setMenuOpen(false); signOut(); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.7rem", borderRadius: "10px", fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans, sans-serif", width: "100%" }}>Sign Out</button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setMenuOpen(false)} style={{ display: "block", textAlign: "center", color: "rgba(245,242,238,0.7)", textDecoration: "none", fontSize: "0.88rem", padding: "0.7rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}>Sign In</a>
                <a href="/register" onClick={() => setMenuOpen(false)} style={{ display: "block", textAlign: "center", background: "#E8570C", color: "#111", textDecoration: "none", fontSize: "0.88rem", fontWeight: "700", padding: "0.7rem 1rem", borderRadius: "10px" }}>Join Splinters 🏀</a>
              </>
            )}
          </div>
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
