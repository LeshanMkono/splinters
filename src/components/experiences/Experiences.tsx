export default function Experiences() {
  const experiences = [
    {
      title: "THE STREET RUN",
      tag: "Most Popular",
      duration: "2–3 hrs",
      desc: "Join a real pick-up game at an iconic Nairobi neighbourhood court. A local guide gets you into the right run. Raw, authentic Nairobi street basketball.",
      includes: ["Local guide", "Court access", "Post-game local meal"],
      price: "KES 2,000",
    },
    {
      title: "THE STREET BALL EXPERIENCE",
      tag: "Full Day",
      duration: "Full Day",
      desc: "The complete Nairobi street ball immersion. Morning skills session, afternoon pick-up tournament across two neighbourhood courts, evening social with the community.",
      includes: ["Skills session", "2-court tournament", "Evening social"],
      price: "KES 8,000",
    },
    {
      title: "THE NAROK WEEKEND",
      tag: "Signature",
      duration: "2 Nights · 3 Days",
      desc: "Travel to Narok. Experience Maasai culture. Play basketball with the local community. Two nights in a curated lodge, two games, one unforgettable Kenya experience.",
      includes: ["Return transport", "2 nights accommodation", "Cultural experience", "2 community games"],
      price: "KES 35,000",
    },
  ];

  return (
    <section id="experiences" style={{ position: "relative", padding: "5rem 1.5rem", minHeight: "60vh" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg-experiences.jpg')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.2) saturate(2)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(45,14,0,0.85) 40%, rgba(232,87,12,0.7) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>
          Tourist Experiences · Nairobi
        </div>
        <div style={{ fontWeight: "bold", fontSize: "clamp(3rem,8vw,6rem)", color: "#F5F2EE", lineHeight: 0.9, marginBottom: "3rem" }}>
          EXPERIENCE<br />NAIROBI<br />BASKETBALL
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.5rem" }}>
          {experiences.map(exp => (
            <div key={exp.title} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column" as const }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ background: "rgba(232,87,12,0.2)", color: "#E8570C", fontSize: "0.6rem", padding: "2px 10px", borderRadius: "100px", border: "1px solid rgba(232,87,12,0.3)", letterSpacing: "1px", textTransform: "uppercase" as const }}>{exp.tag}</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{exp.duration}</span>
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#F5F2EE", marginBottom: "0.75rem", lineHeight: 1.2 }}>{exp.title}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1rem", flex: 1 }}>{exp.desc}</div>
              <div style={{ marginBottom: "1.25rem" }}>
                {exp.includes.map(item => (
                  <div key={item} style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "#E8570C" }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#F5F2EE" }}>{exp.price}</div>
                <a href="#" style={{ background: "#E8570C", color: "#111", padding: "0.5rem 1.25rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "500" }}>Book Now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}