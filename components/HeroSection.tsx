"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";

const ApertureScene = dynamic(() => import("./ApertureScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* CSS aperture loading placeholder */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "2px solid rgba(201,168,76,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "rotateSlow 4s linear infinite",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,168,76,0.3), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  ),
});

const taglineLetters = "My SMVITM, My Pride".split("");

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Logo floating above aperture */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 mb-4"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <Image
            src="/utkarsh-logo.jpg"
            alt="Utkarsh SMVITM"
            fill
            sizes="80px"
            className="object-contain rounded-full logo-glow"
            priority
          />
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-center mb-2"
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: "var(--gold)",
          textTransform: "uppercase",
        }}
      >
        Utkarsh — SMVITM Media Team Presents
      </motion.p>

      {/* 3D Aperture Canvas */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 my-4">
        <ApertureScene />
      </div>

      {/* Tagline - letter by letter stagger */}
      <motion.h1
        className="font-display text-center px-6"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "0.04em",
        }}
        aria-label="My SMVITM, My Pride"
      >
        {taglineLetters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 2 + i * 0.04,
              ease: "easeOut",
            }}
            className={
              letter === " " || letter === ","
                ? "text-white"
                : "gold-text-animated"
            }
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.2 }}
        className="flex flex-col sm:flex-row gap-4 mt-10 px-6"
      >
        <a
          href="#treasure-hunt"
          id="cta-treasure-hunt"
          className="btn-gold px-8 py-4 rounded text-center"
        >
          🏴 Register for Treasure Hunt
        </a>
        <a
          href="#viral-selfie"
          id="cta-viral-selfie"
          className="btn-gold px-8 py-4 rounded text-center"
        >
          📸 Register for Viral Selfie
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 pulse-gold"
      >
        <a href="#events" aria-label="Scroll to events">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
