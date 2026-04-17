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

export default function Home() {
  return (
    <main>
      <IntroAnimation />
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
