"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export default function DunkBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const W = canvas.width;
      const H = canvas.height;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: W / 2 + (Math.random() - 0.5) * 100,
          y: H * 0.32,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -(Math.random() * 3 + 0.5),
          life: 1,
          size: Math.random() * 3 + 1.5,
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawn();
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 0.012;
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = "#E8570C";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const netTs = [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92];

  return (
    <section style={{
      position: "relative",
      minHeight: "100dvh",
      overflow: "hidden",
      background: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Conic rays */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        background: [
          "conic-gradient(from 0deg at 50% 38%,",
          "transparent 0deg, rgba(232,87,12,0.07) 8deg, transparent 16deg,",
          "rgba(232,87,12,0.05) 28deg, transparent 36deg,",
          "rgba(232,87,12,0.07) 48deg, transparent 56deg,",
          "rgba(232,87,12,0.05) 68deg, transparent 76deg,",
          "rgba(232,87,12,0.07) 88deg, transparent 96deg,",
          "rgba(232,87,12,0.05) 108deg, transparent 116deg,",
          "rgba(232,87,12,0.07) 128deg, transparent 136deg,",
          "rgba(232,87,12,0.05) 148deg, transparent 156deg,",
          "transparent 360deg)",
        ].join(" "),
      }} />

      {/* Radial glow */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(232,87,12,0.16) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Basketball rim */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(120px, 20vw, 200px)",
          overflow: "visible",
        }}
        viewBox="0 0 200 70"
      >
        <line x1="100" y1="0" x2="100" y2="-24" stroke="#555" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="100" cy="30" rx="88" ry="12" fill="none" stroke="#E8570C" strokeWidth="5" />
        {netTs.map((t, i) => (
          <line
            key={i}
            x1={12 + t * 176}
            y1={30 + 12 * Math.abs(Math.sin(Math.PI * t))}
            x2={12 + t * 176 + 10}
            y2={68}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Main text */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem" }}>
        <div style={{
          fontSize: "0.65rem",
          letterSpacing: "5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "1rem",
        }}>
          Nairobi Basketball
        </div>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(4.5rem, 18vw, 14rem)",
          color: "#F5F2EE",
          lineHeight: 0.82,
          letterSpacing: "6px",
          margin: 0,
        }}>
          PLAY
        </h2>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(4.5rem, 18vw, 14rem)",
          color: "#E8570C",
          lineHeight: 0.82,
          letterSpacing: "6px",
          marginBottom: "1.5rem",
        }}>
          NAIROBI
        </h2>
        <p style={{
          fontSize: "0.78rem",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "2.5rem",
        }}>
          63+ Courts · 8 Districts · 1 Community
        </p>
        <a
          href="#courts"
          className="btn-glass"
          style={{
            display: "inline-block",
            padding: "0.9rem 2.75rem",
            borderRadius: "100px",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: "500",
            letterSpacing: "1px",
          }}
        >
          Find Your Court →
        </a>
      </div>
    </section>
  );
}
