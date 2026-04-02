"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  teamName: string;
  eventName: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, teamName, eventName, onClose }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-dismiss after 3s
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

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
            className="relative z-10 flex flex-col items-center text-center"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
