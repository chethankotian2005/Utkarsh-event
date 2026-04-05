"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseVx: number;
  baseVy: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const [particleCount, setParticleCount] = useState(350);

  useEffect(() => {
    const updateParticleCount = () => {
      if (window.innerWidth < 768) {
        setParticleCount(80);
      } else if (window.innerWidth < 1024) {
        setParticleCount(180);
      } else {
        setParticleCount(350);
      }
    };

    updateParticleCount();
    window.addEventListener("resize", updateParticleCount);
    return () => window.removeEventListener("resize", updateParticleCount);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const colors = ["rgba(212,175,55,0.5)", "rgba(255,215,0,0.3)", "rgba(255,255,255,0.15)"];
    
    // Spawn a viewport-aware particle count
    const particles: Particle[] = Array.from({ length: particleCount }).map(() => {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: Math.random() * 1.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isHovering = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      mouseRef.current.x = touch.clientX;
      mouseRef.current.y = touch.clientY;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const { x: mx, y: my, isHovering } = mouseRef.current;

      for (const p of particles) {
        if (!prefersReducedMotion) {
          if (isHovering) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < 180 && dist > 1) {
              const force = 1000 / distSq;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            }
          }

          // Drag to normalize
          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;

          // Cap velocity
          const speedSq = p.vx * p.vx + p.vy * p.vy;
          if (speedSq > 16) {
            const speed = Math.sqrt(speedSq);
            p.vx = (p.vx / speed) * 4;
            p.vy = (p.vy / speed) * 4;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(updateAndDraw);
    };

    if (!prefersReducedMotion) {
      updateAndDraw();
    } else {
      // Draw static once
      updateAndDraw();
      cancelAnimationFrame(animationRef.current!);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
