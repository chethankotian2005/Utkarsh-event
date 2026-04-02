"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/#${targetId}`);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/utkarsh-logo.jpg"
            alt="Utkarsh Logo"
            width={40}
            height={40}
            className="rounded-full transition-transform duration-500 group-hover:rotate-[360deg]"
            style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.5))" }}
          />
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

        {/* Links & Admin Button */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <a href="#events" onClick={(e) => handleNavClick(e, "events")} className="nav-link-custom">
              Events
            </a>
            <a href="#treasure-hunt" onClick={(e) => handleNavClick(e, "treasure-hunt")} className="nav-link-custom">
              Treasure Hunt
            </a>
            <a href="#viral-selfie" onClick={(e) => handleNavClick(e, "viral-selfie")} className="nav-link-custom">
              Viral Selfie
            </a>
          </div>

          <Link
            href="/admin"
            className="hidden sm:block"
            style={{
              border: "1px solid var(--gold)",
              borderRadius: "0",
              background: "transparent",
              color: "var(--gold)",
              padding: "8px 24px",
              fontFamily: "var(--font-space-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(201,168,76,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
