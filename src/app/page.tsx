import Navbar from "@/components/layout/Navbar";
import IntroAnimation from "@/components/layout/IntroAnimation";
import MapHero from "@/components/map/MapHero";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import Experiences from "@/components/experiences/Experiences";

export default function Home() {
  return (
    <main>
      <IntroAnimation />
      <Navbar />
      <MapHero />
      <Leaderboard />
      <Experiences />
    </main>
  );
}