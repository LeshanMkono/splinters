"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AVATARS = ["🏀","🦁","⚡","🔥","👑","🎯","🐆","🏆"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES = ["Morning (6am–10am)","Afternoon (12pm–3pm)","Evening (4pm–8pm)","Night (8pm–11pm)"];
const COURTS = ["Parklands Sports Club","Nairobi International School","Kasarani Indoor Arena","Karen Gated Court","Kibera Community Court","USIU Basketball Court","Langata Down Court"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    avatar: "🏀", play_days: ["saturday","sunday"],
    play_time: "evening", preferred_courts: [] as string[], bio: "",
  });

  const toggle = (field: "play_days"|"preferred_courts", val: string) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? (f[field] as string[]).filter(x => x !== val)
        : [...(f[field] as string[]), val]
    }));
  };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const { error: authErr } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { name: form.name } }
      });
      if (authErr) throw authErr;
      const { error: dbErr } = await supabase.from("members").insert({
        name: form.name, email: form.email, phone: form.phone,
        avatar: form.avatar, play_days: form.play_days,
        play_time: form.play_time, preferred_courts: form.preferred_courts,
        bio: form.bio, tier: "free", status: "waitlist",
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (success) return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{form.avatar}</div>
        <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3rem", color: "#E8570C" }}>WELCOME {form.name.toUpperCase()}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontSize: "0.9rem" }}>You are on the Splinters waitlist. Check your email to verify your account.</div>
        <Link href="/dashboard" style={{ background: "#E8570C", color: "#111", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontWeight: "700" }}>Go to Dashboard →</Link>
      </div>
    </main>
  );

  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh", fontFamily: "DM Sans, sans-serif", color: "#F5F2EE" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "4rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#E8570C", textDecoration: "none", letterSpacing: "3px" }}>SPLINTERS</Link>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#F5F2EE", marginTop: "0.5rem" }}>JOIN THE COMMUNITY</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>Step {step} of 3</div>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem" }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: "3px", borderRadius: "2px", background: s <= step ? "#E8570C" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
          ))}
        </div>

        {error && <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</div>}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.5rem" }}>Your Details</div>
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "John Omondi" },
              { label: "Email", key: "email", type: "email", placeholder: "john@email.com" },
              { label: "Phone", key: "phone", type: "tel", placeholder: "+254 7XX XXX XXX" },
              { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>{label}</label>
                <input type={type} placeholder={placeholder} value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#F5F2EE", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <button onClick={() => { if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields"); return; } setError(""); setStep(2); }}
              style={{ width: "100%", background: "#E8570C", color: "#111", padding: "0.85rem", borderRadius: "100px", border: "none", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", marginTop: "0.5rem" }}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.5rem" }}>Pick Your Avatar</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setForm(f => ({ ...f, avatar: a }))}
                  style={{ fontSize: "2.5rem", padding: "0.75rem", borderRadius: "12px", border: `2px solid ${form.avatar === a ? "#E8570C" : "rgba(255,255,255,0.08)"}`, background: form.avatar === a ? "rgba(232,87,12,0.15)" : "#0D1117", cursor: "pointer", transition: "all 0.2s" }}>
                  {a}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1rem" }}>Play Days</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {DAYS.map(d => {
                const val = d.toLowerCase();
                const on = form.play_days.includes(val);
                return (
                  <button key={d} onClick={() => toggle("play_days", val)}
                    style={{ padding: "0.4rem 0.9rem", borderRadius: "100px", border: `1px solid ${on ? "#E8570C" : "rgba(255,255,255,0.1)"}`, background: on ? "rgba(232,87,12,0.15)" : "transparent", color: on ? "#E8570C" : "rgba(255,255,255,0.4)", fontSize: "0.75rem", cursor: "pointer" }}>
                    {d}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1rem" }}>Preferred Time</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {TIMES.map(t => {
                const val = t.split(" ")[0].toLowerCase();
                const on = form.play_time === val;
                return (
                  <button key={t} onClick={() => setForm(f => ({ ...f, play_time: val }))}
                    style={{ padding: "0.6rem 1rem", borderRadius: "10px", border: `1px solid ${on ? "#E8570C" : "rgba(255,255,255,0.1)"}`, background: on ? "rgba(232,87,12,0.15)" : "#0D1117", color: on ? "#E8570C" : "rgba(255,255,255,0.4)", fontSize: "0.8rem", cursor: "pointer", textAlign: "left" }}>
                    {t}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "0.85rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, background: "#E8570C", color: "#111", padding: "0.85rem", borderRadius: "100px", border: "none", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "1.5rem" }}>Favourite Courts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {COURTS.map(c => {
                const on = form.preferred_courts.includes(c);
                return (
                  <button key={c} onClick={() => toggle("preferred_courts", c)}
                    style={{ padding: "0.7rem 1rem", borderRadius: "10px", border: `1px solid ${on ? "#E8570C" : "rgba(255,255,255,0.1)"}`, background: on ? "rgba(232,87,12,0.15)" : "#0D1117", color: on ? "#E8570C" : "rgba(255,255,255,0.5)", fontSize: "0.8rem", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🏀 {c}</span>
                    {on && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Short Bio (optional)</label>
              <textarea placeholder="e.g. PG, been playing 5 years, looking for Sunday runs in Westlands"
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                style={{ width: "100%", background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#F5F2EE", fontSize: "0.85rem", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif" }} />
            </div>

            {/* Summary */}
            <div style={{ background: "#0D1117", border: "1px solid rgba(232,87,12,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "2.5rem" }}>{form.avatar}</div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "1rem" }}>{form.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{form.email}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                <div>📅 {form.play_days.join(", ")}</div>
                <div>🕐 {form.play_time}</div>
                {form.preferred_courts.length > 0 && <div>🏀 {form.preferred_courts.join(", ")}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "0.85rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
              <button onClick={submit} disabled={loading}
                style={{ flex: 2, background: "#E8570C", color: "#111", padding: "0.85rem", borderRadius: "100px", border: "none", fontSize: "0.9rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating account..." : "Join Splinters 🏀"}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
          Already a member? <Link href="/login" style={{ color: "#E8570C", textDecoration: "none" }}>Sign in</Link>
        </div>
      </div>
    </main>
  );
}
