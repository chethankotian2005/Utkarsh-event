import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventCards from "@/components/EventCards";
import TreasureHuntForm from "@/components/TreasureHuntForm";
import ViralSelfieForm from "@/components/ViralSelfieForm";
import Footer from "@/components/Footer";

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      <ParticleBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <HeroSection />
        <EventCards />
        <TreasureHuntForm />
        <ViralSelfieForm />
        <Footer />
      </div>
    </main>
  );
}
