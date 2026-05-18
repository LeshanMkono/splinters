# Splinters v2 Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the v2 wireframe design into the Splinters Next.js codebase — adding DunkBanner, Gallery, basketball cursor, floating ball, and upgrading all existing sections to glass-button standard + editorial typography.

**Architecture:** All visual upgrades are isolated in existing or new component files. No new npm packages. Inline React style objects (codebase convention). Two new components (DunkBanner, Gallery) added as leaf Client Components. BasketballCursor and FloatingBall are fixed-position overlays added to page.tsx.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase, Google Fonts (Bebas Neue + DM Sans), CSS @keyframes (no framer-motion).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/globals.css` | Modify | Glass button keyframes, floatBounce, scrollReveal, cursor:none on desktop |
| `src/components/cursor/BasketballCursor.tsx` | Create | rAF-driven SVG basketball cursor, desktop only |
| `src/components/cursor/FloatingBall.tsx` | Create | Fixed-position mobile CTA linking to WhatsApp |
| `src/components/layout/Navbar.tsx` | Modify | Frosted glass on scroll, glass button Sign In / Join |
| `src/components/map/MapHero.tsx` | Modify | Animated SPLINTERS letters overlay over the map |
| `src/components/banner/DunkBanner.tsx` | Create | Conic rays, canvas particles, rim SVG, hero text |
| `src/components/gallery/Gallery.tsx` | Create | Draggable horizontal scroll court gallery |
| `src/components/courts/Courts.tsx` | Modify | Glass card border glow on hover, filter pills glass style |
| `src/components/about/About.tsx` | Modify | Editorial split: rodman.webp full-height left, text stack right |
| `src/components/leaderboard/Leaderboard.tsx` | Modify | Table row layout, scroll-reveal, glass MVP banner |
| `src/components/experiences/Experiences.tsx` | Modify | Glass badge tags, BOOK NOW slide-up overlay on hover |
| `src/components/layout/Footer.tsx` | Modify | SVG icons replacing emoji social links |
| `src/app/page.tsx` | Modify | Add BasketballCursor, FloatingBall, DunkBanner, Gallery |

---

## Task 1: globals.css — Glass button, animations, cursor

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add glass button class, float animation, scroll-reveal keyframe, cursor:none rule**

Append to the end of `src/app/globals.css`:

```css
/* ── Glass button standard ── */
.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(232, 87, 12, 0.4);
  box-shadow: inset 0 1px 0 rgba(255, 140, 60, 0.3), 0 4px 24px rgba(232, 87, 12, 0.2);
  color: #F5F2EE;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-glass:hover {
  background: rgba(232, 87, 12, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 140, 60, 0.4), 0 6px 32px rgba(232, 87, 12, 0.35);
}

/* ── Floating ball animation ── */
@keyframes floatBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(10deg); }
}

