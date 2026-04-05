"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (pathname !== "/") {
      router.push(`/#${targetId}`);
      return;
    }

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,0.15)" : "1px solid transparent",
        padding: "16px 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Image
              src="/utkarsh-logo.jpg"
              alt="Utkarsh Logo"
              fill
              className="transition-transform duration-500 group-hover:rotate-[360deg] hero-logo"
              style={{ objectFit: "cover", objectPosition: "center", filter: "drop-shadow(0 0 8px rgba(212,175,55,0.5))" }}
            />
          </div>
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--gold-bright)",
                lineHeight: 1,
              }}
            >
              UTKARSH
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
              }}
            >
              SMVITM MEDIA TEAM
            </span>
          </div>
        </Link>

        <div className="nav-links hidden md:flex items-center gap-8">
          <a href="#events" onClick={(e) => handleNavClick(e, "events")} className="nav-link-custom">
            Events
          </a>
          <a href="#treasure-hunt" onClick={(e) => handleNavClick(e, "treasure-hunt")} className="nav-link-custom">
            Treasure Hunt
          </a>
          <a href="#viral-selfie" onClick={(e) => handleNavClick(e, "viral-selfie")} className="nav-link-custom">
            Viral Selfie
          </a>
          <Link
            href="/admin"
            className="flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-widest transition-all duration-300 relative group overflow-hidden"
            style={{
              width: "60px",
              height: "24px",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "var(--gold)",
              borderRadius: "2px",
            }}
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">Admin</span>
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ backgroundColor: "var(--gold)" }} />
          </Link>
        </div>

        <button
          type="button"
          className="hamburger md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 z-[60]"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span style={{ width: "20px", height: "1px", background: "#C9A84C", margin: "4px 0" }} />
          <span style={{ width: "20px", height: "1px", background: "#C9A84C", margin: "4px 0" }} />
          <span style={{ width: "20px", height: "1px", background: "#C9A84C", margin: "4px 0" }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[999] bg-black/97 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-6 hamburger flex items-center justify-center w-10 h-10"
            >
              <span style={{ position: "absolute", width: "22px", height: "1px", background: "#C9A84C", transform: "rotate(45deg)" }} />
              <span style={{ position: "absolute", width: "22px", height: "1px", background: "#C9A84C", transform: "rotate(-45deg)" }} />
            </button>

            <a href="#events" onClick={(e) => handleNavClick(e, "events")} className="font-mono text-3xl gold-text uppercase tracking-[0.22em]">Events</a>
            <a href="#treasure-hunt" onClick={(e) => handleNavClick(e, "treasure-hunt")} className="font-mono text-3xl gold-text uppercase tracking-[0.22em]">Treasure Hunt</a>
            <a href="#viral-selfie" onClick={(e) => handleNavClick(e, "viral-selfie")} className="font-mono text-3xl gold-text uppercase tracking-[0.22em]">Viral Selfie</a>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="mt-6 font-mono text-sm uppercase tracking-widest py-3 px-8 transition-all duration-300"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                color: "var(--gold)",
                borderRadius: "2px",
              }}
            >
              Admin Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
