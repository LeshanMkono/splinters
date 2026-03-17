"use client";

export default function Experiences() {
  const experiences = [
    { title: "THE STREET RUN", tag: "Most Popular", duration: "2-3 hrs", desc: "Join a real pick-up game at an iconic Nairobi neighbourhood court. A local guide gets you into the right run. Raw, authentic Nairobi street basketball.", includes: ["Local guide", "Court access", "Post-game local meal"], price: "KES 2,000", image: "/exp-street-run.jpg" },
    { title: "THE STREET BALL EXPERIENCE", tag: "Full Day", duration: "Full Day", desc: "The complete Nairobi street ball immersion. Morning skills session, afternoon pick-up tournament across two neighbourhood courts, evening social with the community.", includes: ["Skills session", "2-court tournament", "Evening social"], price: "KES 8,000", image: "/exp-streetball.jpg" },
    { title: "THE NAROK WEEKEND", tag: "Signature", duration: "2 Nights 3 Days", desc: "Travel to Narok. Experience Maasai culture. Play basketball with the local community. Two nights in a curated lodge, two games, one unforgettable Kenya experience.", includes: ["Return transport", "2 nights accommodation", "Cultural experience", "2 community games"], price: "KES 35,000", image: "/exp-narok.jpg" },
  ];
  return (
    <section id="experiences" style={{ position: "relative", padding: "5rem 1.5rem", minHeight: "60vh" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg-experiences.jpg')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.2) saturate(2)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(45,14,0,0.85) 40%, rgba(232,87,12,0.7) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>Tourist Experiences · Nairobi</div>
        <div style={{ fontWeight: "bold", fontSize: "clamp(2.5rem,7vw,5rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "3rem" }}>EXPERIENCE<br />NAIROBI<br />BASKETBALL</div>
        <div className="exp-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "1.5rem" }}>
          {experiences.map(exp => (
            <div key={exp.title}
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,87,12,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
              <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "rgba(232,87,12,0.9)", color: "#111", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase" }}>{exp.tag}</div>
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", padding: "3px 10px", borderRadius: "100px" }}>{exp.duration}</div>
              </div>
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#F5F2EE", marginBottom: "0.6rem", lineHeight: 1.2 }}>{exp.title}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1rem", flex: 1 }}>{exp.desc}</div>
                <div style={{ marginBottom: "1.25rem" }}>
                  {exp.includes.map(item => (
                    <div key={item} style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "#E8570C", fontWeight: "bold" }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#F5F2EE" }}>{exp.price}</div>
                  <a href="#" style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>Book Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}