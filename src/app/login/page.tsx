"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", color: "#F5F2EE" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "2rem 1.5rem" }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#E8570C", textDecoration: "none", letterSpacing: "4px" }}>SPLINTERS</Link>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#F5F2EE", marginTop: "0.25rem" }}>WELCOME BACK</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>Sign in to your member dashboard</div>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Email</label>
          <input type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.8rem 1rem", color: "#F5F2EE", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Password</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.8rem 1rem", color: "#F5F2EE", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
        </div>

        <button onClick={login} disabled={loading}
          style={{ width: "100%", background: "#E8570C", color: "#111", padding: "0.9rem", borderRadius: "100px", border: "none", fontSize: "0.95rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "1.25rem" }}>
          {loading ? "Signing in..." : "Sign In 🏀"}
        </button>

        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
          New to Splinters?{" "}
          <Link href="/register" style={{ color: "#E8570C", textDecoration: "none", fontWeight: "600" }}>Create account</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", letterSpacing: "2px" }}>
          splinters.co.ke · Nairobi Basketball
        </div>
      </div>
    </main>
  );
}
