"use client";

import { motion, Variants } from "framer-motion";

function TreasureChestIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
      <defs>
        <linearGradient id="chestGold" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      {/* Chest body */}
      <rect x="8" y="38" width="64" height="34" rx="4" fill="url(#chestGold)" opacity="0.9" />
      {/* Chest lid */}
      <path d="M8 38 Q8 20 40 16 Q72 20 72 38 Z" fill="url(#chestGold)" />
      {/* Lock */}
      <rect x="30" y="48" width="20" height="14" rx="3" fill="#000" opacity="0.7" />
      <circle cx="40" cy="52" r="4" stroke="#FFD700" strokeWidth="1.5" fill="none" />
      <line x1="40" y1="55" x2="40" y2="59" stroke="#FFD700" strokeWidth="1.5" />
      {/* Hinges */}
      <rect x="12" y="36" width="8" height="5" rx="1" fill="#C9A84C" />
      <rect x="60" y="36" width="8" height="5" rx="1" fill="#C9A84C" />
      {/* Shine */}
      <path d="M12 25 Q30 18 48 22" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
      <defs>
        <linearGradient id="cameraGold" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      {/* Camera body */}
      <rect x="8" y="26" width="64" height="42" rx="6" fill="url(#cameraGold)" opacity="0.9" />
      {/* Viewfinder */}
      <rect x="26" y="18" width="28" height="12" rx="3" fill="url(#cameraGold)" />
      {/* Lens ring */}
      <circle cx="40" cy="47" r="16" stroke="#000" strokeWidth="3" fill="url(#cameraGold)" opacity="0.5" />
      <circle cx="40" cy="47" r="10" fill="#0a0a0a" />
      <circle cx="40" cy="47" r="7" fill="url(#cameraGold)" opacity="0.4" />
      {/* Flash */}
      <rect x="14" y="30" width="10" height="6" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* Shine */}
      <circle cx="37" cy="44" r="3" fill="rgba(255,255,255,0.4)" />
      {/* People silhouettes suggestion */}
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function EventCards() {
  const events = [
    {
      id: "treasure-hunt-card",
      icon: <TreasureChestIcon />,
      name: "Treasure Hunt",
      tagline: "Seek. Discover. Conquer.",
      description:
        "Navigate hidden clues across the campus in a thrilling team challenge. Rally your crew and race to uncover every secret.",
      rules: null, // TODO: Add rules here
      timeInfo: null, // TODO: Add time & duration here
      ctaLabel: "Register for Treasure Hunt",
      ctaHref: "#treasure-hunt",
      ctaId: "event-card-cta-treasure",
      teamInfo: "Teams of 5 (1 Lead + 4 Members)",
    },
    {
      id: "viral-selfie-card",
      icon: <CameraIcon />,
      name: "SMVITM Viral Selfie",
      tagline: "Strike a pose. Go viral.",
      description:
        "Capture the spirit of SMVITM in the most creative selfie — solo or squad. Show us your pride and make it go viral.",
      rules: null, // TODO: Add rules here
      timeInfo: null, // TODO: Add time & duration here
      ctaLabel: "Register for Viral Selfie",
      ctaHref: "#viral-selfie",
      ctaId: "event-card-cta-selfie",
      teamInfo: "Individual or Group (No member limit)",
    },
  ];

  return (
    <section
      id="events"
      className="section-padding relative"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-widest mb-3"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "var(--gold)",
              letterSpacing: "0.2em",
            }}
          >
            MY SMVITM, MY PRIDE
          </p>
          <h2
            className="font-display"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            The <span className="gold-text">Events</span>
          </h2>
          <div className="gold-line mt-6 mx-auto" style={{ width: 120 }} />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              id={event.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-8 flex flex-col gap-6 group"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                {event.icon}
              </div>

              {/* Event Name */}
              <div>
                <h3
                  className="font-display gold-text"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {event.name}
                </h3>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "0.7rem",
                    color: "var(--gold-muted)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {event.tagline}
                </p>
              </div>

              {/* Description */}
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                {event.description}
              </p>

              {/* Team Info Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 8,
                  padding: "6px 14px",
                  width: "fit-content",
                }}
              >
                <span style={{ color: "var(--gold)", fontSize: "0.75rem", fontFamily: "var(--font-space-mono)" }}>
                  {event.teamInfo}
                </span>
              </div>

              {/* Rules Placeholder */}
              <div
                style={{
                  border: "1px dashed rgba(201,168,76,0.2)",
                  borderRadius: 8,
                  padding: "16px",
                  background: "rgba(201,168,76,0.03)",
                }}
              >
                {/* TODO: Add rules here */}
                <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.65rem", color: "rgba(201,168,76,0.4)", letterSpacing: "0.1em" }}>
                  📋 RULES — COMING SOON
                </p>
              </div>

              {/* Time & Duration Placeholder */}
              <div className="flex gap-4">
                <div
                  style={{
                    flex: 1,
                    border: "1px dashed rgba(201,168,76,0.2)",
                    borderRadius: 8,
                    padding: "12px",
                    background: "rgba(201,168,76,0.03)",
                  }}
                >
                  {/* TODO: Add time here */}
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.6rem", color: "rgba(201,168,76,0.4)", letterSpacing: "0.1em" }}>
                    🕐 TIME — TBD
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    border: "1px dashed rgba(201,168,76,0.2)",
                    borderRadius: 8,
                    padding: "12px",
                    background: "rgba(201,168,76,0.03)",
                  }}
                >
                  {/* TODO: Add duration here */}
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.6rem", color: "rgba(201,168,76,0.4)", letterSpacing: "0.1em" }}>
                    ⏱ DURATION — TBD
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href={event.ctaHref}
                id={event.ctaId}
                className="btn-gold px-6 py-4 rounded text-center mt-auto text-sm"
              >
                {event.ctaLabel}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
