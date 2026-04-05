
import EventCards from "@/components/EventCards";
import TreasureHuntForm from "@/components/TreasureHuntForm";
import ViralSelfieForm from "@/components/ViralSelfieForm";
import Footer from "@/components/Footer";
import ApertureHero from "@/components/ApertureHero";
import ContactCards from "@/components/ContactCards";

const contacts = [
  { name: "Dr. Deepika B.V.", phone: "+91 94810 71562", role: "Faculty Coordinator" },
  { name: "Ms. Tejaswini H", phone: "+91 97432 88112", role: "Faculty Coordinator" },
  { name: "Ms. Savitha Shenoy", phone: "+91 98803 43498", role: "Faculty Coordinator" },
  { name: "Mr. Chethan V Kotian", phone: "+91 8123936830", role: "Student Coordinator" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-transparent">
      <div className="relative" style={{ zIndex: 2 }}>
        <ApertureHero />
        <EventCards />
        <TreasureHuntForm />
        <ViralSelfieForm />
        <section
          id="contact"
          style={{
            padding: "80px 24px",
            background: "#050505",
            borderTop: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Space Mono",
                fontSize: "11px",
                letterSpacing: "0.3em",
                color: "#C9A84C",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              For Queries
            </p>
            <h2
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#fff",
                marginBottom: "48px",
              }}
            >
              Contact Us
            </h2>

            <ContactCards contacts={contacts} />
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
