"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const WHATSAPP_LINKS = {
  treasureHunt: "https://chat.whatsapp.com/K6ch7MN9jLm4GYuVm4fUhR",
  viralSelfie: "https://chat.whatsapp.com/J6cA0Gu56F3IlbBvigUmRc",
} as const;

interface SuccessModalProps {
  isOpen: boolean;
  teamName: string;
  eventName: string;
  eventType: "treasureHunt" | "viralSelfie";
  onClose: () => void;
}

export default function SuccessModal({ isOpen, teamName, eventName, eventType, onClose }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Keep auto-dismiss behavior, but allow enough time for WhatsApp CTA interaction.
    const timer = setTimeout(() => {
      onClose();
    }, 7000);

    const canvas = canvasRef.current;
    if (!canvas) return () => clearTimeout(timer);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => clearTimeout(timer);

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; life: number }[] = [];
    const colors = ["rgba(255, 215, 0, ", "rgba(212, 175, 55, ", "rgba(255, 255, 255, "];

    // Generate 60 particles
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life -= 0.015; // fade out

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.life})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Confetti Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-[520px] flex-col items-center px-6 text-center"
          >
            <div
              className="mb-6"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                filter: "drop-shadow(0 0 30px rgba(212,175,55,0.8))"
              }}
            >
              <Image
                src="/utkarsh-logo.jpg"
                alt="Utkarsh Logo"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            
            <h2 className="font-display text-white text-4xl md:text-6xl mb-2">
              Registration Confirmed
            </h2>
            
            <p className="font-mono text-gold uppercase tracking-[0.2em] text-sm mt-4">
              {eventName}
            </p>
            
            <p className="font-sans text-white/70 text-lg mt-2">
              Team: <span className="text-white font-medium">{teamName}</span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
              className="whatsapp-card"
              style={{
                marginTop: "28px",
                border: "1px solid rgba(37,211,102,0.4)",
                borderTop: "3px solid #25D366",
                background: "rgba(37,211,102,0.05)",
                padding: "24px 28px",
                textAlign: "center",
                maxWidth: "420px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.858L0 24l6.335-1.508A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.867 9.867 0 0 1 2.118 12C2.118 6.963 6.963 2.118 12 2.118c5.036 0 9.882 4.845 9.882 9.882 0 5.036-4.846 9.882-9.882 9.882z" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "1rem",
                    color: "#25D366",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  Join the WhatsApp Group
                </span>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "20px",
                  lineHeight: 1.6,
                }}
              >
                Stay updated with event announcements, clue drops, and results. Join the official group for{" "}
                <strong style={{ color: "#fff" }}>
                  {eventType === "treasureHunt" ? "Treasure Hunt" : "SMVITM Viral Selfie"}
                </strong>
                .
              </p>

              <a
                href={WHATSAPP_LINKS[eventType]}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-join-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#25D366",
                  color: "#000",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  padding: "14px 32px",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "background 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1ebe5d")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
              >
                Join Now -&gt;
              </a>

              <p
                style={{
                  marginTop: "14px",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.08em",
                }}
              >
                Opens WhatsApp in a new tab
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
