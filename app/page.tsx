
import EventCards from "@/components/EventCards";
import TreasureHuntForm from "@/components/TreasureHuntForm";
import ViralSelfieForm from "@/components/ViralSelfieForm";
import Footer from "@/components/Footer";
import ApertureHero from "@/components/ApertureHero";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-transparent">
      <div className="relative" style={{ zIndex: 2 }}>
        <ApertureHero />
        <EventCards />
        <TreasureHuntForm />
        <ViralSelfieForm />
        <Footer />
      </div>
    </main>
  );
}
