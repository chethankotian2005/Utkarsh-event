
import EventCards from "@/components/EventCards";
import TreasureHuntForm from "@/components/TreasureHuntForm";
import ViralSelfieForm from "@/components/ViralSelfieForm";
import Footer from "@/components/Footer";
import ApertureHero from "@/components/ApertureHero";

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

            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {contacts.map((c, i) => (
                <a key={i} href={`tel:${c.phone.replace(/\s/g, "")}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      border: "1px solid rgba(212,175,55,0.2)",
                      borderTop: "3px solid #C9A84C",
                      background: "rgba(201,168,76,0.03)",
                      padding: "24px 20px",
                      transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.7)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.1)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Space Mono",
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                        color: "#C9A84C",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      {c.role}
                    </p>

                    <p
                      style={{
                        fontFamily: "Cormorant Garamond",
                        fontSize: "1.2rem",
                        color: "#fff",
                        marginBottom: "12px",
                        lineHeight: 1.3,
                      }}
                    >
                      {c.name}
                    </p>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(212,175,55,0.08)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        padding: "6px 14px",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-.54a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "Space Mono",
                          fontSize: "11px",
                          color: "#C9A84C",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {c.phone}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
