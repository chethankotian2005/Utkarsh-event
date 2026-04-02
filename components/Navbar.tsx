"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const navLinks = [
    { label: "Events", href: "#events" },
    { label: "Treasure Hunt", href: "#treasure-hunt" },
    { label: "Viral Selfie", href: "#viral-selfie" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.25)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/utkarsh-logo.jpg"
                alt="Utkarsh Logo"
                fill
                sizes="36px"
                className="object-contain rounded-full logo-glow transition-all duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span
              className="font-display gold-text font-semibold text-lg tracking-wider hidden sm:block"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              UTKARSH
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-[var(--gold-light)] transition-colors duration-300 font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="btn-ghost-gold px-5 py-2 rounded text-xs"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="nav-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen
                  ? "bg-[var(--gold)] rotate-45 translate-y-2"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen ? "bg-[var(--gold)] opacity-0" : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen
                  ? "bg-[var(--gold)] -rotate-45 -translate-y-2"
                  : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-10"
          >
            <div className="relative w-20 h-20 mb-4">
              <Image
                src="/utkarsh-logo.jpg"
                alt="Utkarsh"
                fill
                sizes="80px"
                className="object-contain rounded-full logo-glow"
              />
            </div>

            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="font-display text-3xl gold-text tracking-widest"
                style={{ fontFamily: "var(--font-cormorant)" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <Link
                href="/admin"
                className="btn-ghost-gold px-8 py-3 rounded text-sm mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Admin Login
              </Link>
            </motion.div>

            <p
              className="absolute bottom-10 text-white/30 text-xs font-mono tracking-widest"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              SMVITM MEDIA TEAM
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
