"use client";

export default function Experiences() {
  const experiences = [
    {
      title: "THE STREET RUN",
      tag: "Most Popular",
      tagColor: "#E8570C",
      duration: "2–3 hrs",
      desc: "Step into a real Nairobi pick-up game. A local guide gets you into the right run on one of the city's most iconic neighbourhood courts. Raw, unfiltered, authentic.",
      includes: ["Local guide", "Court access", "Post-game local meal"],
      image: "/exp-street-run.jpg",
    },
    {
      title: "THE STREET BALL EXPERIENCE",
      tag: "Full Day",
      tagColor: "#2563EB",
      duration: "Full Day",
      desc: "The complete Nairobi street ball immersion. Morning skills session with local players, afternoon tournament across two courts, evening social with the community.",
      includes: ["Morning skills session", "2-court tournament", "Evening social"],
      image: "/exp-streetball.jpg",
    },
    {
      title: "THE NAROK WEEKEND",
      tag: "Signature",
      tagColor: "#7C3AED",
      duration: "2 Nights · 3 Days",
      desc: "Travel beyond the city. Experience Maasai culture, play basketball with the local community, and spend two nights in a curated lodge in Narok. This is where basketball meets Kenya.",
      includes: ["Return transport", "2 nights accommodation", "Cultural experience", "2 community games"],
      image: "/exp-narok.jpg",
    },
  ];

  return (
    <section id="experiences" style={{ background: "#ffffff", padding: "80px 0", borderTop: "1px solid #E8E8E8" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", color: "#999", marginBottom: "0.75rem", margin: "0 0 12px" }}>
            #03 · Tourist Experiences · Nairobi
          </p>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "#111", lineHeight: 0.9, margin: "0 0 1rem", letterSpacing: "2px" }}>
            EXPERIENCE<br />NAIROBI<br /><span style={{ color: "#E8570C" }}>BASKETBALL</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.7, maxWidth: "480px", margin: 0 }}>
            Three curated experiences for players and visitors. From street runs to a weekend in Narok — every experience is designed to connect you with the real Nairobi.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {experiences.map((exp) => (
            <div key={exp.title}
              style={{ background: "#fff", border: "1px solid #E8E8E8", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(232,87,12,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

              {/* Image */}
              <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
                <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
                <span style={{ position: "absolute", top: "12px", left: "12px", background: exp.tagColor, color: "#fff", fontSize: "0.58rem", padding: "4px 12px", borderRadius: "100px", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {exp.tag}
                </span>
                <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.58rem", padding: "4px 10px", borderRadius: "100px" }}>
                  {exp.duration}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.15rem", color: "#111", marginBottom: "0.6rem", letterSpacing: "1px" }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.7, marginBottom: "1rem", flex: 1 }}>
                  {exp.desc}
                </p>
                <div style={{ marginBottom: "1.25rem", borderTop: "1px solid #F0F0F0", paddingTop: "1rem" }}>
                  {exp.includes.map(item => (
                    <div key={item} style={{ fontSize: "0.72rem", color: "#555", marginBottom: "5px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#E8570C", fontWeight: "bold", fontSize: "0.8rem" }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <a href="#" style={{ display: "inline-block", padding: "0.6rem 1.5rem", borderRadius: "100px", textDecoration: "none", fontSize: "0.82rem", fontWeight: "700", alignSelf: "flex-start", background: "#E8570C", color: "#fff", transition: "opacity 0.2s" }}
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
