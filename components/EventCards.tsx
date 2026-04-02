"use client";

import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

function TreasureChestIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
      <defs>
        <linearGradient id="chestGold" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      <rect x="8" y="38" width="64" height="34" rx="4" fill="url(#chestGold)" opacity="0.9" />
      <path d="M8 38 Q8 20 40 16 Q72 20 72 38 Z" fill="url(#chestGold)" />
      <rect x="30" y="48" width="20" height="14" rx="3" fill="#000" opacity="0.7" />
      <circle cx="40" cy="52" r="4" stroke="#FFD700" strokeWidth="1.5" fill="none" />
      <line x1="40" y1="55" x2="40" y2="59" stroke="#FFD700" strokeWidth="1.5" />
      <rect x="12" y="36" width="8" height="5" rx="1" fill="#C9A84C" />
      <rect x="60" y="36" width="8" height="5" rx="1" fill="#C9A84C" />
      <path d="M12 25 Q30 18 48 22" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
      <defs>
        <linearGradient id="cameraGold" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="64" height="42" rx="6" fill="url(#cameraGold)" opacity="0.9" />
      <rect x="26" y="18" width="28" height="12" rx="3" fill="url(#cameraGold)" />
      <circle cx="40" cy="47" r="16" stroke="#000" strokeWidth="3" fill="url(#cameraGold)" opacity="0.5" />
      <circle cx="40" cy="47" r="10" fill="#0a0a0a" />
      <circle cx="40" cy="47" r="7" fill="url(#cameraGold)" opacity="0.4" />
      <rect x="14" y="30" width="10" height="6" rx="2" fill="rgba(255,255,255,0.3)" />
      <circle cx="37" cy="44" r="3" fill="rgba(255,255,255,0.4)" />
      <g opacity="0.4">
        <circle cx="28" cy="60" r="4" fill="#000" />
        <rect x="24" y="63" width="8" height="5" rx="1" fill="#000" />
        <circle cx="40" cy="60" r="4" fill="#000" />
        <rect x="36" y="63" width="8" height="5" rx="1" fill="#000" />
        <circle cx="52" cy="60" r="4" fill="#000" />
        <rect x="48" y="63" width="8" height="5" rx="1" fill="#000" />
      </g>
    </svg>
  );
}

