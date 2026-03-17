"use client";
import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "#0A0A0A", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      animation: "introFade 0.5s ease 2.8s both",
    }}>
      <style>{`
        @keyframes introFade { 0%{opacity:1} 100%{opacity:0} }
        @keyframes logoReveal { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ballDrop { from{top:-80px;opacity:1} to{top:50%;opacity:0;transform:translate(-50%,-50%) scale(3)} }
        @keyframes shatter1 { 0%{opacity:1;transform:translate(0,0)} 100%{opacity:0;transform:translate(-120px,-80px) scale(2)} }
        @keyframes shatter2 { 0%{opacity:1;transform:translate(0,0)} 100%{opacity:0;transform:translate(120px,-60px) scale(1.5)} }
        @keyframes shatter3 { 0%{opacity:1;transform:translate(0,0)} 100%{opacity:0;transform:translate(-80px,90px) scale(2.5)} }
        @keyframes shatter4 { 0%{opacity:1;transform:translate(0,0)} 100%{opacity:0;transform:translate(100px,80px) scale(1.8)} }
        @keyframes mapReveal { from{opacity:0} to{opacity:1} }
      `}</style>

      <div style={{ position: "absolute", fontSize: "4rem", top: "-80px", left: "50%", transform: "translateX(-50%)", animation: "ballDrop 0.5s cubic-bezier(0.5,0,1,1) 0.9s both" }}>🏀</div>

      <div style={{ position: "absolute", width: "8px", height: "8px", background: "#E8570C", borderRadius: "50%", opacity: 0, animation: "shatter1 0.4s ease 1.1s both" }} />
      <div style={{ position: "absolute", width: "8px", height: "8px", background: "#E8570C", borderRadius: "50%", opacity: 0, animation: "shatter2 0.4s ease 1.15s both" }} />
      <div style={{ position: "absolute", width: "8px", height: "8px", background: "#E8570C", borderRadius: "50%", opacity: 0, animation: "shatter3 0.4s ease 1.1s both" }} />
      <div style={{ position: "absolute", width: "8px", height: "8px", background: "#E8570C", borderRadius: "50%", opacity: 0, animation: "shatter4 0.4s ease 1.15s both" }} />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(232,87,12,0.15) 0%, transparent 70%)", opacity: 0, animation: "mapReveal 0.8s ease 1.4s both" }} />

      <div style={{ fontFamily: "sans-serif", fontSize: "clamp(4rem,12vw,9rem)", fontWeight: "bold", color: "#F5F2EE", letterSpacing: "8px", position: "relative", animation: "logoReveal 0.6s ease 0.2s both" }}>
        SPLIN<span style={{ color: "#E8570C" }}>T</span>ERS
      </div>
      <div style={{ fontSize: "0.75rem", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "1rem", animation: "logoReveal 0.6s ease 0.5s both" }}>
        Nairobi Basketball · Find Your Court
      </div>
    </div>
  );
}