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
    <main style={{ background: "#ffffff" }}>
      <IntroAnimation />
      <Navbar />
      <MapHero />
      <DunkBanner />
      <Courts />
      <Gallery />
      <Leaderboard />
      <Experiences />
      <About />
      <Footer />
    </main>
  );
}