function EventCardTilt({
  event,
  direction,
}: {
  event: {
    icon: React.ReactNode;
    name: string;
    tagline: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    ctaId: string;
    details: { label: string; value: string }[];
  };
  direction: "left" | "right";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    // map to [-8deg, 8deg]
    setRotate({ x: -yPct * 16, y: xPct * 16 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full flex flex-col p-10 transition-all duration-300 group"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
          background: "linear-gradient(135deg, #0d0d0d 0%, #1a1400 100%)",
          border: "1px solid rgba(212,175,55,0.25)",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            border: "1px solid rgba(212,175,55,0.8)",
            boxShadow: "0 0 40px rgba(212,175,55,0.15), inset 0 0 60px rgba(212,175,55,0.03)",
          }}
        />

        <div style={{ transform: "translateZ(30px)" }}>
          {event.icon}
        </div>

        <h3
          className="font-display text-white mt-6"
          style={{ fontSize: "3rem", lineHeight: 1.1, transform: "translateZ(40px)" }}
        >
          {event.name}
        </h3>
        
        <p
          className="font-sans mt-2"
          style={{ color: "var(--text-muted)", fontSize: "1.1rem", transform: "translateZ(30px)" }}
        >
          {event.tagline}
        </p>

        <p
          className="font-sans mt-6 leading-relaxed text-white/70"
          style={{ transform: "translateZ(20px)" }}
        >
          {event.description}
        </p>

        <div className="my-8 flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(212,175,55,0.6)", transform: "translateZ(20px)" }}>
          {event.details.map((detail, index) => (
            <div key={index} className="flex items-center gap-4">
              <span>{detail.label}</span>
              <span className="flex-1 overflow-hidden" style={{ color: "var(--gold)" }}>
                ────────────────────────────────────────────────
              </span>
              <span>{detail.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4" style={{ transform: "translateZ(50px)" }}>
          <a
            href={event.ctaHref}
            id={event.ctaId}
            className="hero-cta w-full block text-center"
          >
            {event.ctaLabel}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventCards() {
  const events = [
    {
      id: "treasure-hunt-card",
      icon: <TreasureChestIcon />,
      name: "Treasure Hunt",
      tagline: "Seek. Discover. Conquer.",
      description:
        "Navigate hidden clues across the campus in a thrilling team challenge. Rally your crew and race to uncover every secret.",
      ctaLabel: "Register for Treasure Hunt",
      ctaHref: "#treasure-hunt",
      ctaId: "event-card-cta-treasure",
      details: [
        { label: "Date", value: "9th April" },
        { label: "Team Size", value: "2–4 Members" },
        { label: "Format", value: "3 Rounds" },
      ],
    },
    {
      id: "viral-selfie-card",
      icon: <CameraIcon />,
      name: "Viral Selfie",
      tagline: "Strike a pose. Go viral.",
      description:
        "Capture the spirit of SMVITM in the most creative selfie — solo or squad. Show us your pride and make it go viral.",
      ctaLabel: "Register for Viral Selfie",
      ctaHref: "#viral-selfie",
      ctaId: "event-card-cta-selfie",
      details: [
        { label: "Duration", value: "April 9th - 14th" },
        { label: "Platform", value: "Instagram" },
        { label: "Participation", value: "Solo or Team" },
      ],
    },
  ];

  return (
    <section
      id="events"
      className="py-32 relative"
      style={{ backgroundColor: "#050505", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 overflow-hidden relative pb-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-white mb-6"
            style={{ fontSize: "5rem", letterSpacing: "0.02em" }}
          >
            The Events
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              height: "1px",
              background: "var(--gold)",
              width: "120px",
              margin: "0 auto",
              transformOrigin: "center"
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <EventCardTilt event={events[0]} direction="left" />
          <EventCardTilt event={events[1]} direction="right" />
        </div>

        {/* Detailed Event Rules Section */}
        <div className="mt-32 border-t pt-24" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-white/80 font-sans leading-relaxed">
            {/* Treasure Hunt Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-4xl gold-text mb-8">Treasure Hunt Rules</h3>
              <div className="space-y-8 text-sm md:text-base">
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Overview
                  </h4>
                  <p className="opacity-80">Participants will compete in teams to locate hidden "logo coins" across the campus using clues. Each discovery must be accompanied by sharing a meaningful experience related to SMVITM.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Team Structure
                  </h4>
                  <ul className="list-disc pl-5 opacity-80 space-y-1.5">
                    <li>Team size: 2–4 members</li>
                    <li>All participants must register before the event starts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Event Format
                  </h4>
                  <div className="space-y-4 opacity-80">
                    <p><strong className="text-white font-medium">Round 1: Clue-Based Hunt</strong><br/>Teams will receive hints to locate hidden logo coins. For each coin found, teams must share a genuine experience related to SMVITM. Top teams qualify for Round 2.</p>
                    <p><strong className="text-white font-medium">Round 2: Hunt with Hurdles</strong><br/>Teams must complete additional challenges to validate coins. For each coin found, teams must share a meaningful SMVITM experience. Top teams qualify for the Final Round.</p>
                    <p><strong className="text-white font-medium">Final Round: Social Media Challenge</strong><br/>Teams must visit the Photo Booth, capture a photo, and post it on Instagram by collaborating with the official SMVITM account.</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Rules & Regulations
                  </h4>
                  <ul className="list-disc pl-5 opacity-80 space-y-1.5">
                    <li>No tampering or hiding coins again</li>
                    <li>No interference with other teams</li>
                    <li>Any form of cheating leads to disqualification</li>
                    <li>Judges' decision is final</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Viral Selfie Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-4xl gold-text mb-8">Viral Selfie Rules</h3>
              <div className="space-y-8 text-sm md:text-base">
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Overview
                  </h4>
                  <p className="opacity-80">Participants will capture their best photo or selfie within the SMVITM campus and showcase it on Instagram.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Participation Rules
                  </h4>
                  <ul className="list-disc pl-5 opacity-80 space-y-1.5">
                    <li>Individual or team participation allowed</li>
                    <li>Photo/selfie must be taken within campus</li>
                    <li>Content must be original and relevant</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Submission Guidelines
                  </h4>
                  <ul className="list-disc pl-5 opacity-80 space-y-1.5">
                    <li>Capture selfies between 9th–14th April</li>
                    <li>All participants must post on 14th April (Mandatory)</li>
                    <li>Post on Instagram collaborating with official SMVITM account</li>
                    <li>Account must be public</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Winning Criteria
                  </h4>
                  <p className="opacity-80">Winners will be decided based on number of likes</p>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full"></span> Rules & Regulations
                  </h4>
                  <ul className="list-disc pl-5 opacity-80 space-y-1.5">
                    <li>No fake engagement</li>
                    <li>Inappropriate content leads to disqualification</li>
                    <li>Only one entry per participant/team</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