/* ── Scroll-reveal animation ── */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal-up {
  animation: revealUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ── Desktop cursor:none (only when basketball cursor is mounted) ── */
body.has-basketball-cursor {
  cursor: none;
}
body.has-basketball-cursor a,
body.has-basketball-cursor button {
  cursor: none;
}

/* ── Hide floating ball on desktop, cursor on mobile ── */
.floating-ball { display: none; }
@media (max-width: 767px) {
  .floating-ball { display: flex; }
  .basketball-cursor { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .floating-ball { animation: none !important; }
  .reveal-up { animation: none !important; opacity: 1 !important; }
}

/* ── Gallery drag cursor ── */
.gallery-track { cursor: grab; }
.gallery-track:active { cursor: grabbing; }
.gallery-track::-webkit-scrollbar { display: none; }
```

- [ ] **Step 2: Verify file saved correctly**

Open `src/app/globals.css` in an editor and confirm the new classes appear at the bottom without breaking the existing `@import "tailwindcss"` at line 2.

- [ ] **Step 3: Commit**

```bash
cd /home/leshan/splinters
git add src/app/globals.css
git commit -m "style: add glass button, float, reveal-up keyframes and cursor classes"
```

---

## Task 2: BasketballCursor component

**Files:**
- Create: `src/components/cursor/BasketballCursor.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { useEffect, useRef } from "react";

export default function BasketballCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0);
  const lastXRef = useRef(-1);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Desktop (pointer device) only
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("has-basketball-cursor");

    const onMove = (e: MouseEvent) => {
      if (lastXRef.current !== -1) {
        const dx = e.clientX - lastXRef.current;
        rotRef.current += dx * 0.7;
      }
      lastXRef.current = e.clientX;
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove);

    const tick = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px) rotate(${rotRef.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("has-basketball-cursor");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="basketball-cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "40px",
        height: "40px",
        zIndex: 99999,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      <svg viewBox="0 0 100 100" width="40" height="40">
        <circle cx="50" cy="50" r="48" fill="#E8570C" stroke="#1a0600" strokeWidth="3" />
        <path d="M 50 2 Q 82 25 82 50 Q 82 75 50 98" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 50 2 Q 18 25 18 50 Q 18 75 50 98" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 2 50 Q 25 38 50 38 Q 75 38 98 50" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 2 50 Q 25 62 50 62 Q 75 62 98 50" stroke="#1a0600" strokeWidth="3.5" fill="none" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/cursor/BasketballCursor.tsx
git commit -m "feat: add BasketballCursor component with rAF rotation accumulation"
```

---

## Task 3: FloatingBall component

**Files:**
- Create: `src/components/cursor/FloatingBall.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

export default function FloatingBall() {
  return (
    <a
      href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join Splinters WhatsApp community"
      className="floating-ball"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 1000,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#E8570C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 32px rgba(232,87,12,0.55)",
        animation: "floatBounce 2.8s ease-in-out infinite",
        textDecoration: "none",
      }}
    >
      <svg viewBox="0 0 100 100" width="32" height="32" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="#F5F2EE" stroke="#1a0600" strokeWidth="3" />
        <path d="M 50 2 Q 82 25 82 50 Q 82 75 50 98" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 50 2 Q 18 25 18 50 Q 18 75 50 98" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 2 50 Q 25 38 50 38 Q 75 38 98 50" stroke="#1a0600" strokeWidth="3.5" fill="none" />
        <path d="M 2 50 Q 25 62 50 62 Q 75 62 98 50" stroke="#1a0600" strokeWidth="3.5" fill="none" />
      </svg>
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/cursor/FloatingBall.tsx
git commit -m "feat: add FloatingBall mobile CTA component"
```

---

## Task 4: Update Navbar — frosted glass on scroll + glass buttons

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Current state:** 120-line "use client" component. Auth-aware (Supabase). Inline styles. Signs in/out. Mobile hamburger.

**Change:** Add scroll listener that adds frosted glass background when `scrollY > 40`. Replace the plain "Sign In" and "Join" anchor/button styles with the glass button style.

- [ ] **Step 1: Read the current file**

Read `src/components/layout/Navbar.tsx` to confirm current state before editing.

- [ ] **Step 2: Add useEffect scroll listener and scrolled state, update button styles**

In `Navbar.tsx`, after the existing `useState` declarations, add a `scrolled` state and effect:

```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Update the outer `<nav>` inline style background to use scrolled state:

```tsx
// Old:
style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "1rem 1.5rem", background: "transparent" }}

// New:
style={{
  position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "1rem 1.5rem",
  background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
  backdropFilter: scrolled ? "blur(16px)" : "none",
  WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
  borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
  transition: "background 0.3s, backdrop-filter 0.3s",
}}
```

Find the "Sign In" link (auth=false state). Update its style:
```tsx
// Old (approximate):
style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "0.45rem 1.1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem" }}

// New — glass button:
className="btn-glass"
style={{ padding: "0.45rem 1.1rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}
```

Find the "Join" link. Update its style:
```tsx
// Old:
style={{ background: "#E8570C", color: "#111", padding: "0.45rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}

// Keep as-is — the orange solid CTA stays orange, only ghost CTAs get the glass treatment.
```

- [ ] **Step 3: Commit**

```bash
cd /home/leshan/splinters
git add src/components/layout/Navbar.tsx
git commit -m "feat: navbar frosted glass on scroll, glass Sign In button"
```

---

## Task 5: MapHero — animated SPLINTERS letters overlay

**Files:**
- Modify: `src/components/map/MapHero.tsx`

**Change:** Add a brief animated title overlay that sits above the map while it's loading, then fades to a compact watermark once the map is visible. This is pure CSS — no logic changes to the map itself.

- [ ] **Step 1: Add SPLINTERS overlay above the search bar**

In `MapHero.tsx`, inside the `<section>` but before the search bar div (the one at `zIndex: 50`), add:

```tsx
{/* Hero title overlay — fades once map loads */}
<div style={{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 30,
  textAlign: "center",
  pointerEvents: "none",
  opacity: mapLoaded ? 0 : 1,
  transition: "opacity 1s ease 0.5s",
}}>
  <div style={{
    fontFamily: "Bebas Neue, sans-serif",
    fontSize: "clamp(3rem, 12vw, 9rem)",
    color: "#F5F2EE",
    letterSpacing: "12px",
    lineHeight: 1,
    textShadow: "0 0 60px rgba(232,87,12,0.4)",
    animation: "logoReveal 0.8s ease both",
  }}>
    SPLIN<span style={{ color: "#E8570C" }}>T</span>ERS
  </div>
  <div style={{
    fontSize: "0.7rem",
    letterSpacing: "5px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginTop: "0.75rem",
    animation: "logoReveal 0.8s ease 0.3s both",
  }}>
    Nairobi Basketball · Find Your Court
  </div>
</div>
```

The existing `logoReveal` keyframe is already defined in `globals.css`.

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/map/MapHero.tsx
git commit -m "feat: SPLINTERS hero title overlay on MapHero with fade-out on load"
```

---

## Task 6: DunkBanner component

**Files:**
- Create: `src/components/banner/DunkBanner.tsx`

This section sits between MapHero and Courts. Full viewport height. Conic spotlight rays, canvas particle dust, basketball rim SVG, large editorial type.

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; size: number;
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

      {/* Radial glow at top */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(232,87,12,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Canvas particles */}
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

      {/* Basketball rim SVG */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", top: "24%", left: "50%", transform: "translateX(-50%)", width: "clamp(120px, 20vw, 200px)" }}
        viewBox="0 0 200 60"
      >
        {/* Backboard anchor line */}
        <line x1="100" y1="0" x2="100" y2="-20" stroke="#666" strokeWidth="5" strokeLinecap="round" />
        {/* Rim */}
        <ellipse cx="100" cy="30" rx="88" ry="12" fill="none" stroke="#E8570C" strokeWidth="5" />
        {/* Net lines */}
        {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((t, i) => (
          <line
            key={i}
            x1={12 + t * 176}
            y1={30 + 12 * Math.abs(Math.sin(Math.PI * t))}
            x2={12 + t * 176 + 12}
            y2={58}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Main text */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>
          Nairobi Basketball
        </div>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(4.5rem, 18vw, 14rem)",
          color: "#F5F2EE",
          lineHeight: 0.82,
          letterSpacing: "6px",
          marginBottom: "0",
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
        <p style={{ fontSize: "0.78rem", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "2.5rem" }}>
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
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/banner/DunkBanner.tsx
git commit -m "feat: add DunkBanner with conic rays, canvas particles, rim SVG"
```

---

## Task 7: Gallery component

**Files:**
- Create: `src/components/gallery/Gallery.tsx`

Draggable horizontal scroll showing 6 courts fetched from Supabase (using `featured` or top-rated). Each card: tall aspect ratio, court image, district label, court name in Bebas Neue. Drag support via pointer events.

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Court {
  id: string;
  name: string;
  district: string;
  slug: string;
  image_url: string | null;
  rating: number | null;
}

export default function Gallery() {
  const [courts, setCourts] = useState<Court[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("courts")
        .select("id, name, district, slug, image_url, rating")
        .order("rating", { ascending: false })
        .limit(7);
      if (!error && data) setCourts(data as Court[]);
    }
    fetch();
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onPointerUp = () => { isDragging.current = false; };

  const FALLBACK_GRADIENTS = [
    "linear-gradient(135deg, #1a0800, #2d1205)",
    "linear-gradient(135deg, #0d1b2a, #0a2a18)",
    "linear-gradient(135deg, #1a0d00, #2a1a00)",
    "linear-gradient(135deg, #080d1a, #0d1b2a)",
    "linear-gradient(135deg, #1a0000, #2a0d00)",
    "linear-gradient(135deg, #0a1a0a, #1a2a0a)",
    "linear-gradient(135deg, #1a001a, #2a0d2a)",
  ];

  return (
    <section style={{ padding: "4rem 0 5rem", background: "#0A0A0A", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Courts · Gallery</div>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#F5F2EE", lineHeight: 1 }}>
              WHERE NAIROBI PLAYS
            </h2>
          </div>
          <a href="/courts" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E8570C")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
            View all courts →
          </a>
        </div>
      </div>

      <div
        ref={trackRef}
        className="gallery-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          display: "flex",
          gap: "1.25rem",
          padding: "0.5rem 1.5rem 1rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          userSelect: "none",
        }}
      >
        {(courts.length > 0 ? courts : Array(6).fill(null)).map((court, i) => (
          <a
            key={court?.id ?? i}
            href={court ? `/courts/${court.slug}` : "#"}
            draggable={false}
            style={{
              flexShrink: 0,
              width: "clamp(220px, 28vw, 340px)",
              height: "440px",
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              background: court?.image_url ? undefined : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
              border: "1px solid rgba(255,255,255,0.07)",
              textDecoration: "none",
              transition: "transform 0.3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {court?.image_url && (
              <img
                src={court.image_url}
                alt={court.name ?? "Basketball court"}
                draggable={false}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {/* Gradient overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 45%, transparent 65%)",
            }} />
            {/* Labels */}
            {court && (
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.25rem", right: "1.25rem" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.3rem" }}>
                  {court.district}
                </div>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.65rem", color: "#F5F2EE", lineHeight: 1.1 }}>
                  {court.name}
                </div>
              </div>
            )}
            {/* Shimmer placeholder */}
            {!court && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                animation: "shimmer 1.8s infinite",
              }} />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
```

Add to `globals.css` (append after the last rule):
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/gallery/Gallery.tsx src/app/globals.css
git commit -m "feat: add Gallery draggable horizontal scroll with Supabase courts"
```

---

## Task 8: Update Courts.tsx — glass card hover glow

**Files:**
- Modify: `src/components/courts/Courts.tsx`

**Change:** Small targeted update: enhance the `CourtCard` hover style to use the glass box-shadow glow on hover (matching glass button aesthetic). Also update the "Partner With Us" CTA at the bottom to use `.btn-glass` class instead of the plain transparent background.

- [ ] **Step 1: Update CourtCard onMouseEnter/Leave**

In `Courts.tsx`, find `CourtCard` `onMouseEnter`:
```tsx
// Old:
onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = "rgba(232,87,12,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}}
onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}}>

// New:
onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = "rgba(232,87,12,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(232,87,12,0.15), 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,140,60,0.1)"; }}}
onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}}>
```

- [ ] **Step 2: Update "Partner With Us" button**

Find the "Partner With Us" `<a>` inside the bottom promo box:
```tsx
// Old:
style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}

// New (keep orange solid — it's a primary CTA):
// No change — orange CTA stays orange.
```

Find the `<a>` for "💬 Splinters Community" in the section header:
```tsx
// Old:
style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366", ... }}

// Keep as-is — this is a WhatsApp green link, intentionally different.
```

- [ ] **Step 3: Commit**

```bash
cd /home/leshan/splinters
git add src/components/courts/Courts.tsx
git commit -m "style: enhance CourtCard hover with glass glow shadow"
```

---

## Task 9: Update About.tsx — editorial split layout

**Files:**
- Modify: `src/components/about/About.tsx`

**Change:** Replace the centered ROD-image-MAN layout with an editorial split: rodman.webp fills the entire left ~55%, text stack fills the right ~45%. On mobile: image on top, text below. Keep the same Supabase/data structure (it's all static here).

- [ ] **Step 1: Rewrite the About component**

Replace the full contents of `src/components/about/About.tsx`:

```tsx
"use client";

export default function About() {
  return (
    <section id="about" style={{ position: "relative", overflow: "hidden", background: "#0A0A0A" }}>

      {/* Ghost RODMAN watermark */}
      <div aria-hidden="true" style={{
        position: "absolute",
        zIndex: 1,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "Bebas Neue, sans-serif",
        fontWeight: "bold",
        fontSize: "clamp(5rem, 22vw, 20rem)",
        color: "rgba(232,87,12,0.04)",
        letterSpacing: "12px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        lineHeight: 1,
      }}>
        RODMAN
      </div>

      {/* Editorial split */}
      <div className="about-editorial" style={{
        display: "grid",
        gridTemplateColumns: "55% 45%",
        minHeight: "100dvh",
        position: "relative",
        zIndex: 2,
      }}>

        {/* LEFT — full-bleed rodman image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src="/rodman.webp"
            alt="Rodman — the spirit of Splinters"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "saturate(1.15) contrast(1.05)",
            }}
          />
          {/* Right-edge fade into background */}
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "30%",
            background: "linear-gradient(to right, transparent, #0A0A0A)",
            pointerEvents: "none",
          }} />
          {/* Bottom fade */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "25%",
            background: "linear-gradient(to top, #0A0A0A, transparent)",
            pointerEvents: "none",
          }} />
        </div>

        {/* RIGHT — text stack */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "5rem 2.5rem 5rem 2rem",
        }}>
          <div style={{
            fontSize: "0.62rem",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "1.5rem",
          }}>
            About Splinters · Est. 2025
          </div>

          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
            color: "#F5F2EE",
            lineHeight: 0.9,
            letterSpacing: "2px",
            marginBottom: "0.5rem",
          }}>
            EVERY CITY
          </h2>
          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
            color: "#E8570C",
            lineHeight: 0.9,
            letterSpacing: "2px",
            marginBottom: "2rem",
          }}>
            NEEDS ITS RODMAN
          </h2>

          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: "1rem", fontWeight: 300, maxWidth: "420px" }}>
            Dennis Rodman was the most unpredictable player on the most dominant team in NBA history. He did not follow the rules. He did not fit the mould. He just won.
          </p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: "2rem", fontWeight: 300, maxWidth: "420px" }}>
            Splinters is built the same way. We mapped the soul of Nairobi basketball — the hidden courts, the midnight runs, the players nobody knows about yet.
          </p>

          <blockquote style={{
            borderLeft: "3px solid #E8570C",
            paddingLeft: "1.25rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#E8570C", lineHeight: 1.3, fontStyle: "italic", letterSpacing: "1px" }}>
              "The Worm always finds the ball."
            </p>
          </blockquote>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {[["63+", "Courts"], ["8", "Districts"], ["3", "Experiences"], ["2025", "Est."]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#courts" style={{ background: "#E8570C", color: "#111", padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Find a Court
            </a>
            <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer"
              className="btn-glass"
              style={{ padding: "0.75rem 1.75rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Join Community
            </a>
          </div>
        </div>
      </div>

      {/* Values strip */}
      <div className="about-values" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem 5rem",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "3rem",
      }}>
        {[
          { title: "Court Discovery", desc: "Every court in Nairobi mapped and verified. From hidden neighbourhood gems to professional arenas." },
          { title: "Competitive League", desc: "Weekly pick-up games tracked by referees and scouts. Real stats. Real rankings. Real MVP." },
          { title: "Basketball Tourism", desc: "Curated experiences for visitors. Street runs, court tours, and the Narok Weekend." },
        ].map(item => (
          <div key={item.title}
            style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,87,12,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(232,87,12,0.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#F5F2EE", marginBottom: "0.5rem", letterSpacing: "1px" }}>{item.title}</div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-editorial { grid-template-columns: 1fr !important; }
          .about-editorial > div:first-child { height: 60vw; position: relative !important; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/about/About.tsx
git commit -m "feat: About editorial split layout — rodman full-bleed left, text stack right"
```

---

## Task 10: Update Leaderboard.tsx — table row layout + glass MVP banner

**Files:**
- Modify: `src/components/leaderboard/Leaderboard.tsx`

**Change:** Replace the fan-card carousel with a cleaner leaderboard table (5 rows, rank badge, stat columns). Keep the MVP banner at the bottom but give it the glass aesthetic. The coverflow was visually heavy; rows are faster to scan.

- [ ] **Step 1: Rewrite Leaderboard component**

Replace the full contents of `src/components/leaderboard/Leaderboard.tsx`:

```tsx
"use client";

const PLAYERS = [
  { rank: 1, name: "James Omondi",  court: "Parklands SC",   position: "PG", pts: 34.5, reb: 5,  ast: 3, games: 6,  mvp: true  },
  { rank: 2, name: "Brian Kamau",   court: "Kasarani Arena",  position: "SG", pts: 28.0, reb: 2,  ast: 6, games: 5,  mvp: false },
  { rank: 3, name: "Alex Mwangi",   court: "Strathmore Univ", position: "SF", pts: 24.3, reb: 8,  ast: 1, games: 7,  mvp: false },
  { rank: 4, name: "David Njoroge", court: "Karen Gated",     position: "PF", pts: 21.8, reb: 6,  ast: 2, games: 5,  mvp: false },
  { rank: 5, name: "Samuel Weru",   court: "USIU Africa",     position: "C",  pts: 18.5, reb: 9,  ast: 1, games: 4,  mvp: false },
];

const RANK_COLORS: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };

export default function Leaderboard() {
  return (
    <section id="league" style={{ padding: "4rem 0", background: "#0A0A0A" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#E8570C", marginBottom: "0.4rem" }}>Community</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F5F2EE", lineHeight: 1 }}>
              WEEKLY SCORERS
            </h2>
            <div style={{ background: "rgba(232,87,12,0.1)", border: "1px solid rgba(232,87,12,0.3)", color: "#E8570C", fontSize: "0.7rem", padding: "0.3rem 0.8rem", borderRadius: "100px", fontWeight: "500" }}>
              WEEK 11 · 2025
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 60px 60px 60px 50px", gap: "0", padding: "0.6rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            {["#", "Player", "PTS", "REB", "AST", "GP"].map(col => (
              <div key={col} style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textAlign: col === "Player" || col === "#" ? "left" : "center" }}>
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {PLAYERS.map((p, i) => (
            <div
              key={p.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 60px 60px 60px 50px",
                gap: "0",
                padding: "1rem 1.25rem",
                borderBottom: i < PLAYERS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.15s",
                alignItems: "center",
                animation: `revealUp 0.45s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(232,87,12,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Rank */}
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: RANK_COLORS[p.rank] ?? "rgba(255,255,255,0.2)", lineHeight: 1 }}>
                {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : p.rank}
              </div>

              {/* Player info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#F5F2EE" }}>{p.name}</span>
                  {p.mvp && (
                    <span style={{ background: "#E8570C", color: "#111", fontSize: "0.5rem", padding: "1px 6px", borderRadius: "100px", fontWeight: "600", letterSpacing: "0.5px" }}>MVP</span>
                  )}
                </div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>{p.court} · {p.position}</div>
              </div>

              {/* Stats */}
              {[p.pts, p.reb, p.ast, p.games].map((val, j) => (
                <div key={j} style={{ textAlign: "center" }}>
                  <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: j === 0 ? "1.3rem" : "1.1rem", color: j === 0 ? "#E8570C" : "rgba(255,255,255,0.65)", lineHeight: 1 }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* MVP Banner */}
        <div className="btn-glass" style={{
          borderRadius: "16px",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#FFD700", lineHeight: 1 }}>MVP</div>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>2025 Annual MVP — Current Leader</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", color: "#F5F2EE", lineHeight: 1, marginBottom: "0.5rem" }}>JAMES OMONDI</div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[["312", "Total PTS"], ["47", "Games"], ["8", "Weeks #1"], ["6.6", "Avg PPG"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#E8570C", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textTransform: "uppercase" }}>Resets In</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.6rem", color: "#E8570C" }}>41 WEEKS</div>
            <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>Dec 31, 2025</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/leshan/splinters
git add src/components/leaderboard/Leaderboard.tsx
git commit -m "feat: Leaderboard rewritten as table rows with glass MVP banner"
```

---

## Task 11: Update Experiences.tsx — glass badge tags + slide-up BOOK NOW

**Files:**
- Modify: `src/components/experiences/Experiences.tsx`

**Change:** Each card gets a glass-style tag badge (replacing the solid color badges). The "Book Now →" button gains a slide-up hover reveal: on hover the button text slides up and an underline animates. Small targeted CSS change using onMouseEnter/Leave.

- [ ] **Step 1: Update tag badge styles**

In `Experiences.tsx`, find the tag badge inside the card image overlay:

```tsx
// Old:
style={{ ... background: i === 0 ? "rgba(232,87,12,0.9)" : i === 1 ? "rgba(29,185,84,0.9)" : "rgba(255,215,0,0.9)", color: "#111", ... }}

// New — glass badge:
style={{
  position: "absolute", top: "0.75rem", left: "0.75rem",
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(232,87,12,0.45)",
  color: "#F5F2EE",
  fontSize: "0.58rem",
  padding: "3px 10px",
  borderRadius: "100px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
}}
```

- [ ] **Step 2: Update "Book Now" CTA to glass button**

Find the "Book Now →" `<a>` at the bottom of each card:

```tsx
// Old:
style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.55rem 1.5rem", borderRadius: "100px", ... }}

// New — glass:
className="btn-glass"
style={{
  display: "inline-block",
  padding: "0.55rem 1.5rem",
  borderRadius: "100px",
  textDecoration: "none",
  fontSize: "0.8rem",
  fontWeight: "600",
  letterSpacing: "0.5px",
  alignSelf: "flex-start",
  transition: "all 0.2s",
}}
```

Remove the existing `onMouseEnter`/`onMouseLeave` from the Book Now link (they set opacity — no longer needed; `.btn-glass:hover` handles it in CSS).

- [ ] **Step 3: Commit**

```bash
cd /home/leshan/splinters
git add src/components/experiences/Experiences.tsx
git commit -m "style: glass badge tags and glass Book Now buttons in Experiences"
```

---

## Task 12: Update Footer.tsx — replace emoji social links with SVG icons

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Change:** Replace `📸 Instagram`, `🎵 TikTok`, `💬 Join WhatsApp Community` text emojis with inline SVGs for a cleaner look.

- [ ] **Step 1: Update WhatsApp community link**

Find the WhatsApp community link (line ~19-24) and replace its text content:

```tsx
// Old text inside the <a>:
💬 Join WhatsApp Community

// New — SVG icon + text:
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
</svg>
Join WhatsApp Community
```

- [ ] **Step 2: Update Instagram link text**

Find `📸 Instagram` and replace:
```tsx
// Old: 📸 Instagram
// New:
<>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
  Instagram
</>
```

- [ ] **Step 3: Update TikTok link text**

Find `🎵 TikTok` and replace:
```tsx
// Old: 🎵 TikTok
// New:
<>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.18 8.18 0 004.78 1.54V6.58a4.85 4.85 0 01-1.01.11z"/>
  </svg>
  TikTok
</>
```

- [ ] **Step 4: Commit**

```bash
cd /home/leshan/splinters
git add src/components/layout/Footer.tsx
git commit -m "style: replace emoji social links with inline SVG icons in Footer"
```

---

## Task 13: Update page.tsx — wire in all new components

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx**

Replace the full contents of `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import IntroAnimation from "@/components/layout/IntroAnimation";
import MapHero from "@/components/map/MapHero";
import DunkBanner from "@/components/banner/DunkBanner";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import Experiences from "@/components/experiences/Experiences";
import Courts from "@/components/courts/Courts";
import Gallery from "@/components/gallery/Gallery";
import About from "@/components/about/About";
import Footer from "@/components/layout/Footer";
import BasketballCursor from "@/components/cursor/BasketballCursor";
import FloatingBall from "@/components/cursor/FloatingBall";

export default function Home() {
  return (
    <main>
      <IntroAnimation />
      <BasketballCursor />
      <FloatingBall />
      <Navbar />
      <MapHero />
      <DunkBanner />
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/bg-edwards.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
          filter: "brightness(0.08) saturate(1.5)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <Courts />
          <Gallery />
          <Leaderboard />
          <Experiences />
        </div>
      </div>
      <About />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
cd /home/leshan/splinters
npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors from `any` types in MapHero/Courts).

- [ ] **Step 3: Commit**

```bash
cd /home/leshan/splinters
git add src/app/page.tsx
git commit -m "feat: wire DunkBanner, Gallery, BasketballCursor, FloatingBall into homepage"
```

---

## Self-Review

**Spec coverage:**
- [x] Glass button standard — Task 1 (globals.css), used in Tasks 4, 6, 9, 10, 11
- [x] Basketball cursor (desktop) — Task 2
- [x] Floating ball (mobile) — Task 3
- [x] Navbar frosted glass — Task 4
- [x] MapHero animated letters — Task 5
- [x] DunkBanner section — Task 6
- [x] Gallery section — Task 7
- [x] Courts glass hover — Task 8
- [x] About editorial split — Task 9
- [x] Leaderboard table rows — Task 10
- [x] Experiences glass badges — Task 11
- [x] Footer SVG icons — Task 12
- [x] page.tsx wired — Task 13

**Type consistency:**
- `Court` interface in Gallery matches Supabase columns (id, name, district, slug, image_url, rating)
- `Particle` interface in DunkBanner is local to that file
- `BasketballCursor` uses `HTMLDivElement` ref — correct
- All `onMouseEnter/Leave` cast with `(e.currentTarget as HTMLElement)` where needed

**Placeholder scan:** No TBDs, all code blocks are complete.
