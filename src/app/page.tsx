import Navbar from "@/components/layout/Navbar";
import IntroAnimation from "@/components/layout/IntroAnimation";
import MapHero from "@/components/map/MapHero";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import Experiences from "@/components/experiences/Experiences";
import Courts from "@/components/courts/Courts";
import About from "@/components/about/About";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <IntroAnimation />
      <Navbar />
      <MapHero />
      <Courts />
      <Leaderboard />
      <Experiences />
      <About />
      <Footer />
    </main>
  );
}