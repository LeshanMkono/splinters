"use client";

export default function Experiences() {
  const experiences = [
    {
      title: "THE STREET RUN",
      tag: "Most Popular",
      duration: "2–3 hrs",
      desc: "Step into a real Nairobi pick-up game. A local guide gets you into the right run on one of the city's most iconic neighbourhood courts. Raw, unfiltered, authentic.",
      includes: ["Local guide", "Court access", "Post-game local meal"],
      image: "/exp-street-run.jpg",
    },
    {
      title: "THE STREET BALL EXPERIENCE",
      tag: "Full Day",
      duration: "Full Day",
      desc: "The complete Nairobi street ball immersion. Morning skills session with local players, afternoon tournament across two courts, evening social with the community.",
      includes: ["Morning skills session", "2-court tournament", "Evening social"],
      image: "/exp-streetball.jpg",
    },
    {
      title: "THE NAROK WEEKEND",
      tag: "Signature",
      duration: "2 Nights · 3 Days",
      desc: "Travel beyond the city. Experience Maasai culture, play basketball with the local community, and spend two nights in a curated lodge in Narok. This is where basketball meets Kenya.",
      includes: ["Return transport", "2 nights accommodation", "Cultural experience", "2 community games"],
      image: "/exp-narok.jpg",
    },
  ];

  return (
    <section id="experiences" style={{ position: "relative", padding: "5rem 0", minHeight: "60vh", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg-experiences.jpg')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.2) saturate(2)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(45,14,0,0.85) 40%, rgba(232,87,12,0.7) 100%)" }} />

      {/* Ghost text */}
      <div style={{ position: "absolute", fontFamily: "sans-serif", fontWeight: "bold", fontSize: "clamp(8rem,20vw,16rem)", color: "rgba(232,87,12,0.04)", bottom: "-2rem", right: "-1rem", letterSpacing: "10px", pointerEvents: "none", userSelect: "none", zIndex: 1, lineHeight: 1 }}>PLAY</div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>
            #03 · Tourist Experiences · Nairobi
          </div>
          <div style={{ fontWeight: "bold", fontSize: "clamp(3rem,8vw,5.5rem)", color: "#F5F2EE", lineHeight: 0.88, marginBottom: "1rem" }}>
            EXPERIENCE<br/>NAIROBI<br/><span style={{ color: "#E8570C" }}>BASKETBALL</span>
          </div>
          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "480px", fontWeight: 300 }}>
            Three curated experiences for players and visitors. From street runs to a weekend in Narok — every experience is designed to connect you with the real Nairobi.
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "1.5rem" }}>
          {experiences.map((exp, i) => (
            <div key={exp.title}
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,87,12,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>

              <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: i === 0 ? "rgba(232,87,12,0.9)" : i === 1 ? "rgba(29,185,84,0.9)" : "rgba(255,215,0,0.9)", color: "#111", fontSize: "0.58rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>{exp.tag}</div>
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.65)", fontSize: "0.58rem", padding: "3px 10px", borderRadius: "100px" }}>{exp.duration}</div>
              </div>

              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#F5F2EE", marginBottom: "0.6rem", lineHeight: 1.2, letterSpacing: "0.5px" }}>{exp.title}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.75, marginBottom: "1rem", flex: 1, fontWeight: 300 }}>{exp.desc}</div>
                <div style={{ marginBottom: "1.25rem" }}>
                  {exp.includes.map(item => (
                    <div key={item} style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.42)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "#E8570C", fontWeight: "bold" }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <a href="#" style={{ display: "inline-block", background: "#E8570C", color: "#111", padding: "0.55rem 1.5rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px", alignSelf: "flex-start" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Book Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}